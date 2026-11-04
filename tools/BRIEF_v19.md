# v1.9 追加イベントのキャラ別シーン（scenes/v19/<id>.js）

ゲーム「ひだまり荘」の会話を日本語で書く。全員成人。主人公（20歳・大学2年、ボロアパート「ひだまり荘」の管理人で、隣のマンション「ひだまりレジデンス」のオーナー）は、ふくよかな女性が好みで、女性の体のサイズが見える「観察眼」を持つ。ヒロインに食べさせて少しずつ太らせる交流ゲーム。体型は段階1〜15。

仕組みはもう動いていて、今は全員が data.js の共通シーン（commonScenes）・共通セリフ（commonLines）で動いている。これを**キャラごとの口調・設定で書き直した専用版**を作る。同じ type のシーンがキャラのファイルにあれば、共通版の代わりにそちらが使われる。**共通版（/home/claude/hidamari/data.js の commonScenes と commonLines の該当部分）を必ず読んで、選択肢の効果（money・building・setFlag・aff など）と流れをそろえる**。仕様は /home/claude/hidamari/system-spec.md の「v1.8〜v1.9 追加」。

## 1ファイル＝1人。中身は3つの呼び出し
```js
window.addScenes('<id>', [ …シーン… ]);     // id は「<id>_v」で始める
window.addExtra('<id>', { lines: { …セリフ… } });
window.addPhone('<id>', [ …メッセージ… ]);
```

## シーン（type と条件）
- `floor`・`floor2`・`floor100`（**ひだまり荘の7人だけ**：hinata saya reina sayuri akane kotori yukino）：床がきしむ（段階10・段階13・100kg）。選択肢と効果は共通版と同じ（補強：`money: -20000`（floor2・floor100 は -30000）, `building: 5`, `aff: 3`, `setFlag: 'floor_fixed'`／ごまかす：`aff: 1`, `setFlag: 'floor_unfixed'`／からかう：`aff: -3`, `wary: 10`。floor100 はからかうなしでよい）
- `sick` 2本（`{ maxAff: 69 }`／`{ minAff: 70 }`）、`recover` 1本：風邪で寝込む／治って食欲が戻りすぎる
- `homeBack` 2本、`momCall` 1本（**ことり以外**。ことりは家出同然なので書かない）：帰省から戻ってお土産／母親からの電話で体型を指摘される。momCall は中で `branch` で段階 5〜8（強がり）／9〜12（恥じらい）／13〜（受け入れ）に分ける。母親の声は地の文の中の「」で
- `busy` 2本、`examEnd` 1本（**栞は書かない**。大学生は試験、社会人は繁忙期の内容に）
- `delivery` 1本：夜、出前の配達員とドアの前で鉢合わせ（Lピザ2枚やチキンのバケツ）。選択肢は共通版と同じ3つ（「頼みすぎ」は段階13未満と以上で branch）
- `reunion` 1本：街角で昔の知り合い（同級生・元同僚など、そのキャラの過去に合う人）に「変わったね」と言われる。段階で branch（5〜8 強がる／9〜12 主人公の後ろに隠れる／13〜 「幸せ太り」と受け入れる）。最後に かばう（aff 4）／見守る の選択肢
- `oldClothes1`（段階5）・`oldClothes2`（段階9）・`oldClothes3`（段階13）・`favClothes`（段階7）各1本：卒業アルバム・制服・昔の服・思い出の服が入らない。`{gain}` と書くと「最初から増えたkg」の数字になる
- `partyDress` 1本（**大学生（ひなた・雪乃・莉緒・澪・渚・姫華）は書かない**）：友だちの結婚式のドレスが入らない。選択肢は共通版と同じ（一緒に買いに行く `money: -8000, aff: 4`／今のほうが似合う `aff: 3`）
- `sento` 1本：銭湯の休憩所。脱衣所の体重計の話を段階で branch（〜8／9〜12／13〜。13以上は「台の目盛りが足りなかった」など）、湯上がりのコーヒー牛乳・アイスの選択肢。**お風呂の中の描写はしない**。沙耶は flag `s_sento` があれば「松の湯」の常連らしさを
- `familyVisit` 1本、`afterFamily` 1本（**ことり以外**）：上京した家族（母・妹など、ヒロイン設定にあれば使う。立ち絵なし、地の文と「」だけ）が体型の変化に驚く。攻略済み（`captured`）なら「彼氏」として紹介される分岐を。選択肢の一つに `setFlag: 'family_ok'`
- `season` 1本：`if: { season: 'whiteday' }`。主人公からホワイトデーのお返しを受け取る場面（中で親密度や攻略後で branch）

## セリフ（addExtra の lines。すべて文字列の配列。主人公の名前は「〇〇」、ほかの住人の名前は `{other}`）
typhoon（台風の停電の夜、みんなで冷蔵庫の中身を食べる）3、typhoonAfter（翌朝の片付け）2、myBirthday（主人公の誕生日にケーキを作って集まった）3、quarrel（仲の悪い住人 {other} とのケンカの一言）2、request（依頼を片づけてもらったお礼）3、bored（同じ差し入れが続いて「またこれ？」）2、hooked（同じ物がクセになって好物になった）2、challengeWin（デカ盛り完食）2、challengeLose（デカ盛り失敗）2、taxNotice（主人公の机の督促状を見てしまった）1、homeBack 2（ことり以外）、busy 2・examEnd 2（栞以外）、familyDinner（家族と焼肉、主人公も一緒）2（ことり以外）、sento 2、hotDay（暑い日に冷たい物をもらった）1、coldDay（寒い日に温かい物をもらった）1、whiteday 2

## スマホのメッセージ（addPhone）8つ以上
```js
{ if: { maxStage: 4 }, msg: '…', photo: '写真の中身（無ければ空文字）', replies: [
  { text: '主人公の返信', aff: 1, res: 'ヒロインの返事' },
  { text: '食べ物をすすめる返信', aff: 1, habit: 0.01, res: '…' } ] }
```
- 段階（maxStage / minStage）、攻略後（captured）、食習慣（minHabit）などで出し分ける。8つのうち、初期・中期・後期・攻略後がそろうように
- 返信は必ず2つで、片方は食べ物をすすめる（habit 0.01）

## 書き方
- 口調・一人称・主人公の呼び方は、既存のシーン（/home/claude/hidamari/scenes/<id>.js・scenes/daily/<id>.js・scenes/room/<id>.js・scenes/extra/<id>.js、ひなた・沙耶は /home/claude/hidamari/scenes.js）と /home/claude/hidamari/heroines.js（ひなた・沙耶は data.js の heroines）に**必ず**合わせる。段階で呼び方・口調が変わるキャラは、条件の付いていない所では呼びかけを省くか、branch で段階ごとに分ける
- キャラ設定：/home/claude/girl/docs/ヒロイン設定.md の「■…」の節（家族・過去・職業・服装の変化）
- セリフ：ふつうの文字列＝ヒロイン、'（…）'＝地の文、['p','…']＝主人公、['n','…']＝地の文。選択肢の text は主人公のセリフ（'（…）'で始めると行動）
- 選択肢は2〜3個。条件キー：tiers, minAff, maxAff, flag, noFlag, weekend, slot, captured, minStage, maxStage, minMoney, chance, minHabit, season
- 栞は人妻で、攻略後は夫に隠れた不倫関係（家族の上京では夫の家族ではなく栞の実家の家族）。玲奈・小百合の子ども・家族の場面で恋愛をにおわせない。真理子の夜の仕事の場面は描かない。姫華は段階13以降 flag 'himeka_route_otaku' でルートを分ける
- 性的な描写はしない。体型を蔑む表現はしない。1シーンはノード2〜5個、セリフ4〜12行

## 確認と報告
`cd /home/claude/hidamari && node tools/check_scenes.js scenes/v19/<id>.js` でエラー0。担当以外のファイルは編集しない。報告は担当ファイルとシーン数、検証結果だけを短く日本語で。
