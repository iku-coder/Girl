# 外のヒロインの登録（scenes/hero/<id>.js）

ブラウザゲーム「ひだまり荘」の、**外のヒロイン**（アパート・マンションに住まず、町で会うヒロイン）をゲームに登録する。全員成人。日本語で書く。主人公は20歳・大学2年、ひだまり荘（ボロアパート）の管理人で、隣のマンション「ひだまりレジデンス」のオーナー。ふくよかな女性が好みで、女性の身長・体重・スリーサイズが見える「観察眼」を持つ。ヒロインに食べさせて少しずつ太らせる交流ゲーム。

## 設定の読み方
- キャラ設定：/home/claude/girl/docs/ヒロイン設定.md の「■外のヒロイン」の節（`grep -n "^■外のヒロイン" /home/claude/girl/docs/ヒロイン設定.md`）。冒頭の共通の決まりも読む
- データの形の手本：/home/claude/hidamari/heroines.js（例：reina）。共通のセリフの予備：/home/claude/hidamari/data.js の commonLines
- 外のヒロインの仕組み：/home/claude/hidamari/data.js の config.outside（会える場所 place ごとの label・food）

## 仕組み（ゲーム側はもう動いている）
- 会える場所（place）と時間（schedule）で「その場にいる」が決まる。外出の画面の「会いに行く」、お店・神社・銭湯の画面のボタン、バイト・荷物・朝の掃除で会える
- 親密度35未満：短い会話（`greetOut`）＋その場の食べ物を一緒に（`outFood`）＋手持ちの差し入れを手渡す（`handGiftOk`／`handGiftNo`）
- 親密度35以上：その場で、住人の部屋と同じ画面（話す `talk`・差し入れ `giftLike` など・外食・チートデイ…）。入ったときのあいさつは `greet`
- シーン（任意の type `meetOut`）があれば、会ったときの短い会話がシーンになる

## 1ファイル＝1人
```js
window.GAME_DATA.heroines.push({
  id: 'satsuki', building: 'outside', place: 'shrine',
  name: '狐塚 紗月', age: 31, job: '陽守神社の神主（禰宜）',
  height: 160, weight: 46, appetite: 0.6, color: '#…',
  likes: [...], dislikes: [...],          // タグは sweet・snack・fried・meal・alcohol・cold・hot から
  schedule: { weekday: [...], weekend: [...] },   // 下の表のとおり
  offDow: [0],                            // 定休日がある人だけ（0＝月曜 … 6＝日曜）
  dailyKcal: 0,                           // 下の表のとおり
  startAffection: 10,
  bodyType: { frame: '…', fat: '…' },
  sizes: { bust, under, waist, hip },     // under（アンダーバスト）は、カップ数からおおよそで（カップ1つ＝2.5cm。C＝bust−15 くらい）
  images: {},                             // 立ち絵はまだない
  lines: { … }
});
window.addScenes('satsuki', [ … meetOut シーン … ]);
```

| id | place | schedule（weekday／weekend） | offDow | dailyKcal | 名前・仕事 |
|---|---|---|---|---|---|
| satsuki | shrine | 昼・夕／昼・夕 | | 0 | 狐塚 紗月・陽守神社の神主（appetite 0.6） |
| mao | job | 昼・夕／昼・夕 | | 0 | 赤城 真央・ファミレスの店長（主人公のバイト先） |
| komachi | sento | 夕・夜／夕・夜 | [0] | 200 | 松本 小町・銭湯「松の湯」の番頭（常連のおばあちゃんの差し入れ） |
| madoka | depa | 昼・夕／昼・夕 | | 0 | 甘利 まどか・デパ地下の洋菓子店の販売員 |
| kaho | delivery | 昼／昼 | | 0 | 速水 夏帆・宅配便のドライバー（荷物が届くと会える） |
| koharu | post | 朝／（なし） | | 200 | 文月 こはる・郵便配達員（朝の掃除で会える。配達先でもらうお菓子） |
| kyoko | chonaikai | 昼・夕／昼・夕 | | 150 | 大門 京子・町内会長（集会所のお茶菓子） |
| misuzu | super | 昼・夕／昼・夕 | | 0 | 鬼塚 美鈴・スーパー「まるとくマート」の店長（玲奈の上司） |
| yuko | conveni | 昼・夜／昼・夜 | | 0 | 星野 夕子・コンビニ「ひだまりマート」の店長 |

## lines（すべて文字列の配列。tier 別は「配列の配列」4つ＝よそよそしい・顔なじみ・好意・特別）
- `greetOut`（tier 別4段・各2）：その場所で会ったときの一言（仕事中らしさ。神社の掃除、番台、レジ、配達の合間など）
- `greet`（tier 別4段・各1〜2）：親密度35以上で「会いに来た」ときのあいさつ
- `talk`（tier 別4段・各2）：話す。仕事・暮らし・家族・主人公への気持ち
- `outFood`（tier 別4段・各1〜2）：その場の食べ物を一緒に食べるとき（data.js の config.outside.places[place].food.name の物。例：神社＝おさがりのいなり寿司とお神酒、銭湯＝湯上がりのコーヒー牛乳とアイス、デパ地下＝試食のケーキ、スーパー＝値引きの惣菜と缶ビール、コンビニ＝新作スイーツとホットスナック、ファミレス＝閉店後のまかない、配達＝冷たい飲み物とおにぎり、郵便＝もらったお菓子のおすそわけ、集会所＝炊き出しのとん汁とおにぎり）
- `handGiftOk`（tier 別4段・各1〜2）・`handGiftNo`（tier 別4段・各1）：差し入れを手渡されたとき
- `giftLike`（tier 別4段）・`giftDislike`（tier 別4段）・`wary`（tier 別4段）・`full`（tier 別4段）
- `capture`（文字列の配列3〜4行）：攻略の瞬間の告白。設定の〈攻略の流れ〉の攻略イベントの言葉を生かす
- `cheatDay`（tier 別4段・各1）、`lateMeal_jiro`（2）、`lateMeal_famires`（2）
- 呼び方は設定の「呼び方は…」に合わせる。段階で変わる呼び方は、tier 別の配列では段階を問わない形（呼びかけを省く）にするか、親密度の段階で無理のない形に

## meetOut シーン（各3本）
- type: 'meetOut'。if に tiers を1つずつ：[0]・[1]・[2]（好意以上）。会った場面の短い会話（2〜4ノード）。選択肢2〜3個、aff -1〜+2、食べさせる流れは habit 0.01〜0.02
- id は「<id>_mo01〜」。シーンの書き方は /home/claude/hidamari/scenes.js の冒頭コメントと、既存の /home/claude/hidamari/scenes/daily/reina.js などを参照
- 人妻（小町・まどか・京子・夕子）は、設定どおり親密度が上がると関係が深まるが、夫が出る場面では不倫をにおわせない。**性的な描写は一切しない**

## 確認
- `cd /home/claude/hidamari && node -e "global.window={GAME_DATA:{heroines:[]},addScenes(){}}; require('./scenes/hero/<id>.js'); console.log(window.GAME_DATA.heroines[0].id)"` で読めること
- シーンは、ファイルから addScenes の部分だけ別ファイルにせず、`node tools/check_scenes.js scenes/hero/<id>.js` でエラー0（GAME_DATA が無いと落ちるので、検証のときは一時的に `window.GAME_DATA = window.GAME_DATA || { heroines: [] };` をファイル先頭に入れておいてよい。**この1行は残してよい**）
- 担当以外のファイルは編集しない

## 報告
キャラごとに書いた数（lines のキー数・シーン数）と検証結果を短く。
