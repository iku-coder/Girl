# ひだまりタワーの新しい住人の登録（scenes/tower/<id>.js）

ブラウザゲーム「ひだまり荘」に、**ひだまりタワー**（建て替えで建った15階建てのマンション）の新しい住人を登録する。全員成人（20歳以上）。日本語で書く。主人公は20歳・大学2年、元ボロアパート「ひだまり荘」の管理人で、今はひだまりタワーとマンション「ひだまりレジデンス」のオーナー。ふくよかな女性が好みで、女性の身長・体重・スリーサイズが見える「観察眼」を持つ。ヒロインに食べさせて少しずつ太らせる交流ゲーム。体型は段階1〜15。親密度は 0〜34 よそよそしい／35〜69 顔なじみ／70〜90 好意／91〜 特別（95で攻略）。

タワーの住人は、建て替えのあと、一家（組）ずつ順に入居してくる（入居の順番と日はゲームが決める）。

## 設定（必ず読む）
- /home/claude/girl/docs/ヒロイン設定.md の担当キャラの節を**全部**（組の節の冒頭＝家族・組の説明も）。`grep -n "^■" /home/claude/girl/docs/ヒロイン設定.md` で行番号がわかる。〈5つの流れ〉〈性格〉〈主人公との関係〉〈攻略の流れ〉〈太った後の性格・生活の変化〉〈ゲームバランスの提案〉を生かす。冒頭の共通の決まりも読む
- 気持ちの流れの型：/home/claude/girl/docs/気持ちの流れ_型.md（担当キャラの型。段階5〜8／9〜12／13〜15の心の動きをこの型に合わせる）
- 表現の基準：/home/claude/girl/docs/身体描写_表現基準.md
- 手本：/home/claude/hidamari/scenes/hero/tsubasa.js（データ・セリフ・シーンを1ファイルに書く形。いちばん新しい手本）、/home/claude/hidamari/scenes/hero/haruka.js・anzu.js（母娘＝同じ部屋の2人）、/home/claude/hidamari/scenes.js の冒頭コメント（シーンの書式）、/home/claude/hidamari/data.js の commonLines（共通の予備のセリフのキー）

## 1ファイル＝1人
```js
window.GAME_DATA = window.GAME_DATA || { heroines: [] };
window.GAME_DATA.heroines.push({
  id: '<id>', building: 'tower', room: '<部屋番号>', household: '<組のid>',   // 下の表
  name: '鷺沢 菜々', age: 24, job: '…', height: …, weight: …, appetite: 0.6〜1.5, color: '#…',
  likes: [...], dislikes: [...],          // sweet・snack・fried・meal・alcohol・cold・hot から（設定の好き・苦手に近いもの）
  schedule: { weekday: [...], weekend: [...] },   // 設定の「在室」どおり（朝・昼・夕・夜）
  startAffection: …,                      // 設定に提案があればそれ、なければ 5〜15
  mood: 'shy' | 'resist' | 'enjoy' | 'bold',   // 気持ちの流れの型：恥じらい型・抵抗型・満喫型・開き直り型
  bodyType: { frame: 'straight'|'wave'|'natural', fat: 'apple'|'pear'|'hidden' },
  sizes: { bust, under, waist, hip },     // under はカップ数からおおよそ（カップ1つ＝2.5cm。C＝bust−15 くらい）
  images: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, `img/<id>_${i + 1}.png`])),   // 立ち絵が無い段階はゲームが近い段階で代用する
  lines: { … }
});
window.addScenes('<id>', [ … ]);
window.addBody('<id>', { phases: { 1: '…', 2: '…', 3: '…' }, talk: { smell: [3], breath: [3], hair: [3], stretch: [3], dark: [3], toilet: [3] } });
```
- 結婚している人は `married: true`

### lines（文字列の配列。tier 別は「配列の配列」4つ＝よそよそしい・顔なじみ・好意・特別）
greetMorning・greetEvening・greet・talk（各段2つ）・rent・giftLike・giftDislike・wary・full・refuseVisit・eatOut・homeCook・handGiftOk・handGiftNo・careGift・cheatDay（tier 別4段）、careGiftShy・careGiftAccept（各2）、lateMeal_jiro・lateMeal_famires（各2）、capture（攻略の告白3〜4行。設定の攻略イベントの言葉を生かす）、lowNoticeStage・lowNoticeBig・lowNoticeClothes（主人公の心の声。（　）でくくる。各1）、invite15・pool・bath（各2）、oburumai（4）、towerArrive（入居のあいさつ2。同じ組の人がいれば、その人にも触れてよい）
- stageUp：`{ 2: […], 3: […], …, 15: […] }`（段階が上がった直後に部屋で会ったときの一言。各段階1〜2個。**段階5〜15は気持ちの流れの型どおり**）

### シーン（id は「<id>_」で始める。フラグは「<id>_」で始める）
- `morning` 4本（tiers [0]〜[3] を1本ずつ。タワーのエントランス・ゴミ置き場・エレベーター前などで会う）
- `rent` 1本、`package` 1本
- `talk` 9本（tiers [1]・[2]・[3] 各3本。体型の話題は minStage 5 以上。型どおりの反応）
- `visit` 2本、`invite` 1本（captured: true）、`night` 1本（captured: true。最後は '（——部屋の灯りを消した）' → '（翌朝）' と翌朝の短い会話。**性的な描写は書かない**）
- `doorGift` 2本（親密度0〜34のとき、ドアノブに掛けた差し入れの袋の会話。正直に答える／ごまかす。/home/claude/hidamari/scenes/v21/hinata.js を参考）
- 同じ部屋・隣の部屋の相手がいる人は、**組のシーン**を2本：type `visit`、`cast: ['<自分>', '<相手>']`（自分のファイルにだけ書く。組の中で、表の「組のシーンを書く人」だけが書く）。組の関係（嫁と姑、お嬢様とメイド、三姉妹、コンビ、隣どうしの御堂家と花咲家の張り合い）が出る場面
- 設定の〈ゲームバランスの提案〉にある独自の仕組みは、ゲーム側でまだ作っていない。書かなくてよい（報告で「使えそうな仕組み」を1〜2行で挙げる）

## 書き方
- 主人公の名前は「〇〇」。セリフ：ふつうの文字列＝ヒロイン、'（…）'で始まる文字列＝地の文、['p','…']＝主人公、['n','…']＝地の文。複数人の場面は ['@<id>','…'] でその人のセリフ。選択肢の text は主人公のセリフ（'（…）'で始めると行動）
- ノードのキー：say, aff, wary, habit, setFlag, clearFlag, branch, choices, next。選択肢のキー：text, line, if, aff, wary, habit, setFlag, say, next
- 呼び方・一人称・口調は設定どおり。段階・親密度で呼び方が変わる人は、tier 別の配列でそろえる
- 人妻（夫がいる人）は、親密度が上がると関係が深まるが、夫が出る場面では不倫をにおわせない。**性的な描写は一切しない**

## 確認
`cd /home/claude/hidamari && node tools/check_scenes.js scenes/tower/<id>.js` でエラー0（ファイル先頭の `window.GAME_DATA = window.GAME_DATA || { heroines: [] };` は残す）。担当以外のファイルは編集しない。

## 報告
キャラごとに書いた数（lines のキー数・シーン数）と検証結果、使えそうな独自の仕組みを短く。

## 部屋割り（基幹セッションが決めた）
| 組（household） | id | 名前 | 部屋 | 組のシーンを書く人 |
|---|---|---|---|---|
| sagisawa（鷺沢家・3階ファミリー） | nana / saeko | 鷺沢 菜々（嫁）／鷺沢 冴子（姑） | 301 | nana |
| saionji（西園寺家・13階高級） | ayano / shizuku | 西園寺 綾乃／黒瀬 しずく | 1301 | ayano |
| natsume（夏目家・5階ファミリー） | hazuki / ran / konatsu | 夏目 葉月／蘭／小夏 | 501 | hazuki（2本）・konatsu（1本） |
| slenders（スレンダーズ・7階） | momo / ritsu | 犬飼 もも／鶴見 律 | 706 | momo |
| mido（御堂家・8階ファミリー） | shizuka / fumino / risa | 御堂 静香／文乃／理沙 | 801 | shizuka（2本。花咲家との張り合い1本を含む） |
| hanasaki（花咲家・8階ファミリー、御堂家の隣） | rumi / kirara / juri | 花咲 ルミ／キララ／ジュリ | 802 | rumi（2本。御堂家との張り合い1本を含む） |
| mikage（4階・1〜2人用） | sumika | 御影 澄香 | 406 | — |
| haruno（6階・1〜2人用） | himari | 春野 ひまり | 606 | — |
- 同じ部屋の2〜3人は、1人ずつ別のファイル（scenes/tower/nana.js と scenes/tower/saeko.js など）
