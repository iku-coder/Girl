// life.js を ヒロイン設定.md の〈太った後の性格・生活の変化〉から作り直す
//   node tools/gen_life.js /home/claude/girl/docs/ヒロイン設定.md > life.js
const fs = require('fs');
const md = fs.readFileSync(process.argv[2] || '/home/claude/girl/docs/ヒロイン設定.md', 'utf8').split('\n');
const IDS = { 'ひなた': 'hinata', '沙耶': 'saya', '玲奈': 'reina', '雪乃': 'yukino', '小百合': 'sayuri', 'つばさ': 'tsubasa', 'ことり': 'kotori',
  '莉緒': 'rio', '怜': 'rei', '栞': 'shiori', '葵': 'aoi', '真理子': 'mariko', 'すみれ': 'sumire', '澪': 'mio', '渚': 'nagisa', '千早': 'chihaya',
  '凛': 'rin', '香蓮': 'karen', '姫華': 'himeka', '春香': 'haruka', '杏': 'anzu', '菜々': 'nana', '冴子': 'saeko', '綾乃': 'ayano', 'しずく': 'shizuku',
  '葉月': 'hazuki', '蘭': 'ran', '小夏': 'konatsu', 'もも': 'momo', '律': 'ritsu', '静香': 'shizuka', '文乃': 'fumino', '理沙': 'risa',
  'ルミ': 'rumi', 'キララ': 'kirara', 'ジュリ': 'juri', '澄香': 'sumika', 'ひまり': 'himari',
  '紗月': 'satsuki', '真央': 'mao', '小町': 'komachi', 'まどか': 'madoka', '夏帆': 'kaho', 'こはる': 'koharu', '京子': 'kyoko', '美鈴': 'misuzu', '夕子': 'yuko' };
const KEYMAP = { '大学・バイト': '仕事', '大学': '仕事', 'バイト': '仕事', '仕事・大学': '仕事' };
const out = {};
let cur = null, inLife = false, ph = null;
for (const raw of md) {
  const l = raw.replace(/\r$/, '');
  if (l.startsWith('■')) {
    inLife = false; ph = null; cur = null;
    const m = l.match(/([^\s　（]+)\s+([^\s　（]+)（[^）]*）/g);   // 「姓 名（よみ）」
    if (m) { const last = m[m.length - 1].match(/([^\s　（]+)\s+([^\s　（]+)（/); if (last && IDS[last[2]] && !(l.includes('・') && m.length > 1 && /双子|母娘|嫁と姑|お嬢様と|三姉妹|コンビ|御堂家（/.test(l))) cur = IDS[last[2]]; }
    continue;
  }
  if (!cur) continue;
  if (l.startsWith('〈')) { inLife = /〈太った後の性格・生活の変化/.test(l); ph = null; if (inLife) out[cur] = out[cur] || { phases: [] }; continue; }
  if (!inLife) continue;
  const lowM = l.match(/低いまま太った場合は、(.+?)。?$/);
  if (lowM && !out[cur].lowNote) { out[cur].lowNote = lowM[1].replace(/。$/, ''); continue; }
  const hm = l.match(/^▼段階(\d+)〜(\d+)[^　\s]*[　\s]+(.+)$/);
  if (hm) { const name = hm[3].replace(/（[^）]*型）/, '').replace(/[（(].*$/, '').trim(); ph = { from: +hm[1], to: +hm[2], name, items: {} }; out[cur].phases.push(ph); continue; }
  if (l.startsWith('▼')) { ph = null; continue; }
  const sm = l.match(/^・段階(\d+)〜(\d+)（([^）・]+)[^）]*）：(.+)$/);   // 1行の形：・段階5〜8（強がり）：…
  if (sm) { if (+sm[1] >= 5) out[cur].phases.push({ from: +sm[1], to: +sm[2], name: sm[3], items: { '様子': sm[4] } }); ph = null; continue; }
  const im = l.match(/^・([^：]{1,12})：(.+)$/);
  if (im && ph) { const k = KEYMAP[im[1]] || im[1]; ph.items[k] = ph.items[k] ? ph.items[k] + '　' + im[2] : im[2]; }
}
Object.keys(out).forEach(id => { if (!out[id].phases.length) delete out[id]; });
process.stdout.write('/* 体型が変わったあとの生活の変化（ヒロイン設定.md の〈太った後の性格・生活の変化〉から tools/gen_life.js で自動生成。元の資料を直したら作り直す）\n   phases: 段階の範囲ごとの 心理・性格・食生活・仕事・生活・口調 など。lowNote: 親密度が低いまま太った場合の出方 */\nwindow.GAME_LIFE = ' + JSON.stringify(out, null, 1) + ';\n');
console.error(Object.keys(out).length + '人: ' + Object.entries(out).map(([k, v]) => k + v.phases.length).join(' '));
