# 朝・夕方の掃除中イベントの執筆指示（共通）

ブラウザゲーム「ひだまり荘」の会話シーンを日本語で書く。

## 場面
- **朝（type: 'morning'）**：主人公（20歳・大学2年、ひだまり荘の管理人。マンション「ひだまりレジデンス」のオーナーでもある）が朝に敷地を掃除していると、出かける／ゴミ出しをするヒロインと玄関先で出会う短い場面
- **夕方（type: 'evening'）**：夕方に敷地を掃除していると、仕事・大学・買い物などから帰ってくるヒロインと玄関先で出会う短い場面（「おかえりなさい」から始まることが多い。疲れ、今日あった出来事、買い物袋、夕飯の話など、帰り道らしい話題）
- ひだまり荘（ボロアパート）の住人は貧乏設定、マンションの住人は貧乏設定なし。全員成人。性的な描写はしない

## 量（1人あたり）
- 親密度の段階 tiers ごとに：**朝 4〜5個、夕方 5個**。tiers は 0＝よそよそしい(0〜34)、1＝顔なじみ(35〜69)、2＝好意(70〜90)、3＝特別(91〜、攻略済みを含む)
- つまり朝16〜20、夕方20、合計36〜40シーン。各シーンの if に `tiers: [n]` を1つだけ付ける
- 段階0はそっけない・警戒、段階1は世間話、段階2は好意がにじむ、段階3は甘え・特別な距離感、と段階で関係の進み方がはっきり分かるように
- バリエーションのため、条件 weekend（休日/平日）、minStage/maxStage（体型段階1〜15。太ってきた体のこと・服がきつい・食べる量が増えたなどの話題は minStage 5 以上で）、flag（そのキャラの既存フラグ）を一部のシーンで使ってよい。ただし各段階に、条件なし（tiers だけ）のシーンを最低3つずつ必ず入れる（いつでも出せるように）

## 1シーンの形（短く）
朝夕のイベントは短い立ち話。セリフ1〜3行 → 主人公の選択肢2〜3個 → 選んだ返事に対する反応1〜2行、で終わるのが基本。ときどき branch（例：`{ if: { minAff: 80 }, next: 'a' }`）や2段目の選択肢を入れて変化をつける。
- 返事で反応と親密度が変わる（aff -2〜+3。失礼・空気を読まない返事は下げる、wary も使う）
- 食べ物の話で食べさせる流れなら habit 0.01〜0.02 を付けてよい
- 主人公の名前は「〇〇」と書けばゲームが置き換える。キャラ設定どおりに呼び方が段階で変わるなら〇〇を使う

## 書式
既存の /home/claude/hidamari/scenes.js（冒頭コメントとシーンの書き方）と、/home/claude/hidamari/scenes/<id>.js（そのキャラの既存シーン。口調・フラグ・呼び方の参考。重複しない内容にする）を必ず読むこと。基本セリフは /home/claude/hidamari/heroines.js と /home/claude/hidamari/data.js にある。
キャラ設定は /home/claude/girl/docs/ヒロイン設定.md の「■…号室　名前」の節（`grep -n "^■" /home/claude/girl/docs/ヒロイン設定.md` で行を探す）を読み、性格・口調・仕事・生活・呼び方の変化・在室時間（朝に出かけ夕方に帰る時間帯）を生かす。

ファイル：**/home/claude/hidamari/scenes/daily/<id>.js**（1キャラ1ファイル）。中身は次の形だけ：
```js
window.addScenes('<id>', [
  { id: '<id>_dm01', type: 'morning', if: { tiers: [0] }, nodes: { start: { say: ['…'], choices: [ { text: '…', aff: 1, say: ['…'] }, … ] } } },
  { id: '<id>_de01', type: 'evening', if: { tiers: [0] }, nodes: { … } },
  …
]);
```
- id は「<id>_dm01〜」（朝）「<id>_de01〜」（夕方）。新しく作るフラグ名は「<id>_d」で始める
- セリフ：ふつうの文字列＝ヒロイン、'（…）'で始まる文字列＝地の文、['p','…']＝主人公、['n','…']＝地の文。選択肢の text は主人公のセリフとして表示（'（…）'で始めると行動の描写）
- 使える条件キー：tiers, minAff, maxAff, flag, noFlag, weekend, slot, captured, minStage, maxStage, minMoney, chance, minHabit
- ノードのキー：say, aff, wary, building, money, habit, setFlag, clearFlag, branch, choices, prompt, next。選択肢のキー：text, line, if, aff, wary, building, money, habit, setFlag, clearFlag, say, next, silent

## 確認
`cd /home/claude/hidamari && node tools/check_scenes.js scenes/daily/<id>.js` で、担当のファイルすべてがエラー0になるまで直す。担当以外のファイルは編集しない。

## 報告
キャラごとの朝・夕方のシーン数（段階別）と検証結果を短く報告。
