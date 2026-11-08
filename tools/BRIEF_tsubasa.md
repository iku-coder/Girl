# 春日井 つばさの登録（scenes/hero/tsubasa.js）

ブラウザゲーム「ひだまり荘」に、ひだまり荘**104号室**の**春日井 つばさ**（20歳・主人公の幼なじみ）を登録する。全員成人。日本語で書く。主人公は20歳・大学2年、ボロアパート「ひだまり荘」の管理人（祖父の跡を継いだ）で、隣のマンション「ひだまりレジデンス」のオーナー。ふくよかな女性が好みで、女性の体のサイズが見える「観察眼」を持つ。ヒロインに食べさせて少しずつ太らせる交流ゲーム。体型は段階1〜15。のちに、ひだまり荘は15階建ての「ひだまりタワー」に建て替わり、つばさは1階104号室に移る。

104号室には以前「鷹野 茜」がいたが削除した。**茜の名前やセリフは一切使わない**。

## 設定
- /home/claude/girl/docs/ヒロイン設定.md の「■104号室　春日井 つばさ」の節を**全部**読む（`grep -n "春日井 つばさ" /home/claude/girl/docs/ヒロイン設定.md`）。〈5つの流れ〉〈性格〉〈主人公との関係〉〈攻略の流れ〉〈太った後の性格・生活の変化〉〈ゲームバランスの提案〉を生かす
- 気持ちの流れは「恥じらい型」：/home/claude/girl/docs/ に「気持ちの流れ_型.md」があれば読む
- 手本：/home/claude/hidamari/scenes/hero/haruka.js（データ・セリフ・シーンを1ファイルに書く形）、/home/claude/hidamari/heroines.js、/home/claude/hidamari/scenes/_intro.js（チュートリアルの intro シーンの形）、/home/claude/hidamari/scenes.js の冒頭コメント（シーンの書式）、/home/claude/hidamari/data.js の commonLines（共通の予備のセリフのキー）
- 呼び方：主人公を「〇〇」と呼び捨て（全段階）。一人称「あたし」。がさつな男友達口調（「〜じゃん」「腹へった」「ばーか」）。段階9以降は照れると語尾が弱くなり、段階13以降は甘えが混ざる

## ゲーム側でもう動いている仕組み
- **ごはんまだ？**：夕・夜に主人公が101号室で休む・料理の練習をすると、60%でつばさが来て一緒に食べる（セリフ `gohanMada`・料理の練習のとき `gohanCook`）
- **むくれ食い**：ほかのヒロインの親密度の段階が上がった日、つばさがむくれて冷蔵庫をあさる（夜の集計に出る。セリフ不要）
- **パーカーの節目**：部屋を訪ねたとき、段階5・9・13に初めて届いていればシーン type `hoodie5`・`hoodie9`・`hoodie13`（設定の服装の流れ：5＝縮んだと言い張るグレーのパーカー、9＝主人公が誕生日に買った大きいサイズの白いパーカー、13＝おそろいのネイビーのパーカー）
- ほか：部屋のドアノブの差し入れ・手渡し・チートデイ・身体の変化・建て替え・15階などは住人共通（下の lines で専用のセリフを書く）

## 1ファイルに書くもの
```js
window.GAME_DATA = window.GAME_DATA || { heroines: [] };
window.GAME_DATA.heroines.push({
  id: 'tsubasa', room: '104',            // building は書かない（ひだまり荘）
  name: '春日井 つばさ', age: 20, job: '大学2年生（経済学部）・コンビニの夜勤', height: 156, weight: 47, appetite: 1.2, color: '#…',
  likes: [...], dislikes: [...],          // sweet・snack・fried・meal・alcohol・cold・hot から（設定の好き・苦手に近いもの）
  schedule: { weekday: ['朝', '夜'], weekend: ['昼', '夜'] },
  startAffection: 30, bodyType: { frame: 'natural', fat: 'apple' }, sizes: { bust: 86, under: 71, waist: 58, hip: 86 },
  images: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, `img/tsubasa_${i + 1}.png`])),
  lines: { … }
});
window.addScenes('tsubasa', [ … ]);
window.addExtra('tsubasa', { lines: { … } });   // 必要なら（lines に入れてもよい）
window.addBody('tsubasa', { phases: { 1: '…', 2: '…', 3: '…' }, talk: { smell: [3], breath: [3], hair: [3], stretch: [3], dark: [3], toilet: [3] } });
```

### lines（文字列の配列。tier 別は「配列の配列」4つ＝よそよそしい・顔なじみ・好意・特別）
greetMorning・greetEvening・greet・talk（各段2つ）・rent・giftLike・giftDislike・wary・full・refuseVisit・eatOut・homeCook・handGiftOk・handGiftNo・careGift・cheatDay（tier 別4段）、careGiftShy・careGiftAccept（各2）、lateMeal_jiro・lateMeal_famires（各2）、gohanMada（tier 別4段・各2）、gohanCook（2〜3）、capture（攻略の告白3〜4行。設定の攻略イベントの言葉「……ずっと、それ言ってほしかったんだよ、ばか」を生かす）、lowNoticeStage・lowNoticeBig・lowNoticeClothes（主人公の心の声。（　）でくくる。各1）、towerMove・invite15・pool・bath（各2）、oburumai（4）

### シーン
- `intro` 1本（id: 'tsubasa_intro'。チュートリアルの4月分の家賃回収。幼なじみが「大学に近いから」と104号室に先に越してきていた再会の場面。最後のノードは rent で4月分を払う。/home/claude/hidamari/scenes/_intro.js の他の人と同じ形）
- `morning` 4本（tiers [0]〜[3] を1本ずつ）、`rent` 1本、`package` 1本、`talk` 9本（tiers [1]・[2]・[3] 各3本。体型の話題は minStage 5 以上）、`visit` 2本、`invite` 1本（captured: true）、`night` 1本（captured: true。最後は '（——部屋の灯りを消した）' → '（翌朝）' と翌朝の短い会話。性的な描写は書かない）
- `hoodie5`・`hoodie9`・`hoodie13` 各1本（パーカーの節目）
- `doorGift` 2本（ドアノブの袋の会話。正直に答える／ごまかす。/home/claude/hidamari/scenes/v21/hinata.js を参考）
- id は「tsubasa_」で始める。フラグは「ts_」で始める

## 確認
`cd /home/claude/hidamari && node tools/check_scenes.js scenes/hero/tsubasa.js` でエラー0。担当以外のファイルは編集しない。

## 報告
書いた数と検証結果を短く。
