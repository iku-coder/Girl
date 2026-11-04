# ひだまり荘の BGM・効果音を合成する（numpy）。python3 tools/audio/synth.py → audio/bgm/*.mp3, audio/se/*.mp3
import numpy as np, subprocess, os, wave
SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'audio')
rng = np.random.default_rng(7)

def hz(n): return 440.0 * 2 ** ((n - 69) / 12)
def env_adsr(n, a, d, s, r, sus_len):
    t = np.arange(n) / SR
    e = np.zeros(n)
    a_n, d_n = int(a * SR), int(d * SR)
    e[:a_n] = np.linspace(0, 1, a_n, endpoint=False) if a_n else 0
    e[a_n:a_n + d_n] = np.linspace(1, s, d_n, endpoint=False)
    s_end = min(n, int(sus_len * SR))
    e[a_n + d_n:s_end] = s
    rel = n - s_end
    if rel > 0: e[s_end:] = s * np.exp(-np.arange(rel) / SR / (r / 4))
    return e

# ---- 楽器 ----
def musicbox(note, dur, vel=1.0):
    n = int((dur + 2.5) * SR); t = np.arange(n) / SR; f = hz(note)
    y = (np.sin(2*np.pi*f*t) * np.exp(-t*2.2) + 0.45*np.sin(2*np.pi*f*2.0*t)*np.exp(-t*4.5)
         + 0.25*np.sin(2*np.pi*f*3.01*t)*np.exp(-t*7) + 0.15*np.sin(2*np.pi*f*5.43*t)*np.exp(-t*12))
    y *= np.minimum(1, t / 0.002)
    return y * 0.32 * vel
def glock(note, dur, vel=1.0):
    n = int((dur + 1.5) * SR); t = np.arange(n) / SR; f = hz(note)
    y = np.sin(2*np.pi*f*t)*np.exp(-t*3.5) + 0.3*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*9) + 0.12*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*16)
    return y * np.minimum(1, t / 0.001) * 0.22 * vel
def piano(note, dur, vel=1.0):
    n = int((dur + 1.8) * SR); t = np.arange(n) / SR; f = hz(note)
    y = np.zeros(n)
    for k, a in enumerate([1, .55, .32, .2, .12, .07], 1):
        y += a * np.sin(2*np.pi*f*k*(1 + 0.0004*k*k)*t) * np.exp(-t * (1.1 + 0.9*k) * (0.6 + f/900))
    e = np.minimum(1, t / 0.004)
    rel_at = int(dur * SR); e[rel_at:] *= np.exp(-np.arange(n - rel_at) / SR / 0.12)
    return y * e * 0.22 * vel
def pluck(note, dur, vel=1.0):   # ウクレレ風（Karplus-Strong）
    f = hz(note); p = int(SR / f); n = int((dur + 0.8) * SR)
    buf = rng.uniform(-1, 1, p); y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    e = np.ones(n); rel_at = int(dur * SR); e[rel_at:] *= np.exp(-np.arange(n - rel_at) / SR / 0.08)
    return y * e * 0.28 * vel
def pad(note, dur, vel=1.0):
    n = int((dur + 1.2) * SR); t = np.arange(n) / SR; f = hz(note)
    y = sum(np.sin(2*np.pi*f*d*t) + 0.3*np.sin(2*np.pi*2*f*d*t) for d in (0.997, 1.0, 1.004))
    return y * env_adsr(n, 0.5, 0.4, 0.8, 1.0, dur) * 0.05 * vel
def bass(note, dur, vel=1.0):
    n = int((dur + 0.3) * SR); t = np.arange(n) / SR; f = hz(note)
    y = np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*2*f*t)
    return y * env_adsr(n, 0.01, 0.2, 0.6, 0.2, dur * 0.9) * 0.22 * vel
def shaker(dur=0.08, vel=1.0):
    n = int(dur * SR); y = rng.normal(0, 1, n); y = np.diff(np.concatenate([[0], y]))   # 高い音だけ
    return y * np.exp(-np.arange(n) / SR / 0.025) * 0.04 * vel
def kick(vel=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2*np.pi*(55 + 70*np.exp(-t*30))*t) * np.exp(-t*14) * 0.3 * vel

INST = dict(mb=musicbox, gl=glock, pi=piano, pl=pluck, pad=pad, bs=bass)

def reverb(x, secs=1.8, wet=0.25):
    n = int(secs * SR); ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR / (secs / 5))
    ir[0] = 0; ir /= np.sqrt((ir ** 2).sum())
    from scipy.signal import fftconvolve
    w = np.stack([fftconvolve(x[:, c], ir * (1 if c == 0 else -1) )[:len(x)] for c in range(2)], 1)
    return x * (1 - wet) + w * wet * 3

def render(events, length, loop=True):
    """events: (start秒, 楽器, ノート, 長さ秒, 音量, パン)。loop なら最後のはみ出しを頭に回す"""
    total = int(length * SR); tail = int(4 * SR)
    mix = np.zeros((total + tail, 2))
    for st, ins, note, dur, vel, pan in events:
        y = INST[ins](note, dur, vel) if ins in INST else (shaker(vel=vel) if ins == 'sh' else kick(vel))
        i = int(st * SR); j = min(len(mix), i + len(y)); y = y[:j - i]
        mix[i:j, 0] += y * np.sqrt(1 - pan); mix[i:j, 1] += y * np.sqrt(pan)
    mix = reverb(mix)
    if loop: mix[:tail] += mix[total:total + tail]; mix = mix[:total]
    else: mix = mix[:total + int(1.5 * SR)]
    peak = np.abs(mix).max(); mix = mix / peak * 0.8 if peak > 0 else mix
    return mix

def save(mix, path, kbps=96):
    wav = path.replace('.mp3', '.wav')
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(wav, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', f'{kbps}k', path], check=True)
    os.remove(wav)

# ---- 作曲の道具 ----
SCALE = {'maj': [0, 2, 4, 5, 7, 9, 11], 'min': [0, 2, 3, 5, 7, 8, 10]}
def deg(root, d, mode='maj'):   # 音階の度数（0始まり、負もOK）→ MIDI
    s = SCALE[mode]; o, i = divmod(d, 7); return root + 12 * o + s[i]
def chord(root, d, mode='maj', n=3): return [deg(root, d + 2 * k, mode) for k in range(n)]

def song(bpm, bars, prog, mel, root, mode='maj', lead='mb', comp='pi', style='arp', perc=None, bassline=True, padv=0.0, lead_oct=12, beats=4):
    """prog: 小節ごとの和音の度数。mel: 小節ごとの [(拍, 度数, 拍数), ...]（度数 None は休符）"""
    b = 60 / bpm; ev = []
    for bar in range(bars):
        c = prog[bar % len(prog)]; t0 = bar * beats * b
        ch = chord(root, c, mode)
        if bassline: ev += [(t0, 'bs', deg(root - 12, c, mode), b * 1.8, 0.9, .5), (t0 + 2 * b, 'bs', deg(root - 12, c + (4 if beats == 4 else 0), mode), b * 1.8, 0.7, .5)] if beats == 4 else [(t0, 'bs', deg(root - 12, c, mode), b * 2.6, 0.9, .5)]
        if style == 'arp':
            pat = [0, 1, 2, 1, 0, 1, 2, 1] if beats == 4 else [0, 1, 2, 1, 2, 1]
            for k, ix in enumerate(pat): ev.append((t0 + k * b / 2, comp, ch[ix] + (12 if ix == 2 and k % 4 == 2 else 0), b * 0.9, 0.55, .35 + .1 * (k % 2)))
        elif style == 'block':
            for k in range(beats):
                for nt in ch: ev.append((t0 + k * b, comp, nt, b * 0.8, 0.4 if k % 2 else 0.55, .4))
        elif style == 'strum':
            for k in [0, 1.5, 2, 3, 3.5][:5]:
                for m, nt in enumerate(ch): ev.append((t0 + k * b + m * 0.012, comp, nt, b * 0.7, 0.5 if k in (0, 2) else 0.35, .3 + .2 * m / 3))
        elif style == 'waltz':
            ev.append((t0, comp, deg(root - 12, c, mode), b * 0.9, 0.6, .45))
            for k in (1, 2):
                for nt in ch: ev.append((t0 + k * b, comp, nt, b * 0.7, 0.35, .5))
        if padv: ev += [(t0, 'pad', nt, beats * b, padv, .5) for nt in ch]
        if perc:
            for k in range(beats * 2): ev.append((t0 + k * b / 2, 'sh', 0, 0, 1.0 if k % 2 else 0.5, .6))
            if perc == 'kick': ev += [(t0 + k * b, 'kick', 0, 0, 0.8, .5) for k in (0, 2)]
        for (bt, d, ln) in mel[bar % len(mel)]:
            if d is None: continue
            ev.append((t0 + bt * b, lead, deg(root + lead_oct, d, mode), ln * b, 0.9, .55))
    return ev, bars * beats * b

def M(*notes):   # 'beat:degree:len' の並び
    return [tuple(float(x) if i != 1 else (None if x == 'r' else int(x)) for i, x in enumerate(s.split(':'))) for s in notes]

TRACKS = {}
# 1. タイトル：ひだまり（F・オルゴール）
mel_title = [M('0:4:1','1:2:1','2:4:1','3:5:1'), M('0:7:2','2:5:1','3:4:1'), M('0:3:1','1:4:1','2:5:1','3:3:1'), M('0:2:3'),
             M('0:4:1','1:5:1','2:7:1','3:8:1'), M('0:9:1.5','1.5:8:0.5','2:7:2'), M('0:5:1','1:4:1','2:3:1','3:1:1'), M('0:0:3')]
TRACKS['title'] = song(76, 16, [0, 5, 3, 4, 0, 5, 1, 4], mel_title, 65, lead='mb', comp='pi', style='arp', padv=0.5)
# 2. 朝・昼の日常（C・ウクレレとグロッケン、軽い）
mel_day = [M('0:4:0.5','0.5:5:0.5','1:7:1','2:5:1','3:4:1'), M('0:2:1','1:4:1','2:3:2'), M('0:3:0.5','0.5:4:0.5','1:5:1','2:7:1','3:9:1'), M('0:8:1','1:7:1','2:5:2'),
           M('0:4:1','1:5:0.5','1.5:4:0.5','2:2:1','3:0:1'), M('0:1:1','1:2:1','2:4:2'), M('0:5:1','1:4:1','2:2:1','3:1:1'), M('0:0:2','2:r:2')]
TRACKS['day'] = song(104, 16, [0, 3, 5, 4, 0, 3, 1, 4], mel_day, 60, lead='gl', comp='pl', style='strum', perc='sh')
# 3. 夕方（A♭・ピアノ、少しせつない）
mel_eve = [M('0:4:2','2:5:1','3:4:1'), M('0:2:3','3:1:1'), M('0:0:1','1:2:1','2:4:1','3:7:1'), M('0:5:4'),
           M('0:4:2','2:5:1','3:7:1'), M('0:8:2','2:7:1','3:5:1'), M('0:4:1','1:3:1','2:2:1','3:1:1'), M('0:0:4')]
TRACKS['evening'] = song(80, 16, [0, 2, 5, 3, 0, 2, 3, 4], mel_eve, 68, lead='pi', comp='pi', style='arp', padv=0.6, lead_oct=12)
# 4. 夜・深夜（Fメジャー寄りの静かなワルツ、オルゴール）
mel_night = [M('0:4:2','2:2:1'), M('0:3:3'), M('0:2:1','1:1:1','2:2:1'), M('0:0:3'), M('0:4:2','2:5:1'), M('0:7:3'), M('0:5:1','1:4:1','2:3:1'), M('0:4:3')]
TRACKS['night'] = song(62, 16, [0, 3, 5, 4, 0, 3, 1, 4], mel_night, 65, lead='mb', comp='pi', style='waltz', padv=0.7, beats=3)
# 5. ヒロインの部屋（G・ピアノとベース、のんびり）
mel_room = [M('0:2:1','1:4:1','2:5:1.5','3.5:4:0.5'), M('0:2:2','2:0:2'), M('0:1:1','1:2:1','2:4:1','3:2:1'), M('0:1:3','3:r:1'),
            M('0:2:1','1:4:1','2:7:1.5','3.5:5:0.5'), M('0:4:2','2:2:2'), M('0:3:1','1:2:1','2:1:1','3:-1:1'), M('0:0:3','3:r:1')]
TRACKS['room'] = song(88, 16, [0, 5, 1, 4, 0, 5, 3, 4], mel_room, 67, lead='pi', comp='pi', style='block', padv=0.4)
# 6. 外出（D・ウクレレとシェイカー、足取り軽く）
mel_town = [M('0:0:0.5','0.5:2:0.5','1:4:0.5','1.5:5:0.5','2:7:1','3:5:1'), M('0:4:1','1:2:1','2:4:2'), M('0:3:0.5','0.5:4:0.5','1:5:1','2:3:1','3:1:1'), M('0:2:3','3:r:1'),
            M('0:0:0.5','0.5:2:0.5','1:4:0.5','1.5:5:0.5','2:7:1','3:9:1'), M('0:8:1','1:7:1','2:5:2'), M('0:4:1','1:5:1','2:3:1','3:1:1'), M('0:0:2','2:r:2')]
TRACKS['town'] = song(116, 16, [0, 4, 3, 4, 0, 4, 3, 0], mel_town, 62, lead='gl', comp='pl', style='strum', perc='kick')

def sfx():
    S = {}
    def seq(notes, ins='gl', gap=0.08, ln=0.2, vel=1.0):
        return [(i * gap, ins, n, ln, vel, .5) for i, n in enumerate(notes)]
    S['tap'] = ([(0, 'gl', 96, 0.03, 0.35, .5)], 0.25)
    S['select'] = ([(0, 'gl', 84, 0.05, 0.6, .5), (0.05, 'gl', 91, 0.05, 0.5, .5)], 0.35)
    S['cancel'] = ([(0, 'gl', 79, 0.05, 0.5, .5), (0.06, 'gl', 72, 0.08, 0.5, .5)], 0.4)
    S['door'] = ([(0, 'mb', 76, 0.4, 1, .5), (0.42, 'mb', 72, 0.8, 1, .5)], 1.6)           # ピンポン
    S['gift'] = (seq([84, 88, 91, 96], gap=0.06), 0.9)
    S['eat'] = ([(i * 0.11, 'pl', 72 + (i % 2) * 3, 0.06, 0.8, .5) for i in range(4)], 0.7)
    S['up'] = (seq([72, 76, 79, 84], ins='mb', gap=0.07), 1.2)                              # 体重が増えた
    S['stage'] = (seq([67, 72, 76, 79, 84, 88], ins='mb', gap=0.09, ln=0.4) + [(0.6, 'pad', n, 0.8, 1.2, .5) for n in (72, 76, 79)], 2.2)
    S['heart'] = ([(0, 'mb', 81, 0.2, 1, .5), (0.14, 'mb', 88, 0.6, 1, .5)], 1.2)           # 親密度アップ
    S['capture'] = ([(0, 'pi', n, 0.25, 0.9, .5) for n in (60, 64, 67)] + seq([72, 76, 79], ins='gl', gap=0.12, ln=0.2)
                    + [(0.45, 'pi', n, 1.2, 1.0, .5) for n in (65, 69, 72)] + [(0.45, 'gl', 81, 0.3, 1, .5), (0.75, 'gl', 84, 1.2, 1, .5)]
                    + [(0.45, 'pad', n, 1.4, 1.4, .5) for n in (65, 69, 72, 77)], 3.0)
    S['coin'] = ([(0, 'gl', 88, 0.06, 0.8, .5), (0.07, 'gl', 95, 0.3, 0.8, .5)], 0.7)
    S['buy'] = ([(0, 'gl', 91, 0.05, 0.6, .5), (0.09, 'gl', 91, 0.05, 0.6, .5)], 0.5)
    S['night'] = (seq([79, 76, 72, 67], ins='mb', gap=0.18, ln=0.5), 2.2)                   # 1日の終わり
    S['phone'] = ([(0, 'gl', 88, 0.08, 0.7, .5), (0.12, 'gl', 88, 0.08, 0.7, .5)], 0.6)
    S['refuse'] = ([(0, 'pi', 55, 0.15, 0.8, .5), (0.16, 'pi', 54, 0.3, 0.8, .5)], 0.8)
    S['achv'] = (seq([79, 84, 88, 91], ins='gl', gap=0.08, ln=0.3) + [(0.32, 'mb', 96, 0.8, 0.8, .5)], 1.6)
    return S

if __name__ == '__main__':
    import sys
    only = sys.argv[1:]
    for k, (ev, ln) in TRACKS.items():
        if only and k not in only: continue
        save(render(ev, ln, loop=True), os.path.join(OUT, 'bgm', k + '.mp3'), 96); print('bgm', k, round(ln, 1), 's')
    for k, (ev, ln) in sfx().items():
        if only and k not in only: continue
        save(render(ev, ln, loop=False) * 0.9, os.path.join(OUT, 'se', k + '.mp3'), 96); print('se', k)
