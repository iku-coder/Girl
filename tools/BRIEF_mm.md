# 桃瀬母娘の登録（scenes/hero/haruka.js・scenes/hero/anzu.js）

ブラウザゲーム「ひだまり荘」に、ひだまりレジデンス**204号室**の**桃瀬 春香（母・37）と桃瀬 杏（娘・20）**を登録する。全員成人。日本語で書く。主人公は20歳・大学2年、ひだまり荘の管理人で、ひだまりレジデンスのオーナー。ふくよかな女性が好みで、女性の身長・体重・スリーサイズが見える「観察眼」を持つ。ヒロインに食べさせて少しずつ太らせる交流ゲーム。

## 設定
- /home/claude/girl/docs/ヒロイン設定.md の「■ひだまりレジデンス（部屋番号は未定）　桃瀬 春香・桃瀬 杏」（共通）、「■桃瀬 春香」、「■桃瀬 杏」の節を**全部**読む（`grep -n "桃瀬" /home/claude/girl/docs/ヒロイン設定.md`）
- 手本：/home/claude/hidamari/heroines.js（データとセリフの形。双子の mio・nagisa が近い）、/home/claude/hidamari/scenes/mio.js・scenes/daily/mio.js・scenes/room/mio.js（シーンの書き方）、/home/claude/hidamari/scenes.js の冒頭コメント（シーンの書式）
- 共通のセリフの予備：/home/claude/hidamari/data.js の commonLines

## ゲーム側でもう動いている仕組み
- 2人は同じ部屋（mansion 204）。`twinOf` で相手を指すと、部屋で差し入れたとき、その場にいるもう1人が3割をもらう。`mm` でも相手を指す（母娘の仕組み）。母は `mother: true`
- **嫉妬ゲージ**：2人とも親密度35以上で動く。もう1人に差し入れ・外食をすると上がり、毎晩下がる。50以上のほうは「張り合い食い」（差し入れ1.3倍）
- **取り合い**（35%、2人がそろっていて2人とも35以上のとき）：エンジンが「（2人が座布団をたたいた）」→ 2人の `mmTake` の一言 → 選択肢「春香の隣／杏の隣／2人のあいだ」。選ばれた側は `mmTakeWin`、選ばれなかった側は `mmTakeLose` を言う
- **宣戦布告**（2人とも好意70以上、夜か休日、一度だけ）：type `mmWar` のシーン（春香のファイルに書く。cast: ['anzu']）
- **攻略**：2人とも特別（91）以上で先に95に届いたら、母娘ルートの攻略シーン type `mmCapture`（春香のファイルに書く。cast: ['anzu']）。1人だけなら、その人の `capture` の言葉が出て、もう1人は `mmResign` の一言で身を引く

## 1ファイル＝1人
```js
window.GAME_DATA = window.GAME_DATA || { heroines: [] };
window.GAME_DATA.heroines.push({
  id: 'haruka', building: 'mansion', room: '204', twinOf: 'anzu', mm: 'anzu', mother: true,   // 杏は twinOf: 'haruka', mm: 'haruka'（mother は書かない）
  name: '桃瀬 春香', age: 37, job: '…', height, weight, appetite: 0.9, color: '#…',
  likes: [...], dislikes: [...],          // sweet・snack・fried・meal・alcohol・cold・hot から
  schedule: { weekday: [...], weekend: [...] },   // 春香は昼・夕が多い、杏は大学とバイトで夜が多い。2人そろうのは夜と休日（設定のゲームバランスの提案）
  startAffection: 20,                     // 杏は 15
  bodyType: { frame, fat }, sizes: { bust, under, waist, hip },
  images: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, `img/haruka_${i + 1}.png`])),   // 立ち絵は15枚そろっている
  lines: { … }
});
window.addScenes('haruka', [ … ]);
```

## lines（文字列の配列。tier 別は「配列の配列」4つ＝よそよそしい・顔なじみ・好意・特別）
greetMorning・greet・talk（各段2つ）・rent・giftLike・giftDislike・wary・full・handGiftOk・handGiftNo・careGift・cheatDay（tier 別4段）、lateMeal_jiro・lateMeal_famires（各2）、capture（攻略の告白3〜4行。1人だけ攻略したとき）、**mmTake・mmTakeWin・mmTakeLose**（各2〜3。母娘の取り合い）、**mmResign**（1〜2。もう1人が主人公と結ばれて身を引く一言）、**mmWar**（1〜2。シーンが無いときの予備）

## シーン（type と数）
- 各人：`morning` 4本（if: tiers [0]〜[3] を1本ずつ）、`rent` 1本（tiers [1]）、`package` 1本、`talk` 9本（tiers [1]・[2]・[3] 各3本。体型の変化の話題は minStage 5 以上）、`visit` 2本、`invite` 1本（captured: true）、`night` 1本（captured: true。最後は必ず '（——部屋の灯りを消した）' → '（翌朝）' と翌朝の短い会話）
- 2人そろう場面は cast: ['相手の id'] を付け、セリフは ['@相手のid', '…'] で相手に話させる
- 春香のファイルだけ：`mmWar` 1本（宣戦布告。設定の〈母娘ルート〉どおり。cast: ['anzu']、選択肢2〜3で aff と終わり方が変わる）、`mmCapture` 1本（母娘ルートの攻略。雨の夜の父からの電話 → 2人が「どっちか選んで」→「選べない」→ 笑う → '（——部屋の灯りを消した）' → '（翌朝）' 3人の朝ごはん。cast: ['anzu']）
- id は「<id>_mm01〜」の通し番号。フラグは mm_ で始める
- 父は電話の声と地の文だけ。父が出る場面では不倫をにおわせない。**性的な行為・体の性的な描写は一切書かない**（暗転で省略）。母娘どうしの性的なやりとりは描かない
- 呼び方：設定の「呼び方」に合わせる（春香は「〇〇ちゃん」など）。段階で変わるなら tier 別の配列でそろえる

## 確認
`cd /home/claude/hidamari && node tools/check_scenes.js scenes/hero/<id>.js` でエラー0。担当以外のファイルは編集しない。

## 報告
書いた数（lines のキー数・シーンの種類別の数）と検証結果を短く。
