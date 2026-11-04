/* =========================================================
   ゲームデータ（data.js）
   ヒロイン設定・セリフ・食べ物・数値バランスはここだけを編集する。
   エンジン（index.html）は触らずに差し替えられる。
   ========================================================= */
window.GAME_DATA = {

  /* ---- 全体設定・数値バランス ---- */
  config: {
    apartmentName: 'ひだまり荘',
    bgDir: 'img/bg',            // 背景絵のフォルダ（img/bg/<場所>_<時間帯>.png）
    defaultPlayerName: '悠',     // 主人公の名前の初期値（はじめるときに変えられる）。セリフの「〇〇」に入る
    version: '試作版 v2.2',
    slots: ['朝', '昼', '夕', '夜', '深夜'],   // v1.7 深夜を追加：深夜になると自室へ戻り、寝るか料理をするとその日の集計へ
    weekdays: ['月', '火', '水', '木', '金', '土', '日'],
    startDate: '2026-04-01',    // ゲーム開始日（新学期）。曜日と月末はここから計算する

    startMoney: 3000,           // 手持ち（じいちゃんの財布に残っていた分）。最初の家賃回収で増える
    startBuilding: 60,          // 建物の状態（0〜100）
    buildingDecayPerDay: 2,
    manageGain: 15,
    rentPerMonth: 40000,        // 住人1人あたり。月末の家賃回収で受け取る
    partTimePay: 4000,
    cookPracticeCost: 500,
    // 料理の腕（0〜500）。練習で上がり、上がるほど作れる料理（recipes）が増える。最初は低カロリーの料理だけ
    cookMax: 500,
    cookPracticeGain: [5, 9],   // 1回の練習で上がる量（この範囲でランダム）
    prepFrom: 100,              // この腕から「作り置き」ができる。作り置きは差し入れとして渡せる
    prepPortions: 3,            // 1回の作り置きでできる数

    // 体重計算
    maxWeight: 120,             // 体重の上限（kg）。ヒロインごとに maxWeight を書けば上書き（茜は140の予定）
    maintPerKg: 28,             // 維持カロリー = 体重 × この値
    baseEatRatio: 0.97,         // 食習慣0のときの自炊量（維持カロリー比）
    habitEatBonus: 0.5,         // 食習慣1.0で +50% 食べるようになる
    kcalPerKg: 7000,
    weightGainBoost: 1.2,       // ゲーム用の増量倍率（v0.9で2.5→1.0、v1.5で1.2。増えるときだけ掛かる。減るときは等倍）
    fatConstitutionPerStage: 0.06, // デブ体質：段階が1上がるごとに増え方が+6%（段階15で×1.84）。v1.5
    habitDecayPerDay: 0.005,
    habitPerGift: 0.01,

    // 胃袋（満腹ゲージの上限）
    baseCapacity: 40,
    maxCapacity: 180,
    stretchThreshold: 0.8,      // 満腹がこの割合を超えると胃袋が広がる
    stretchOnEat: 2,
    stretchOnRefuse: 1,

    // ---- 親密度（0〜100） ----
    // 0〜34：自分から部屋を訪ねられない。朝の掃除と宅配便のイベントで少しずつ距離を縮める
    // 35〜69：訪問できる。家賃回収で雑談と追加イベント
    // 70〜90：好意的な反応ばかりになる（警戒しない、苦手な物でも嫌な顔をしない）
    // 91〜100：特別。captureAffection に届くと攻略
    visitMinAffection: 35,
    favorableFrom: 70,
    captureAffection: 95,       // 攻略（体重は条件に含めない）

    // 序盤のランダムイベント
    morningGreetChance: 0.35,   // 朝に掃除をしたとき、ヒロイン1人ごとに挨拶イベントが起きる確率
    morningGreetAffection: 3,
    morningGreetMax: 2,         // 1回の掃除で会えるのは最大2人まで
    packageChance: 0.12,        // 1日ごと・ヒロイン1人ごとに、留守中の荷物を預かる確率（昼に判定）
    packageAffection: 4,        // 預かった翌日までに渡したとき
    packageLateAffection: 1,    // 2日目以降に渡したとき
    packageExpireDays: 3,       // これを過ぎると本人が取りに来る（親密度 -2）

    // 月末の家賃回収
    rentAffection: [1, 3, 2, 2],  // 親密度の段階ごとの上昇量
    rentEventChance: 0.5,         // 顔なじみ（35〜69）のとき、追加イベントが起きる確率

    // 部屋での交流
    talkAffection: 4,
    talkWaryDown: 8,
    giftAffection: 2,
    giftLikeAffection: 5,
    giftAllowance: [1, 2, 4, 99],  // 親密度の段階ごとに、1日に受け取ってくれる差し入れ数
    waryTooMany: 8,
    waryOverfull: 4,
    waryStageUpLowTrust: 15,    // 親密度が低いうちに体型が変わると警戒される
    waryDecayPerNight: 10,
    waryGiftRefuse: 60,         // これ以上だと差し入れを断る
    waryVisitRefuse: 80,        // これ以上だと部屋に入れてくれない

    // ---- マンション（ひだまり荘のヒロイン3人の親密度が50 → 祖父の通帳 → 隣の敷地に建設。建設期間なし） ----
    mansion: {
      name: 'ひだまりレジデンス',   // 仮の名前
      unlock: { count: 3, affection: 50 },   // ひだまり荘のヒロインのうち3人の親密度が50に届くと、祖父の通帳イベント（v2.1）
      floors: 3, roomsPerFloor: 4, // 3階建て12室（部屋番号 101〜304）
      rentPerMonth: 120000,       // マンションの家賃（貧乏設定のない住人向け）
      fundsLeft: 0                // 3億円のうち建設後に手元に残す額（0＝全額建設に使う）
    },

    // ---- 1kg単位の変化（1kg単位の変化_仕様案 v0.1） ----
    // スリーサイズの増え方（cm/kg）。骨格_脂肪型。BMI39を超えた分はウエストに +0.2
    sizeRates: {
      straight_apple:  { bust: 0.85, waist: 1.35, hip: 0.6 },
      straight_pear:   { bust: 0.85, waist: 0.9,  hip: 1.0 },
      straight_hidden: { bust: 0.85, waist: 1.1,  hip: 0.75 },
      wave_apple:      { bust: 0.55, waist: 1.35, hip: 0.8 },
      wave_pear:       { bust: 0.55, waist: 0.9,  hip: 1.2 },
      wave_hidden:     { bust: 0.55, waist: 1.1,  hip: 0.95 },
      natural_apple:   { bust: 0.7,  waist: 1.35, hip: 0.7 },
      natural_pear:    { bust: 0.7,  waist: 0.9,  hip: 1.1 },
      natural_hidden:  { bust: 0.7,  waist: 1.1,  hip: 0.85 }
    },
    underRate: 0.45,            // アンダーバスト（cm/kg）。カップ＝バスト−アンダー、A＝10cm、2.5cmごと
    waistExtraFromBmi: 39, waistExtra: 0.2,
    // 服のサイズの上限（cm）。JIS女性用。6L以降は外挿。上の服はバスト、下の服はウエストとヒップの大きいほうで決める
    clothingSizes: [
      { name: 'S',  bust: 80,  waist: 64,  hip: 90 },
      { name: 'M',  bust: 87,  waist: 70,  hip: 95 },
      { name: 'L',  bust: 94,  waist: 77,  hip: 100 },
      { name: 'LL', bust: 101, waist: 85,  hip: 105 },
      { name: '3L', bust: 108, waist: 93,  hip: 110 },
      { name: '4L', bust: 115, waist: 101, hip: 115 },
      { name: '5L', bust: 122, waist: 109, hip: 120 },
      { name: '6L', bust: 129, waist: 117, hip: 125 },
      { name: '7L', bust: 136, waist: 125, hip: 130 },
      { name: '8L', bust: 143, waist: 133, hip: 135 },
      { name: '9L', bust: 150, waist: 141, hip: 140 },
      { name: '10L', bust: 157, waist: 149, hip: 145 },
      { name: '11L', bust: 164, waist: 157, hip: 150 },
      { name: '12L', bust: 171, waist: 165, hip: 155 }
    ],
    // 服のきつさ：今の服の上限まで残り何cmか（脂肪型で見る部位が変わる。りんご＝ウエスト、洋梨＝ヒップ、隠れ肥満＝平均）
    tightness: [
      { min: 5,  text: '服はまだ余裕がありそうだ' },
      { min: 3,  text: '服はちょうどいい、と本人は言う' },
      { min: 1,  text: '{part}のまわりに、小さなしわが寄っている' },
      { min: -99, text: '{part}が今にも弾けそうだ。座るたびに息を止めている' }
    ],
    tightPart: { apple: 'ボタン', pear: 'お尻と太もも', hidden: '服' },
    // 前回会ったときからの変化（kg）
    sinceLast: [
      { min: 3,    text: '明らかに太った。本人も気づいているはずだ' },
      { min: 1.5,  text: 'ほんの数日で、また一回り丸くなった' },
      { min: 0.5,  text: '気のせいか、頬が少し丸くなった気がする' },
      { min: -0.5, text: '' },
      { min: -99,  text: '少しすっきりした…？' }
    ],
    // 節目イベント
    milestones: {
      weights: [60, 70, 80, 90, 100, 110, 120, 130],
      gainFromStart: [10, 20, 30, 40, 50],
      ratioToStart: [1.5, 2.0],
      bmi: [25, 30, 35, 40],
      waist: [90]
    },
    eventsPerVisit: 1,
    // 体重を教えてくれるか（親密度と心理の段階）。開発メニューで常に表示に切り替えられる
    // 好意未満：教えてくれない／段階5〜8：強がって教えない／9〜12：小声で／13〜：自分から
    weightReveal: { minTier: 2, refuseStages: [5, 8], whisperStages: [9, 12] },

    // ---- 見た目以外の変化（v0.9） ----
    visitSceneChance: 0.35,     // 部屋を訪ねたとき、変化に気づく会話（visit シーン）が起きる確率
    acquireAfter: 3,            // 好意以上で苦手な物をこの回数食べると、好きになる
    reputationChance: 0.12,     // 夜ごと・ヒロインごとに、周りの人のうわさが届く確率（段階2以上）
    reputationKeep: 4,          // 部屋の画面に残すうわさの数
    // 食べる量の表示（食習慣と胃袋の大きさから）
    eatLabels: [
      { min: 0,   text: '小食' }, { min: 25, text: '人並み' }, { min: 50, text: 'よく食べる' },
      { min: 80,  text: '大食い' }, { min: 115, text: '底なし' }, { min: 160, text: '無尽蔵' }
    ],
    // 間食（食べる量の区分）：大食い＝chance3 の確率で1回、底なし＝毎日1回、無尽蔵＝毎日4回（朝昼夕夜）。満腹ゲージとは別
    snacks: { kcal: 400, chance3: 0.3 },
    // 出先での遭遇・会話の確率（1回の行動で1つまで）。専用の場所（大学・バイト・買い出し）を先に判定し、外れたら街中
    encounters: { campus: 0.35, job: 0.3, shopping: 0.3, town: 0.15, affection: 2 },
    campusHeroines: ['hinata', 'yukino', 'rio', 'mio', 'nagisa', 'himeka'],   // 主人公と同じ大学（葵は女子大なので除く）
    // ---- v1.6 追加の仕組み ----
    // エンディング：毎年3月31日の夜に「1年の総決算」。全員攻略・全員段階15は、その時点で特別な結末
    endingDate: '03-31',
    // 設備（自室の「設備・修繕」で買う。一度買えばずっと有効）
    facilities: [
      { id: 'nabe',    name: '大鍋とカセットコンロ',         price: 8000,  desc: '食事会を開けるようになる' },
      { id: 'kotatsu', name: 'こたつ',                       price: 12000, desc: '部屋に呼んだときと食事会で、親密度がさらに+2' },
      { id: 'cooker',  name: '業務用の炊飯器',               price: 15000, desc: '手料理と食事会のカロリー +20%' },
      { id: 'fridge',  name: '大きな冷蔵庫',                 price: 30000, desc: '作り置きが1回で+2食分' },
      { id: 'bbq',     name: '中庭のベンチとバーベキューコンロ', price: 40000, desc: '食事会に呼べる人数が3人→5人' },
      { id: 'repair',  name: '外壁と屋根の修繕',             price: 80000, desc: '建物の傷み方が半分になる' },
      { id: 'snackbox', name: '玄関のお菓子箱',               price: 3000,  desc: '「ご自由にどうぞ」。毎晩、夕・夜に在室した住人がつまむ（買い出しで補充）' },
      { id: 'snackbox2', name: 'ロビーのお菓子箱',            price: 3000,  desc: 'ひだまりレジデンスのロビーにも置く', needMansion: true },
      { id: 'vending', name: 'アパート前の自販機',             price: 20000, desc: 'ひだまり荘の住人の間食 +200kcal／日' }
    ],
    // ダイエット宣言：段階4以上で、ときどき言い出す。期間中は差し入れ・外食・手料理を断り、自分で食べる量も減る。
    // 説得に成功（シーンの選択肢で setFlag 'diet_stop'）すれば即終了。最後までやると、そのあと数日リバウンド
    diet: { chance: 0.015, minStage: 4, cooldown: 30, days: [5, 10], eatRatio: 0.85, rebound: { days: 3, kcal: 800, habit: 0.03 } },
    // 食事会（自室・夕夜。大鍋が必要）
    party: { price: 3000, kcal: 1300, cookBonus: 2, habit: 0.04, affection: 3, max: 3, maxBbq: 5, minAffection: 35, competeKcal: 400 },
    // 住人同士：掃除中に2人に会うと、うわさ話（gossipChance）。攻略した人が2人以上いると、ときどきやきもち（jealousChance）
    relations: { gossipChance: 0.35, jealousChance: 0.12 },
    // 体重計：5kg刻み（10kg刻みは節目イベントがあるので、55・65・75…kg）を超えたら、次に会ったとき
    scaleStep: 5,
    // 服を買いに行く：服のサイズが上がったあと、部屋から誘える
    clothesTrip: { price: 5000, affection: 4, minAffection: 50 },
    // 誕生日（ヒロインごとの birthday は scenes/extra/<id>.js）
    birthday: { price: 2500, kcal: 1000, affection: 6, habit: 0.02 },
    // 季節の行事：期間中、自室に「〇〇に誘う」が出る。1年に1回（1人）
    seasons: [
      { id: 'hanami',     name: 'お花見',       label: 'お花見に誘う',       from: '04-01', to: '04-10', slots: ['昼', '夕'],       bg: 'town', kcal: 900 },
      { id: 'gw',         name: 'ゴールデンウィーク', label: 'GWに出かける',  from: '05-03', to: '05-05', slots: ['昼', '夕'],       bg: 'town', kcal: 1000 },
      { id: 'tsuyu',      name: '梅雨',         label: '雨の日に誘う',       from: '06-10', to: '06-20', slots: ['昼', '夕', '夜'], bg: 'town', kcal: 600 },
      { id: 'tanabata',   name: '七夕',         label: '七夕の夜に誘う',     from: '07-07', to: '07-07', slots: ['夕', '夜'],       bg: 'town', kcal: 600 },
      { id: 'matsuri',    name: '夏祭り',       label: '夏祭りに誘う',       from: '07-27', to: '07-29', slots: ['夕', '夜'],       bg: 'matsuri', kcal: 1400 },
      { id: 'umi',        name: '海',           label: '海に誘う',           from: '08-10', to: '08-16', slots: ['昼'],             bg: 'town', kcal: 1200 },
      { id: 'tsukimi',    name: 'お月見',       label: 'お月見に誘う',       from: '09-15', to: '09-20', slots: ['夜'],             bg: 'apartment', kcal: 800 },
      { id: 'halloween',  name: 'ハロウィン',   label: 'ハロウィンに誘う',   from: '10-31', to: '10-31', slots: ['夕', '夜'],       bg: 'town', kcal: 1000 },
      { id: 'xmas',       name: 'クリスマス',   label: 'クリスマスに誘う',   from: '12-24', to: '12-25', slots: ['夕', '夜'],       bg: 'town', kcal: 1600 },
      { id: 'oomisoka',   name: '大晦日',       label: '年越しそばに誘う',   from: '12-31', to: '12-31', slots: ['夜'],             bg: 'room101', kcal: 900 },
      { id: 'shogatsu',   name: 'お正月',       label: '初詣に誘う',         from: '01-01', to: '01-03', slots: ['朝', '昼', '夕'], bg: 'shogatsu', kcal: 1400 },
      { id: 'valentine',  name: 'バレンタイン', label: 'バレンタインに会う', from: '02-14', to: '02-14', slots: ['夕', '夜'],       bg: 'room101', kcal: 900 },
      { id: 'hinamatsuri',name: 'ひな祭り',     label: 'ひな祭りに誘う',     from: '03-03', to: '03-03', slots: ['昼', '夕', '夜'], bg: 'room101', kcal: 900 },
      { id: 'whiteday',   name: 'ホワイトデー', label: 'ホワイトデーのお返し', from: '03-14', to: '03-14', slots: ['昼', '夕', '夜'], bg: 'room101', kcal: 0, multi: true },
      // キャラ専用の行事（only の住人だけ誘える）
      { id: 'setsubun',     name: '節分',         label: '陽守神社の節分祭へ',   from: '02-03', to: '02-03', slots: ['昼', '夕'],       bg: 'shrine', kcal: 900,  only: ['chihaya'] },
      { id: 'shichigosan',  name: '七五三',       label: '陽守神社の七五三へ',   from: '11-15', to: '11-15', slots: ['昼', '夕'],       bg: 'shrine', kcal: 700,  only: ['chihaya'] },
      { id: 'mochitsuki',   name: '餅つき',       label: '陽守神社の餅つきへ',   from: '12-28', to: '12-28', slots: ['昼', '夕'],       bg: 'shrine', kcal: 1500, only: ['chihaya'] },
      { id: 'kagura_natsu', name: '夏祭りの神楽', label: '千早の神楽を見に行く', from: '07-28', to: '07-28', slots: ['夕', '夜'],       bg: 'matsuri', kcal: 600,  only: ['chihaya'] },
      { id: 'kagura_haru',  name: '初詣の神楽',   label: '千早の神楽を見に行く', from: '01-02', to: '01-02', slots: ['昼', '夕'],       bg: 'shogatsu', kcal: 600,  only: ['chihaya'] },
      { id: 'misscon',      name: 'ミスコン',     label: '学園祭のミスコンへ',   from: '11-03', to: '11-03', slots: ['昼', '夕'],       bg: 'campus', kcal: 900, only: ['himeka'] },
    ],
    // 真理子の勤め先（段階で決まる。ヒロイン設定「勤め先と見た目のランクダウン」）
    marikoRanks: [
      { to: 4,  shop: '銀座の高級クラブ「ル・シエル」・指名ナンバーワン', name: '月乃' },
      { to: 6,  shop: '銀座「ル・シエル」・ナンバーワンから陥落', name: '月乃' },
      { to: 8,  shop: '六本木の会員制ラウンジ', name: 'ルナ' },
      { to: 10, shop: '歌舞伎町のキャバクラ', name: 'まりあ' },
      { to: 12, shop: '下町のスナック「夜明け」', name: 'まりちゃん' },
      { to: 15, shop: 'ぽっちゃり専門店「まんまる」・指名ナンバーワン', name: 'まりりん' }
    ],
    // 難易度（v1.8・S12）。メニュー →「設定」でいつでも変えられる
    difficulty: {
      easy:   { label: 'ゆったり', wary: 0.5, aff: 1.3,  boredDays: 0, requestDays: 99, maint: 26 },
      normal: { label: 'ふつう',   wary: 1,   aff: 1,    boredDays: 7, requestDays: 2,  maint: 28 },
      hard:   { label: 'じっくり', wary: 1.3, aff: 0.85, boredDays: 5, requestDays: 1,  maint: 30 }
    },
    // まとめて進める（v1.8・S11）：平日 朝＝掃除・昼＝大学・夕＝バイト・夜＝管理業務／休日 朝＝掃除・昼夕＝バイト・夜＝管理業務
    autoPlan: { giftBudget: 3000, stopMoney: 3000 },
    // 部屋の様子（v1.8・S6）。eat＝食べる量の区分（0〜5）で、stage＝段階のグループ（1〜4／5〜8／9〜12／13〜15）で変わる。
    // 前回訪ねたときから変わっていたら、部屋に入った直後に「（いつの間にか、…）」と地の文で出す。heroines[].roomLooks で上書きできる
    roomLooks: {
      fridge: { by: 'eat', label: '冷蔵庫', text: ['冷蔵庫には、水と卵とサラダのパックだけ', '冷蔵庫に、作り置きのおかずと牛乳が並んでいる', '冷蔵庫に、プリンとヨーグルトが並んでいる', '冷蔵庫の棚が、ケーキの箱と総菜でいっぱいになっている', '冷蔵庫に入りきらないジュースのボトルが、床に並んでいる', '冷凍庫まで、アイスと冷凍ピザでぎっしり詰まっている'] },
      table:  { by: 'stage', label: 'テーブル', text: ['片づいたテーブルに、ハーブティーのカップがひとつ', 'テーブルに、開けかけのお菓子の袋がひとつ', 'テーブルの上に、食べかけのスナックと出前のチラシが散らばっている', 'テーブルが、お菓子とカップ麺の容器で埋まっている'] },
      trash:  { by: 'eat', label: 'ゴミ箱', text: ['ゴミ箱は、ほとんど空', 'ゴミ箱に、コンビニの袋がひとつ', 'ゴミ箱に、お菓子の空き袋がいくつか入っている', 'ゴミ箱に、弁当の容器が重なっている', 'ゴミ箱の横に、ピザの箱が3つ重ねてある', 'ゴミ袋が、もう2つ目になっている'] },
      snacks: { by: 'eat', label: 'お菓子', text: ['お菓子は、どこにも置いていない', '棚に、ビスケットの箱がひとつ', 'かごに、お菓子が少し入っている', '大きなかごが、お菓子でいっぱいになっている', '部屋の隅に、お菓子専用の棚ができている', '部屋のあちこちに、お菓子の箱が積まれている'] },
      clothes:{ by: 'clothes', label: '服', text: ['椅子に掛かった服のタグは「{size}」'] }
    },
    // E3 風邪の看病
    sick: { chance: 0.008, days: 3, cooldown: 60, recoverDays: 3, recoverEat: 1.3, menu: [
      { id: 'okayu', name: 'おかゆ', kcal: 300, price: 200 }, { id: 'pudding', name: 'プリン', kcal: 250, price: 180 }, { id: 'drink', name: 'スポーツドリンク', kcal: 100, price: 150 } ] },
    // E8 デカ盛り食堂の挑戦（full＝満腹ゲージで必要な量、失敗は¥3,000）
    challenge: { price: 3000, menus: [ { name: 'メガ盛り', kcal: 3000, full: 70 }, { name: 'ギガ盛り', kcal: 4500, full: 100 }, { name: 'テラ盛り', kcal: 6500, full: 140 } ], bonus: [0, 0, 0, 0.2, 0.5, 1.0] },
    // E13 ホワイトデーのお返し
    whitedayGifts: [
      { id: 'hand', name: '手作りのお菓子', price: 1000, aff: 5, habit: 0 },
      { id: 'choco', name: '高級チョコの詰め合わせ', price: 3000, kcal: 1200, aff: 4, habit: 0 },
      { id: 'triple', name: '「3倍返し」（チョコ・マカロン・ケーキの山）', price: 6000, kcal: 3600, aff: 6, habit: 0.03 }
    ],
    // S1 天気：月ごとの [晴れ, くもり, 雨, 雪] の確率と、気温の [最低, 最高]
    weather: {
      1: { p: [0.55, 0.25, 0.1, 0.1], t: [0, 10] },  2: { p: [0.5, 0.25, 0.13, 0.12], t: [1, 11] }, 3: { p: [0.45, 0.3, 0.22, 0.03], t: [5, 15] },
      4: { p: [0.45, 0.3, 0.25, 0], t: [10, 20] }, 5: { p: [0.5, 0.25, 0.25, 0], t: [15, 25] }, 6: { p: [0.25, 0.3, 0.45, 0], t: [19, 27] },
      7: { p: [0.5, 0.25, 0.25, 0], t: [24, 33] }, 8: { p: [0.6, 0.2, 0.2, 0], t: [25, 35] }, 9: { p: [0.4, 0.3, 0.3, 0], t: [21, 31] },
      10: { p: [0.45, 0.3, 0.25, 0], t: [15, 23] }, 11: { p: [0.55, 0.3, 0.15, 0], t: [9, 18] }, 12: { p: [0.6, 0.25, 0.1, 0.05], t: [3, 12] }
    },
    // S3 住人同士の仲（−50〜100）
    pairs: { base: 20, sameBuilding: 10, sameUni: 10, friend: 60, enemy: -20, eatTogether: 0.08, quarrel: 0.3 },
    // S4 住人からの依頼
    requests: { chance: 0.06, affection: 4, building: 2, types: [
      { id: 'bulb',  name: '電球の交換',     text: '（脚立に乗って、切れた電球を新しいものに替えた）' },
      { id: 'leak',  name: '水漏れ',         text: '（流しの下にもぐって、パッキンを締め直した。水漏れは止まった）' },
      { id: 'carry', name: '重い荷物運び',   text: '（届いたばかりの大きな段ボールを、部屋の奥まで運んだ）' },
      { id: 'bug',   name: '虫退治',         text: '（新聞紙を丸めて、部屋の隅の虫を退治した。悲鳴が上がった）' },
      { id: 'shelf', name: '棚の組み立て',   text: '（説明書とにらめっこしながら、組み立て式の棚を完成させた）' },
      { id: 'shop',  name: '買い物の代行',   text: '（頼まれていた物を渡した）' }
    ] },
    // S13 固定資産税・都市計画税（東京23区の納期：6・9・12・2月、各期の月末まで）。延滞金は年率（日割り）
    propertyTax: { months: [6, 9, 12, 2], apartment: 60000, mansion: 450000, lateRate: 0.087 },
    // E2 台風（8〜10月、年2回まで。発生日の夜は停電で「住人を101号室に集める」だけ）
    typhoon: { months: [8, 9, 10], chance: 0.04, perYear: 2, kcal: 1500, nabeKcal: 500, affection: 3 },
    // E4 帰省（実家に帰る住人。noHome の住人は帰らない）
    homecoming: { periods: [{ name: 'ゴールデンウィーク', from: '05-02', to: '05-05' }, { name: 'お盆', from: '08-13', to: '08-16' }, { name: '年末年始', from: '12-29', to: '01-03' }],
      noHome: ['kotori'], dailyKcal: 1200, backKcal: 600, capturedStay: 0.5 },
    // E5 試験・繁忙期（大学生／社会人。専業主婦などは無し）
    busySeasons: { student: [['01-15', '02-05'], ['07-15', '08-05']], worker: [['03-01', '03-31'], ['12-01', '12-25']], none: [] },
    // E9 主人公の誕生日（設定で変えられる）
    myBirthday: '10-15',
    // E11 銭湯
    sento: { price: 1040, kcal: 300, affection: 3, minAffection: 50 },
    // E12 家族の上京
    family: { chance: 0.05, minStage: 7, dinnerKcal: 1500, affection: 4 },
    // S7 なじみの店
    regulars: { regular: 5, vip: 15, bigRate: 1.2, vipDiscount: 0.9, vipExtra: 300, heroineRegular: 5 },
    // S8 単位と進級（前期は7/31、後期は1/31に判定。3/31に進級。2年生・60単位から）
    credits: { start: 60, perTerm: 20, judge: ['07-31', '01-31'], need: { 2: 80, 3: 104, 4: 124 } },
    // 外出先（v2.0）。自室の「外出」からまとめて選ぶ。store＝買い出しができる店（品ぞろえは foods の shops）
    outings: [
      { id: 'uni',       name: '大学',       note: '平日の朝・昼', slots: ['朝', '昼'], weekday: true },
      { id: 'job',       name: 'アルバイト', note: 'ファミレス・昼・夕', slots: ['昼', '夕'] },
      { id: 'conveni',   name: 'コンビニ',   note: '朝〜夜・買い出し', slots: ['朝', '昼', '夕', '夜'], store: true, bg: 'supermarket' },
      { id: 'super',     name: 'スーパー',   note: '朝〜夕・買い出し', slots: ['朝', '昼', '夕'], store: true, bg: 'super' },
      { id: 'shotengai', name: '商店街',     note: '昼・夕・買い出し', slots: ['昼', '夕'], store: true, bg: 'shotengai' },
      { id: 'depa',      name: 'デパート',   note: '昼・夕・買い出し', slots: ['昼', '夕'], store: true, bg: 'depa' },
      { id: 'sento',     name: '銭湯',       note: '夕・夜（休日は朝も）', slots: ['夕', '夜'], weekendMorning: true },
      { id: 'shrine',    name: '陽守神社',   note: '昼・夕・お供え', slots: ['昼', '夕'] }
    ],
    // 攻略ペース（v2.1・攻略ペース調整 仕様案）：段階7〜8で攻略になるよう、親密度の増え方を抑える。減る分には掛けない
    affGainRate: 0.5,                         // すべての増加に掛ける
    affTierRate: [1.0, 0.8, 0.6, 0.4],        // よそよそしい・顔なじみ・好意・特別
    affDailyCap: [3, 2.5, 2, 1],              // ヒロインごとの1日の増加の上限（段階別）
    affCapBonus: 3,                           // 行事・誕生日・ホワイトデー・看病・一度きりの身の上話がある日は上限+3
    affDecay: { days: 3, amount: 1, minTier: 1 },   // 3日続けて会わないと、4日目から毎晩−1（段階の下端より下げない・攻略済みは下がらない）。minTier 1＝よそよそしい段階では下げない（住人19人だと会う機会が足りず、0から抜け出せないため）
    startAffection: { rate: 0.25, max: 10, override: { aoi: 35 } },   // 初期の親密度＝今の値×0.25（最大10）。葵だけ35
    // 身体の変化（v2.1・身体の変化 仕様案）。段階のグループ 1〜4／5〜8／9〜12／13〜15 を 0〜3 で表す。文は短く、生々しくしない
    body: {
      items: [
        { id: 'smell',  label: '体臭', minTier: 0,
          text: ['', '汗をかきやすくなった。夏は汗の匂いが少しする', '{where}が蒸れて、汗の匂いが残りやすい。シャワーの回数が増えた', '少し動くだけで汗ばむ。本人の匂いが部屋に残っている'],
          notice: ['', '（そばに寄ると、ほんのり汗の匂いがした）', '（部屋に、汗と柔軟剤の混ざった匂いがこもっている）', '（ドアを開けた瞬間、{name}の匂いがふわっと広がった）'] },
        { id: 'breath', label: '口臭', minTier: 1,
          text: ['', '食後に、食べた物の匂いが残る', '寝起きの口の匂いを気にしている。いびきをかきはじめたらしい', '口呼吸といびきが増えた。ガムやミントが手放せない'],
          notice: ['', '（話していると、さっき食べたらしい物の匂いがした）', '（あくびのたびに、口元を手で隠すようになった）', '（テーブルの上に、ミントタブレットのケースが3つ並んでいる）'] },
        { id: 'hair',   label: '体毛', minTier: 1, thinTier1: true,
          text: ['', 'うぶ毛が少し目立つ。ムダ毛の処理の範囲が広がって面倒そう', 'お腹や背中など、手の届きにくい所の処理が追いつかない', '処理をあきらめた所がある'],
          notice: ['', '（半袖の腕に、うぶ毛が光っている）', '（洗面所に、柄の長いカミソリが増えていた）', '（「もう見えない所はいいや」と、本人は笑っている）'] },
        { id: 'stretch', label: '肉割れ', minTier: 2, thinTier1: true, lateHidden: true,
          text: ['', '急に太った時期の、赤紫の細い線が{where}に出ている', '{where}の線が増えて長くなった。古いものは白っぽい', '{where}に、線が広く重なって残っている'],
          notice: ['', '（服の隙間から、{where}に細い赤紫の線がちらりと見えた）', '（{where}の線が、前より増えている）', '（{where}一面に、白と赤紫の線が重なっている）'],
          fresh: '最近また急に増えたので、{where}に新しい赤紫の線が出ている', faded: '古い線は白っぽくなってきた' },
        { id: 'dark',   label: '擦れ・黒ずみ', minTier: 2, thinTier1: true, lateHidden: true,
          text: ['', '内ももが擦れはじめ、夏は赤くなる', '{where}が擦れて黒ずんできた。擦れ防止のスパッツや粉を使っている', '首の後ろ・脇・{where}が黒ずんでいる。服で隠している'],
          notice: ['', '（歩くたびに、内ももがこすれる音がする）', '（脱衣かごに、擦れ防止のスパッツが何枚も干してある）', '（首の後ろの黒ずみを、髪で隠すようになった）'] },
        { id: 'toilet', label: 'トイレ', minTier: 2,
          text: ['', '食べる量が増えて、トイレの回数も増えた', 'トイレが長くなった。食べすぎた翌日はおなかを下しがち', '1日に何度もトイレに行く。トイレットペーパーの減りが早い'],
          notice: ['', '（「ちょっとごめん」と、話の途中でトイレに立った）', '（訪ねると、ちょうどトイレから出てきたところだった）', '（玄関に、12ロールのトイレットペーパーが2パック積んである）'],
          upset: '昨日食べすぎて、今日はおなかを下しているらしい' }
      ],
      where: {
        smell:   { apple: 'お腹と胸の下', pear: '内もも', hidden: '肉の重なる所' },
        stretch: { apple: 'お腹・脇腹・胸の横', pear: '太もも・お尻・腰', hidden: '二の腕・太もも' },
        dark:    { apple: '脇・お腹の下のくぼみ', pear: '内もも・お尻の下', hidden: '内もも' }
      },
      breathTags: { fried: '揚げ物', alcohol: 'お酒', garlic: 'ニンニク' },   // 前の日に食べた物で、口臭の文が変わる
      summer: [6, 7, 8, 9], winter: [12, 1, 2], thin: [5, 6, 7, 8, 9],          // 体臭は夏(と暑い日)に1段強く、冬は1段弱い。thin＝薄着の季節
      freshGain: 5, freshDays: 30,                                             // 30日で+5kg以上なら新しい肉割れ
      upsetRatio: 2,                                                           // 維持カロリーの2倍を超えて食べた翌日は、おなかを下す
      attitude: { 1: '本人は「ちょっと汗っかきなだけ」と、気づいていないふりをしている', 2: '本人はかなり気にしていて、会う前にシャワーを浴びたり、近づかれるのを嫌がったりする', 3: '本人はもう気にしていない。冗談にして笑っている' },
      hide: '親しくない相手には隠そうとしている（デオドラントを増やす、長袖を着る など）',
      careItems: ['care_cream', 'care_deo', 'care_spats', 'care_mint']
    },
    // v2.2：深夜の訪問・チートデイ・外食のコース
    lateVisitAffection: 70,                       // 深夜に訪ねられる親密度（攻略済みは常に）
    cheatDay: { capRate: 2, habitRate: 2, nightRate: 1.5 },   // 月1回、訪問できる人の「今日はチートデイ」。満腹の上限×2、その日の食習慣・胃袋の伸び×2、深夜の胃袋の広がり×1.5
    courseHabit: [0.7, 1, 1.2, 1.4, 1.6, 1.8],    // コースの段（少食〜無尽蔵）ごとの食習慣の倍率
    doorGift: { maxAff: 35, like: 1, normal: 0, dislike: -1, wary: 3, waryRepeat: 6, refuseWary: 60, askChance: 0.3 },   // F1 ドアノブの差し入れ
    snackBox: { refill: [{ price: 2000, kcal: 3000 }, { price: 4000, kcal: 6500 }], eat: [300, 800], eatRate: [0.6, 1.0, 1.2, 1.5, 1.8, 2.0], habit: 0.005 },   // F2 お菓子箱
    oburumai: { price: 5000, kcal: 1200, kcalNabe: 1800, habit: 0.02, affection: 1, maxWary: 80,                       // F3 大家のおふるまい（月1回・休日の夕）
      menus: { 4: '花見弁当', 5: '焼きそば', 6: '流しそうめん', 7: 'かき氷とたこ焼き', 8: 'スイカ割りとバーベキュー', 9: '芋煮', 10: '焼き芋', 11: 'おでん', 12: '年越しそば', 1: 'お雑煮と餅', 2: '豚汁', 3: 'ちらし寿司' } },
    handGift: { lowAff: 35, rate: 0.5, rateLike: 0.8, affection: 1, wary: 2, waryNo: 4 },   // F4 朝の挨拶・荷物・家賃での手渡し
    vending: { kcal: 200 },                                                                  // F5 アパート前の自販機（ひだまり荘の住人の間食）
    townShops: [                                                                             // F5 街の新しい店（決まった日に開店）
      { id: 'bakery',  from: '04-25', name: '駅前のパン屋',             note: '朝はパン、という住人が増えた。', own: 0.05 },
      { id: 'dekamori', from: '06-01', name: '商店街のデカ盛り食堂',      note: '外食に「デカ盛り食堂」が加わった。' },
      { id: 'sweets',  from: '07-15', name: 'コンビニの新作スイーツ',     note: '甘いもの好きの住人が、毎日のように買っているらしい。', snack: 150, tag: 'sweet' },
      { id: 'karaage', from: '09-01', name: '唐揚げ専門店',               note: '揚げ物好きの住人の夕食が、唐揚げ続きになった。', own: 0.05, tag: 'fried' },
      { id: 'yakiimo', from: '11-01', name: '焼き芋の屋台',               note: '寒いあいだ、毎日ひだまり荘の前を通るようになった。', snack: 100, months: [11, 12, 1, 2] }
    ],
    jobLeftovers: { foods: ['mk_hamburg', 'mk_doria', 'mk_potato', 'mk_pancake', 'mk_grill'] },   // F5 バイトのまかない持ち帰り（夕）
    eatTalkChance: 0.35,        // 部屋で「話す」とき、食べる量の区分のセリフ（scenes/eat）になる確率
    eatGiftChance: 0.7,         // 差し入れを受け取ったあと、区分のセリフを足す確率

    tagNames: { care: 'ケア用品', sweet: '甘いもの', snack: 'スナック', fried: '揚げ物', meal: 'ごはん', alcohol: 'お酒', cold: '冷たいもの', hot: 'あったかいもの' },

    // 体型タイプ（体型タイプ仕様 v0.2）。visualLag は仮シルエットの見た目だけを遅らせる
    bodyTypes: {
      frame: {
        straight: { name: 'ストレート' },
        wave:     { name: 'ウェーブ' },
        natural:  { name: 'ナチュラル' }
      },
      fat: {
        apple:  { name: 'りんご型' },
        pear:   { name: '洋梨型' },
        hidden: { name: '隠れ肥満型', visualLag: { 2: 1, 3: 2 } }
      }
    }
  },

  /* ---- 体型段階（BMIで判定）。立ち絵は段階ごとに1枚 ----
     ヒロイン設定 v1.6 の15段階。段階1〜7は2刻み、8以降は1.5刻み、15は上限120kgまで
     増やすときは id を連番に、maxBmi を小さい順に、最後は 999 */
  stages: [
    { id: 1,  name: 'スレンダー', maxBmi: 21,   desc: '細身。お腹は平らで、腕も脚もすっきり' },
    { id: 2,  name: 'ほどよい',   maxBmi: 23,   desc: '頬と二の腕にうっすら丸み。全体はまだ細め' },
    { id: 3,  name: 'ふっくら',   maxBmi: 25,   desc: '顔がまるくなり、下腹が少しふくらむ。太ももに肉がつく' },
    { id: 4,  name: 'ぽっちゃり', maxBmi: 27,   desc: 'くびれがほぼなくなり、お腹がやわらかく前に出る' },
    { id: 5,  name: 'むっちり',   maxBmi: 29,   desc: '二の腕と太ももがむっちり太く、腰回りが広がる' },
    { id: 6,  name: 'ふくよか',   maxBmi: 31,   desc: 'お腹がはっきり丸く出る。二重あごが見えはじめる' },
    { id: 7,  name: 'まるまる',   maxBmi: 33,   desc: '顔も体も丸い。お腹がベルトの上に少し乗る' },
    { id: 8,  name: 'ぽってり',   maxBmi: 34.5, desc: '軽い二重あご。太ももどうしがくっつき、横幅が広い' },
    { id: 9,  name: 'たっぷり',   maxBmi: 36,   desc: 'お腹が大きく前にせり出し、浅い段ができる' },
    { id: 10, name: 'どっしり',   maxBmi: 37.5, desc: '腰回りがとても広く、立ち姿に重量感が出る' },
    { id: 11, name: 'ずっしり',   maxBmi: 39,   desc: 'お腹が太ももにかかりはじめる。顔の輪郭がはっきり丸い' },
    { id: 12, name: 'でっぷり',   maxBmi: 40.5, desc: 'お腹が胸より大きく張り出し、横幅が肩幅を超える' },
    { id: 13, name: 'ぱんぱん',   maxBmi: 42,   desc: '服がぱんぱんに張る。お腹に段、はっきりした二重あご' },
    { id: 14, name: 'まんまる',   maxBmi: 43.5, desc: '全身が大きく丸い。座ると椅子からはみ出す' },
    { id: 15, name: 'はちきれ',   maxBmi: 999,  desc: '上限近く。体全体がひとまわり大きな丸いシルエット' }
  ],

  /* ---- 親密度の段階。セリフは段階ごとに出し分ける（[0]〜[3]） ---- */
  affectionTiers: [
    { min: 0,  name: 'よそよそしい' },
    { min: 35, name: '顔なじみ' },
    { min: 70, name: '好意' },
    { min: 91, name: '特別' }
  ],

  /* ---- 差し入れ用の食べ物 ---- */
  foods: [
    { id: 'pudding',   name: 'コンビニプリン',   price: 180, kcal: 250,  full: 8,  tags: ['sweet', 'cold'], shops: ['conveni', 'super'] },
    { id: 'creampuff', name: 'シュークリーム',   price: 150, kcal: 230,  full: 7,  tags: ['sweet'], shops: ['conveni', 'depa'] },
    { id: 'cake',      name: 'ショートケーキ',   price: 450, kcal: 380,  full: 12, tags: ['sweet', 'cold'], shops: ['depa', 'shotengai'] },
    { id: 'donuts',    name: 'ドーナツ6個入り',  price: 780, kcal: 1400, full: 28, tags: ['sweet'], shops: ['shotengai', 'depa'] },
    { id: 'chips',     name: 'ポテトチップス',   price: 160, kcal: 550,  full: 14, tags: ['snack'], shops: ['conveni', 'super'] },
    { id: 'nikuman',   name: '肉まん',           price: 150, kcal: 250,  full: 10, tags: ['meal', 'hot'], shops: ['conveni', 'shotengai'] },
    // ケア用品（v2.1・身体の変化）。カロリー0。好意以上で渡すと親密度+2（恥じらい期は+3）。効果は文章だけ
    { id: 'care_cream', name: '保湿クリーム',         price: 1200, kcal: 0, full: 0, tags: ['care'], care: 'stretch', shops: ['conveni', 'depa'] },
    { id: 'care_deo',   name: 'デオドラント',         price: 800,  kcal: 0, full: 0, tags: ['care'], care: 'smell', shops: ['conveni', 'depa'] },
    { id: 'care_spats', name: '擦れ防止のスパッツ',   price: 1500, kcal: 0, full: 0, tags: ['care'], care: 'dark', shops: ['depa', 'shotengai'] },
    { id: 'care_mint',  name: 'ミントタブレット',     price: 800,  kcal: 0, full: 0, tags: ['care'], care: 'breath', shops: ['conveni'] },
    // バイトのまかない持ち帰り（v2.1・F5）。店では買えない。夕のバイトのあとにもらえる
    { id: 'mk_hamburg', name: 'ハンバーグの残り',     price: 0, kcal: 800, full: 22, tags: ['meal'], shops: [], leftover: true },
    { id: 'mk_doria',   name: 'ドリアの余り',         price: 0, kcal: 700, full: 20, tags: ['meal', 'hot'], shops: [], leftover: true },
    { id: 'mk_potato',  name: 'フライドポテト山盛り', price: 0, kcal: 550, full: 16, tags: ['fried', 'snack'], shops: [], leftover: true },
    { id: 'mk_pancake', name: 'パンケーキの切れ端',   price: 0, kcal: 600, full: 16, tags: ['sweet'], shops: [], leftover: true },
    { id: 'mk_grill',   name: 'ミックスグリルの余り', price: 0, kcal: 900, full: 26, tags: ['meal', 'fried'], shops: [], leftover: true },
    { id: 'karaage',   name: 'からあげ弁当',     price: 550, kcal: 900,  full: 30, tags: ['fried', 'meal'], shops: ['super', 'shotengai'] },
    { id: 'beerset',   name: 'ビールとつまみ',   price: 600, kcal: 700,  full: 16, tags: ['alcohol', 'fried'], night: 1, shops: ['conveni', 'super'] },
    // v1.7 追加。night＝深夜に差し入れると、満腹ゲージの上限がこの分だけ広がる（夜食は胃袋を育てる）
    { id: 'cupramen',  name: 'カップラーメン',       price: 220,  kcal: 450,  full: 14, tags: ['meal', 'snack', 'hot'], night: 1, shops: ['conveni', 'super'] },
    { id: 'famichiki', name: 'ホットスナックのチキン', price: 230, kcal: 300,  full: 8,  tags: ['fried', 'snack'], shops: ['conveni'] },
    { id: 'daifuku',   name: '豆大福',               price: 160,  kcal: 250,  full: 8,  tags: ['sweet'], shops: ['shotengai', 'depa'] },
    { id: 'potatol',   name: 'フライドポテトL',      price: 400,  kcal: 520,  full: 14, tags: ['fried', 'snack'], night: 1, shops: ['shotengai'] },
    { id: 'pan5',      name: '菓子パン5個',          price: 650,  kcal: 1600, full: 30, tags: ['sweet'], shops: ['conveni', 'super'] },
    { id: 'katsudon',  name: 'カツ丼',               price: 700,  kcal: 1100, full: 32, tags: ['fried', 'meal', 'hot'], night: 1, shops: ['shotengai', 'super'] },
    { id: 'gyudon',    name: '特盛り牛丼',           price: 900,  kcal: 1300, full: 36, tags: ['meal', 'hot'], night: 2, shops: ['shotengai'] },
    { id: 'burger',    name: '特大ハンバーガーセット', price: 1100, kcal: 1500, full: 38, tags: ['fried', 'meal'], night: 2, shops: ['shotengai'] },
    { id: 'icefamily', name: 'アイスのファミリーパック', price: 900, kcal: 1400, full: 26, tags: ['sweet', 'cold'], night: 1, shops: ['super', 'conveni'] },
    { id: 'ramenbig',  name: '背脂ラーメン（持ち帰り）', price: 1200, kcal: 1700, full: 42, tags: ['meal', 'hot'], night: 3, shops: ['shotengai'] },
    { id: 'sake',      name: '日本酒の一升瓶とおでん', price: 2400, kcal: 1900, full: 30, tags: ['alcohol', 'hot'], night: 1, shops: ['super', 'shotengai'] },
    { id: 'bucketpud', name: 'バケツプリン',         price: 1600, kcal: 2400, full: 40, tags: ['sweet', 'cold'], night: 2, shops: ['depa'] },
    { id: 'pizzal',    name: 'ピザLサイズ',          price: 2800, kcal: 2700, full: 55, tags: ['fried', 'meal'], night: 3, shops: ['super'] },
    { id: 'wholecheese', name: 'チーズケーキ1ホール', price: 2200, kcal: 3000, full: 50, tags: ['sweet', 'cold'], night: 2, shops: ['depa'] },
    { id: 'friedbucket', name: 'フライドチキンのバケツ', price: 3200, kcal: 3600, full: 65, tags: ['fried', 'meal'], night: 3, shops: ['shotengai', 'super'] },
    { id: 'depachoco', name: '高級チョコの詰め合わせ', price: 3000, kcal: 1200, full: 18, tags: ['sweet'], shops: ['depa'] },
    { id: 'baum',      name: '老舗のバウムクーヘン',   price: 2500, kcal: 2400, full: 40, tags: ['sweet'], shops: ['depa'] },
    { id: 'depabento', name: 'デパ地下の特選弁当',     price: 1800, kcal: 1100, full: 30, tags: ['meal'], shops: ['depa'] },
    { id: 'macaron',   name: 'マカロン12個入り',       price: 3600, kcal: 1100, full: 16, tags: ['sweet', 'cold'], shops: ['depa'] },
    { id: 'korokke',   name: '肉屋のコロッケ10個',     price: 800,  kcal: 1600, full: 34, tags: ['fried', 'snack'], shops: ['shotengai'] },
    { id: 'obento3',   name: 'スーパーの特売弁当3つ', price: 900,  kcal: 2400, full: 60, tags: ['meal'], shops: ['super'] }
  ],

  // 外食に誘う：店を選ぶ（v1.7）。bg は背景（famires / teishoku / izakaya）。likeTag が好物なら親密度+2
  // v2.2：店ごとに6つのコース（少食〜無尽蔵の食べる量に合わせて選ぶ）。courses[i] の満腹・カロリー・値段。二郎系とファミレスは深夜も開いていて、深夜は胃袋が広がる（night）
  restaurants: [
    { id: 'teishoku', name: '定食屋',           price: 1000,  kcal: 1000, full: 34, affection: 5,  habit: 0.03, slots: ['昼', '夕', '夜'], bg: 'teishoku', likeTag: 'meal',
      courses: [{ name: '小鉢と味噌汁の軽め定食', full: 18, kcal: 530, price: 700 }, { name: '日替わり定食', full: 32, kcal: 940, price: 1000 }, { name: '生姜焼き定食・ご飯大盛り', full: 48, kcal: 1410, price: 1400 }, { name: '唐揚げ定食・ご飯特盛り', full: 68, kcal: 2000, price: 1800 }, { name: '唐揚げと生姜焼きのW定食・おかわり自由', full: 92, kcal: 2710, price: 2400 }, { name: '定食3人前とカツ丼', full: 125, kcal: 3680, price: 3200 }] },
    { id: 'famires',  name: 'ファミレス',       price: 1600,  kcal: 1200, full: 38, affection: 5,  habit: 0.03, slots: ['昼', '夕', '夜', '深夜'], bg: 'famires',  likeTag: 'sweet', night: 3,
      courses: [{ name: '小さめパスタとスープ', full: 18, kcal: 570, price: 1100 }, { name: 'ハンバーグセット', full: 32, kcal: 1010, price: 1600 }, { name: 'ハンバーグとドリア', full: 48, kcal: 1520, price: 2200 }, { name: 'ミックスグリルとピザとパフェ', full: 68, kcal: 2150, price: 2900 }, { name: '全部のせグリル・ピザ2枚・パフェ2つ', full: 92, kcal: 2910, price: 3800 }, { name: 'メニューの端から端まで', full: 125, kcal: 3950, price: 5100 }] },
    { id: 'jiro',     name: '二郎系ラーメン',   price: 1200,  kcal: 1900, full: 58, affection: 4,  habit: 0.04, slots: ['昼', '夕', '夜', '深夜'], bg: 'teishoku', likeTag: 'meal', night: 4,
      courses: [{ name: '小ラーメン', full: 18, kcal: 590, price: 800 }, { name: 'ラーメン（普通）', full: 32, kcal: 1050, price: 1200 }, { name: '大ラーメン', full: 48, kcal: 1570, price: 1600 }, { name: '大ラーメン・麺増し', full: 68, kcal: 2230, price: 2200 }, { name: '大ラーメン全部マシマシ', full: 92, kcal: 3010, price: 2900 }, { name: '全部マシマシ大盛りにチャーハンセットと餃子', full: 125, kcal: 4090, price: 3800 }] },
    { id: 'sushi',    name: '回転寿司',         price: 2500,  kcal: 1300, full: 44, affection: 6,  habit: 0.03, slots: ['昼', '夕', '夜'], bg: 'teishoku', likeTag: 'meal',
      courses: [{ name: '6皿', full: 18, kcal: 530, price: 1800 }, { name: '10皿', full: 32, kcal: 950, price: 2500 }, { name: '16皿', full: 48, kcal: 1420, price: 3400 }, { name: '25皿', full: 68, kcal: 2010, price: 4500 }, { name: '40皿', full: 92, kcal: 2720, price: 6000 }, { name: '60皿と茶碗蒸しとラーメン', full: 125, kcal: 3690, price: 8000 }] },
    { id: 'izakaya',  name: '居酒屋',           price: 3500,  kcal: 1600, full: 46, affection: 6,  habit: 0.03, slots: ['夕', '夜'],       bg: 'izakaya',  likeTag: 'alcohol',
      courses: [{ name: '生1杯とおつまみ', full: 18, kcal: 630, price: 2400 }, { name: '飲み放題・料理5品', full: 32, kcal: 1110, price: 3500 }, { name: '飲み放題・料理8品と〆の雑炊', full: 48, kcal: 1670, price: 4700 }, { name: '宴会コース', full: 68, kcal: 2370, price: 6300 }, { name: '宴会コースに唐揚げ山盛り追加', full: 92, kcal: 3200, price: 8400 }, { name: '宴会コース3人前', full: 125, kcal: 4350, price: 11200 }] },
    { id: 'cakebuf',  name: 'ケーキバイキング', price: 3200,  kcal: 2300, full: 52, affection: 6,  habit: 0.05, slots: ['昼', '夕'],       bg: 'famires',  likeTag: 'sweet',
      courses: [{ name: 'ケーキ2個とお茶', full: 18, kcal: 800, price: 2200 }, { name: '60分コース（ケーキ5個）', full: 32, kcal: 1420, price: 3200 }, { name: '90分コース（ケーキ8個とパスタ）', full: 48, kcal: 2120, price: 4300 }, { name: '90分コース（ケーキ12個と軽食全種）', full: 68, kcal: 3010, price: 5800 }, { name: '120分コース（全種制覇）', full: 92, kcal: 4070, price: 7700 }, { name: '時間無制限・ホールケーキ2台', full: 125, kcal: 5530, price: 10200 }] },
    { id: 'yakiniku', name: '焼肉食べ放題',     price: 4500,  kcal: 2600, full: 66, affection: 7,  habit: 0.05, slots: ['夕', '夜'],       bg: 'izakaya',  likeTag: 'fried',
      courses: [{ name: 'お手軽コース（60分）', full: 18, kcal: 710, price: 3200 }, { name: 'スタンダードコース（90分）', full: 32, kcal: 1260, price: 4500 }, { name: '上カルビコース', full: 48, kcal: 1890, price: 6100 }, { name: '特選コース', full: 68, kcal: 2680, price: 8100 }, { name: '極みコース（120分・ご飯おかわり自由）', full: 92, kcal: 3620, price: 10800 }, { name: '極みコース・時間無制限', full: 125, kcal: 4920, price: 14400 }] },
    { id: 'dekamori', needShop: 'dekamori', name: 'デカ盛り食堂（挑戦）', price: 0, kcal: 0, full: 0, affection: 5, habit: 0.05, slots: ['昼', '夕'], bg: 'teishoku', likeTag: 'meal', challenge: true },
    { id: 'french',   name: 'フレンチのコース', price: 12000, kcal: 1500, full: 40, affection: 10, habit: 0.02, slots: ['夜'],             bg: 'teishoku', likeTag: 'sweet',
      courses: [{ name: '前菜とスープのプチコース', full: 18, kcal: 680, price: 8400 }, { name: 'ランチコース', full: 32, kcal: 1200, price: 12000 }, { name: 'ディナーコース', full: 48, kcal: 1800, price: 16200 }, { name: 'シェフのおまかせ', full: 68, kcal: 2550, price: 21600 }, { name: 'おまかせにパン・チーズ・デザートワゴン全部', full: 92, kcal: 3450, price: 28800 }, { name: 'おまかせを2周', full: 125, kcal: 4690, price: 38400 }] }
  ],

  /* ---- 一緒に食べる系の行動 ---- */
  meals: {
    eatOut:   { label: '外食に誘う',       price: 2400, kcal: 1300, full: 45, affection: 6, habit: 0.03, minAffection: 35, slots: ['昼', '夕', '夜'] },
    homeCook: { label: '手料理をふるまう', affection: 7, habit: 0.04, minAffection: 70, slots: ['夕', '夜'] }   // カロリー・満腹・材料費は選んだ料理（recipes）で決まる
  },

  /* ---- 手料理のレパートリー。料理の腕が minSkill に届くと作れる。cost は1食分の材料費 ----
     手料理をふるまうとき・作り置きするときに、作れる料理から選ぶ。tags は好き嫌いの判定に使う */
  recipes: [
    { id: 'moyashi',   name: 'もやし炒め',             minSkill: 0,   kcal: 250,  full: 14, cost: 150,  tags: ['meal'] },
    { id: 'soup',      name: '具だくさん野菜スープ',   minSkill: 0,   kcal: 200,  full: 12, cost: 200,  tags: ['meal'] },
    { id: 'tamagoyaki',name: '甘い卵焼き',             minSkill: 20,  kcal: 320,  full: 12, cost: 150,  tags: ['meal'] },
    { id: 'onigiri',   name: 'おにぎり三種',           minSkill: 35,  kcal: 520,  full: 20, cost: 200,  tags: ['meal'] },
    { id: 'nikujaga',  name: '肉じゃが',               minSkill: 55,  kcal: 600,  full: 24, cost: 400,  tags: ['meal'] },
    { id: 'omurice',   name: 'オムライス',             minSkill: 80,  kcal: 800,  full: 28, cost: 350,  tags: ['meal'] },
    { id: 'karaage',   name: '山盛りからあげ',         minSkill: 105, kcal: 1000, full: 30, cost: 500,  tags: ['fried', 'meal'] },
    { id: 'curry',     name: '大盛りカツカレー',       minSkill: 135, kcal: 1300, full: 38, cost: 600,  tags: ['fried', 'meal'] },
    { id: 'pancake',   name: 'ホットケーキタワー',     minSkill: 165, kcal: 1300, full: 30, cost: 400,  tags: ['sweet'] },
    { id: 'hamburg',   name: 'チーズハンバーグ定食',   minSkill: 200, kcal: 1400, full: 40, cost: 700,  tags: ['meal'] },
    { id: 'gratin',    name: 'マカロニグラタン',       minSkill: 240, kcal: 1500, full: 40, cost: 600,  tags: ['meal'] },
    { id: 'katsudon',  name: '特盛りかつ丼',           minSkill: 280, kcal: 1800, full: 50, cost: 800,  tags: ['fried', 'meal'] },
    { id: 'donutmount',name: '手作りドーナツの山',     minSkill: 320, kcal: 2200, full: 40, cost: 700,  tags: ['sweet', 'snack'] },
    { id: 'chuka',     name: '中華フルコース',         minSkill: 370, kcal: 2600, full: 60, cost: 1500, tags: ['fried', 'meal'] },
    { id: 'wholecake', name: '手作りのホールケーキ',   minSkill: 420, kcal: 2800, full: 45, cost: 1200, tags: ['sweet'] },
    { id: 'feast',     name: 'ごちそう満漢全席',       minSkill: 480, kcal: 3800, full: 75, cost: 2500, tags: ['meal', 'fried', 'sweet'] }
  ],

  /* ---- タイプ共通の「太ったときの反応」（体型タイプ仕様 v0.2）----
     ヒロイン固有の stageUp がない段階で使う。early=段階2〜5, mid=6〜10, late=11〜15
     hidden は段階2・3（s23）、段階4（s4）を特別扱い */
  typeReactions: {
    fat: {
      apple: {
        early: { low: 'ウエストのボタン、留まらなくなってきた…', high: 'お腹、ちょっと出てきたでしょ。触ってみる？' },
        mid:   { low: '座るとお腹がつかえるの…', high: 'このお腹、すっかり定位置になっちゃった' },
        late:  { low: '下を向いても足元が見えないんだけど…', high: 'お腹の上にお皿が置けるようになったよ' }
      },
      pear: {
        early: { low: 'ジーンズ、太ももで止まっちゃった…', high: '最近お尻が大きくなったって言われるの' },
        mid:   { low: '歩くと太ももがこすれて…', high: '下半身だけどんどん育つんだよね。誰かさんのせいで' },
        late:  { low: '椅子の肘掛けに腰が引っかかるの…', high: '座布団、二枚いるかも。ふふ' }
      },
      hidden: {
        s23:   { low: '体重計の数字だけ増えてる…見た目は変わらないのに', high: '見た目は変わらないでしょ？…数字は内緒' },
        s4:    { low: 'え、急に服が全部きつくなったんだけど！', high: '一気に来ちゃった。ずっと溜めてた分かな' },
        mid:   { low: 'どこもかしこもやわらかくなっちゃった…', high: '全身ふにふにでしょ。抱き心地は保証するよ' },
        late:  { low: 'どこもかしこもやわらかくなっちゃった…', high: '全身ふにふにでしょ。抱き心地は保証するよ' }
      }
    }
  },

  /* ---- 節目イベントの共通セリフ（キャラ設定セッションで差し替え・追加可）----
     key: clothesUp / weight / weight100 / gain / ratio15 / ratio2 / bmi25 / bmi30 / bmi35 / bmi40 / waist90 / reverse
     narr は主人公の気づき（地の文）。low は親密度が低い（好意未満）、high は好意以上・攻略後
     {kg} {size} {prev} {gain} はその場の数値に置き換わる。脂肪型ごとの上書きは byFat に書く
     ヒロイン固有は heroines[].lines.milestone[key] に同じ形で書く */
  milestoneLines: {
    clothesUp: { narr: '（服が新しくなっている。前より一回り大きいサイズだ）',
      low: '…前の服、入らなくなっちゃって。{prev}から{size}にしたの', high: '{prev}、もう入らないの。{size}買っちゃった。…誰のせいかな' },
    weight:    { narr: '（なんだか、そわそわしている）',
      low: '体重計、見間違いかと思った…{kg}kgって', high: 'ねえ、ついに{kg}kg超えちゃった。…ちょっとだけ、うれしいかも' },
    weight100: { narr: '（いつもと様子が違う。何か言いたそうだ）',
      low: '…体重計がエラーになったの。100kg超えたら測れないんだって', high: '100kg、超えちゃった。…大台だよ、大台。お祝いしてくれる？' },
    gain:      { narr: '（服の上からでも、体の丸みがはっきり分かる）',
      low: 'ここに来てから、{gain}kgも増えちゃった…', high: '引っ越してきたときより{gain}kgも増えたの。…ごはんがおいしすぎるせいだからね' },
    ratio15:   { narr: '（初めて会ったころの姿を思い出すと、別人のようだ）',
      low: '昔の写真見たら、別人みたいで…', high: '昔の写真と並べたら、1.5倍になってた。…どっちが好き？' },
    ratio2:    { narr: '（初めて会ったころの、ちょうど倍。大きな節目だ）',
      low: '…体重、最初の2倍なの。2人分だよ、2人分', high: '最初の2倍になっちゃった。ここまで育てたんだから、ちゃんと責任とってね' },
    bmi25:     { narr: '（健康診断の結果の紙を持っている）',
      low: '健康診断で「肥満1度」って書いてあった…', high: '健康診断、肥満1度だって。…まだまだ序の口だよね？' },
    bmi30:     { narr: '（健康診断の結果の紙を、こっそり隠した）',
      low: '「肥満2度」って…先生に食生活を聞かれちゃった', high: '肥満2度。先生に「何食べてるの」って聞かれたから、「誰かさんのごはん」って答えておいた' },
    bmi35:     { narr: '（健康診断の封筒を、開けずに置いている）',
      low: '…肥満3度。もう、数字見たくない', high: '肥満3度だって。…封筒、一緒に開けてくれる？' },
    bmi40:     { narr: '（健康診断の結果を、もう気にしていないようだ）',
      low: '肥満4度…いちばん上なんだって', high: '肥満4度。いちばん上まで来ちゃった。ふふ' },
    waist90:   { narr: '（お腹のあたりを気にしている）',
      low: '健康診断で「腹囲が基準を超えてます」って言われた…', high: '腹囲、90cm超えたんだって。メジャーが足りなかった、なんてね' },
    reverse:   { narr: '（体の線が、すっかり変わっている）',
      low: '…なんか最近、体の形が変わってきた気がする', high: 'ねえ見て、体の形、すっかり変わっちゃった' },
    byFat: {
      apple: {
        clothesUp: { low: 'ウエストのボタンが留まらなくて…{size}にしたの', high: 'お腹がね、{prev}じゃもう無理だって。{size}にした' },
        reverse:   { low: 'お腹のほうが、胸より出てる…', high: 'お腹のほうが胸より大きくなっちゃった。触ってみる？' }
      },
      pear: {
        clothesUp: { low: '太ももが入らなくて…{size}にしたの', high: 'お尻がね、{prev}じゃ入らないの。{size}にしちゃった' },
        reverse:   { low: '腰まわりだけ、どんどん大きくなって…', high: '下半身、すっかり大きくなったでしょ。座布団いらずだよ' }
      },
      hidden: {
        clothesUp: { low: '急に、服が全部きつくなって…まとめて{size}にしたの', high: '一気に来ちゃった。全部{size}に買い替えだよ' }
      }
    }
  },

  /* ---- 全キャラ共通の予備セリフ。ヒロインの lines にそのキーがないときに使う（口調に癖のない言い方） ---- */
  // 実績（v1.8・S9）。判定はエンジン側（id で対応）
  achievements: [
    { id: 'big100',   name: 'はじめての大台',  desc: '誰かが100kgを超えた' },
    { id: 'double',   name: '倍々ゲーム',      desc: '誰かが最初の体重の2倍になった' },
    { id: 'allLL',    name: 'みんなLL以上',    desc: '住人全員の服（上）がLL以上' },
    { id: 'floor3',   name: '床が泣いている',  desc: '3人の部屋で床をきしませた' },
    { id: 'tera',     name: 'テラ盛り制覇',    desc: 'デカ盛り食堂のテラ盛りを完食' },
    { id: 'storm5',   name: '嵐の夜の宴',      desc: '台風の夜に5人以上が集まった' },
    { id: 'care10',   name: '看病のプロ',      desc: '風邪の看病を10回した' },
    { id: 'regular3', name: '常連の管理人',    desc: '顔パスの店が3軒' },
    { id: 'keep3',    name: '理想の体型',      desc: '3人を「体型を保つ」にした' },
    { id: 'paradise', name: 'ひだまりの楽園',  desc: '全員攻略かつ全員段階15' },
    { id: 'tax',      name: 'きちんと納税',    desc: '1年間、固定資産税をすべて期限内に払った' },
    { id: 'graduate', name: '卒業おめでとう',  desc: '大学を卒業した' }
  ],
  // エンディング（v1.6）。{best}＝いちばん親しい住人、{count}＝攻略した人数、{year}＝年度、〇〇＝主人公
  endings: {
    full: { title: 'ひだまりの楽園', text: [
      '気がつけば、ひだまり荘とひだまりレジデンスの住人は、みんな〇〇の作るごはんを待つようになっていた。',
      '廊下を歩けば、どの部屋からも「おかえり」と、少しくぐもった、しあわせそうな声がする。',
      '階段がきしむのは、建物が古いせいだけじゃない。それを笑い合える人たちが、ここにはいる。',
      '祖父が遺したボロアパートは、いつの間にか、世界でいちばんあたたかくて、ふくよかな場所になっていた。'
    ] },
    harem: { title: 'みんなの管理人', text: [
      '{year}年度が終わる。住人たちは全員、〇〇のことを「特別な人」と呼ぶようになった。',
      'まだ先は長い。冷蔵庫はいつも満杯で、鍋はいつも大きすぎるくらいがちょうどいい。',
      '来年度も、ここで、みんなのごはんを作ろう。'
    ] },
    one: { title: 'ふたりのひだまり', text: [
      '{year}年度が終わる。攻略した住人は{count}人。',
      'いちばん近くにいるのは、{best}。今夜も「おなかすいた」と、101号室の戸をたたくだろう。',
      'まだ攻略していない住人もいる。春は、また何かが始まる季節だ。'
    ] },
    alone: { title: 'ひとりの春', text: [
      '{year}年度が終わる。管理人の仕事には、ずいぶん慣れた。',
      'それでも101号室のちゃぶ台は、まだひとり分しか埋まっていない。',
      'いちばん話す住人は{best}。…来年度こそ、もう少し近づけるだろうか。'
    ] }
  },
  // スマホのメッセージ（v1.8・S5）。キャラごとは scenes/phone/<id>.js の addPhone(id, [...]) で上書き・追加。{food} は食べ物の名前
  commonPhone: [
    { if: { maxStage: 4 }, msg: '今日のお昼、ちゃんと野菜も食べたよ', photo: 'サラダとサンドイッチ', replies: [{ text: 'えらいね', aff: 1, res: 'えへへ。ほめられた' }, { text: 'たまにはがっつり食べなよ', aff: 1, habit: 0.01, res: '…じゃあ、明日はパスタにしよっかな' }] },
    { if: { minStage: 5, maxStage: 8 }, msg: 'コンビニで新作のスイーツ見つけちゃった', photo: '新作のロールケーキ', replies: [{ text: 'おいしそう', aff: 1, res: 'でしょ？ …ふたつ買っちゃった' }, { text: '一緒に食べたかったな', aff: 1, habit: 0.01, res: '…今から、もうひとつ買ってくる' }] },
    { if: { minStage: 9, maxStage: 12 }, msg: '夜ごはん、ちょっと多かったかも…', photo: '特盛りカツ丼', replies: [{ text: 'おいしそうに食べてるの、好きだよ', aff: 1, res: '…そういうこと言うから、食べちゃうんじゃん' }, { text: 'デザートは？', aff: 1, habit: 0.01, res: '…冷蔵庫にプリンがあるの、なんで知ってるの' }] },
    { if: { minStage: 13 }, msg: '見て見て、今日の夜食', photo: 'ピザLサイズと唐揚げ', replies: [{ text: 'いい食べっぷり', aff: 1, res: 'ふふん。〇〇のせいで、胃袋が大きくなったんだからね' }, { text: '明日はもっとすごいの持っていくね', aff: 1, habit: 0.01, res: '…楽しみにしてる。ほんとに' }] },
    { if: { captured: true }, msg: '…今、なにしてる？ ちょっと声が聞きたくなっただけ', photo: '', replies: [{ text: '会いに行こうか', aff: 2, res: '…うん。おなかもすいたし' }, { text: '夜食、持っていくね', aff: 1, habit: 0.01, res: 'やった。待ってる' }] }
  ],
  // 共通のシーン（v1.8）。キャラごとのシーン（scenes/extra などの同じ type）が無いときに使う。セリフはヒロイン、'（…）'は地の文
  commonScenes: [
    { id: 'c_reunion', type: 'reunion', nodes: {
      start: { say: ['（街角で、{name}が知らない女性に呼び止められた。昔の同級生らしい）', '（「え、{name}？ …なんか、変わったね」）'],
        branch: [{ if: { minStage: 13 }, next: 's13' }, { if: { minStage: 9 }, next: 's9' }, { next: 's5' }] },
      s5: { say: ['ちょ、ちょっとむくんでるだけ！ 最近、寝不足で'], next: 'ch' },
      s9: { say: ['（{name}は真っ赤になって、そっとこちらの背中に隠れた）'], next: 'ch' },
      s13: { say: ['ふふ。幸せ太りなの。…この人のせいでね'], next: 'ch' },
      ch: { choices: [
        { text: '（かばう）今のほうが、ずっと素敵ですよ', aff: 4, say: ['（昔の同級生は目を丸くして、手を振って去っていった）', '…ありがと。助かった'] },
        { text: '（黙って見守る）', aff: 0, say: ['（昔の同級生が去るまで、{name}は黙って立っていた）'] }
      ] } } },
    { id: 'c_momcall', type: 'momCall', nodes: {
      start: { say: ['（{name}のスマホが鳴った。画面には「お母さん」）', '（電話の向こうから、大きな声が漏れてくる。「あんた、帰ってきたとき顔がまんまるだったわよ。ちゃんと野菜食べてるの？」）'],
        branch: [{ if: { minStage: 13 }, next: 's13' }, { if: { minStage: 9 }, next: 's9' }, { next: 's5' }] },
      s5: { say: ['た、食べてるってば！ …もう、切るね！', '（電話を切ると、{name}はクッションに顔をうずめた）'] },
      s9: { say: ['…うん。…うん、気をつける', '（電話を切った{name}は、しばらく黙ってお腹をさすっていた）'] },
      s13: { say: ['うん、元気だよ。…ごはんがおいしすぎるの。いい人がいてね', '（電話を切った{name}は、照れくさそうに笑った）'] } } },
    { id: 'c_familyVisit', type: 'familyVisit', nodes: {
      start: { say: ['（{name}の部屋に、上京してきた家族が来ていた）', '（「あら、管理人さん？ いつも娘がお世話に…あんた、こっちで何食べてるの」）', '…ちょっと、お母さん！'],
        choices: [
          { text: 'いつも、おいしそうに食べてくれます', aff: 3, setFlag: 'family_ok', say: ['（家族は「まあ」と笑って、手土産の和菓子を差し出した）'] },
          { text: '（会釈して、そっと帰る）', aff: 1, say: ['（ドアを閉めると、中から笑い声が聞こえた）'] }
        ] } } },
    { id: 'c_afterFamily', type: 'afterFamily', nodes: {
      start: { say: ['家族、帰ったよ。…「いい管理人さんね」だって', '「ちゃんと食べさせてもらってるのね」とも言われた。…言い返せなかった'] } } },
    { id: 'c_sento', type: 'sento', nodes: {
      start: { say: ['（銭湯の前で別れて、休憩所のベンチで待っていると、湯上がりの{name}が出てきた）'],
        branch: [{ if: { minStage: 13 }, next: 's13' }, { if: { minStage: 9 }, next: 's9' }, { next: 's0' }] },
      s0: { say: ['脱衣所の体重計、ちょっと増えてた。…まあ、許容範囲'], next: 'milk' },
      s9: { say: ['…体重計に乗ったら、隣のおばあちゃんに「あら」って言われた'], next: 'milk' },
      s13: { say: ['体重計の針、振り切れそうだった。…台の目盛り、足りてなかったかも'], next: 'milk' },
      milk: { choices: [
        { text: 'コーヒー牛乳、どうぞ', aff: 1, say: ['ありがと。…湯上がりはこれだよね'] },
        { text: 'アイスもどうですか', aff: 1, habit: 0.01, say: ['…食べる。ふたつ'] }
      ] } } },

    { id: 'c_floor', type: 'floor', nodes: {
      start: { say: ['（部屋に一歩入ったとたん、床が「みしっ」と大きく鳴った）', '（{name}の顔が、みるみる赤くなっていく）', '…い、今の、聞こえた？'],
        choices: [
          { text: '（すぐに補強します）', if: { maxStage: 12 }, money: -20000, building: 5, aff: 3, setFlag: 'floor_fixed', say: ['…ありがとう。古い建物だもんね。…古いせい、だよね？'] },
          { text: '（すぐに補強します）', if: { minStage: 13 }, money: -30000, building: 5, aff: 3, setFlag: 'floor_fixed', say: ['…ありがとう。…前より、しっかり補強してね'] },
          { text: '古い建物ですから', aff: 1, setFlag: 'floor_unfixed', say: ['…そう、だよね。うん、建物のせい'] },
          { text: '（からかう）', aff: -3, wary: 10, say: ['…最っ低。出てって'] }
        ] } } },
    { id: 'c_floor100', type: 'floor100', nodes: {
      start: { say: ['（{name}が座布団から立ち上がった瞬間、畳がずぶりと沈んだ）', '…ねえ。畳、へこんでない？'],
        choices: [
          { text: '（畳ごと替えます）', money: -30000, building: 5, aff: 3, setFlag: 'floor_fixed', say: ['…ごめんね、お金かけさせちゃって。…でも、ありがとう'] },
          { text: '畳も古いので', aff: 1, setFlag: 'floor_unfixed', say: ['…やさしいね。そういうことに、しておく'] }
        ] } } },
    { id: 'c_sick', type: 'sick', nodes: {
      start: { say: ['（布団の中で、{name}がマスク越しに咳きこんでいる）', '…ごめん、こんな格好で。来てくれたんだ'],
        choices: [
          { text: '何か食べられそう？', say: ['…ちょっとなら。…ううん、けっこう食べられるかも'] },
          { text: 'ゆっくり休んでください', say: ['…うん。…そばにいてくれると、安心する'] }
        ] } } },
    { id: 'c_recover', type: 'recover', nodes: {
      start: { say: ['（すっかり元気になった{name}が、冷蔵庫をのぞきこんでいる）', '治ったら、もう、お腹すいちゃって。…寝てたぶん、取り戻さなきゃ'] } } },
    { id: 'c_delivery', type: 'delivery', nodes: {
      start: { say: ['（ドアの前で、配達員とはち合わせた。手には、Lサイズのピザの箱が2枚）', '（ドアが開いて、{name}が固まった）', '…あ。…見た？'],
        choices: [
          { text: '一緒に食べてもいいですか', aff: 2, say: ['…うん。ひとりで食べきるつもりだったけど、ないしょね'] },
          { text: '（見なかったことにする）', aff: 1, say: ['（ドアの向こうで、箱を開ける音がした）'] },
          { text: '頼みすぎじゃないですか？', next: 'too' }
        ] },
      too: { branch: [{ if: { minStage: 13 }, next: 'too13' }, { next: 'too0' }] },
      too0: { aff: -2, say: ['た、頼みすぎじゃないし！ 明日の分も入ってるの！'] },
      too13: { say: ['え？ いつもこれくらいだよ？'] } } },
    { id: 'c_old1', type: 'oldClothes1', nodes: {
      start: { say: ['（押し入れの整理をしていた{name}が、卒業アルバムを広げている）', '…見て、これ。高校のときの'],
        choices: [
          { text: '（写真と今の姿を見比べる）', say: ['（観察眼で見ると、写真の頃より{gain}kgほど増えている）', '…ちょっと。じろじろ見ないで'] },
          { text: 'かわいいですね', aff: 2, say: ['…今と、どっちが？ …答えなくていい'] }
        ] } } },
    { id: 'c_old2', type: 'oldClothes2', nodes: {
      start: { say: ['（{name}が、ハンガーに掛けた昔の制服とにらめっこしている）', '…着てみたの。前が、閉まらなかった'],
        choices: [
          { text: '今のほうが似合う服、ありますよ', aff: 3, say: ['…そう言うと思った。…ほんと、ずるい'] },
          { text: '（何も言わずに、お菓子を差し出す）', aff: 1, habit: 0.02, say: ['…それ、今いちばんダメなやつ。…いただきます'] }
        ] } } },
    { id: 'c_old3', type: 'oldClothes3', nodes: {
      start: { say: ['（昔の服をまとめて紙袋に詰めた{name}が、さっぱりした顔をしている）', 'もう入らないし、全部しまっちゃった。…今の体の服のほうが、好きだし'] } } },
    { id: 'c_fav', type: 'favClothes', nodes: {
      start: { say: ['（{name}が、大事そうにワンピースを抱えている）', 'これね、いちばんお気に入りだったの。…背中のファスナー、上がらなかった'],
        choices: [
          { text: '直してもらいましょう', aff: 2, say: ['…直せるかな。…ううん、新しいのにする。〇〇といっしょに選ぶ'] },
          { text: 'それだけおいしいもの食べたってことです', aff: 1, say: ['…あなたのせいでしょ。ほんとに'] }
        ] } } },
    { id: 'c_dress', type: 'partyDress', nodes: {
      start: { say: ['（{name}が、ドレスを体に当てて鏡の前に立っている）', '…来週、友だちの結婚式なのに。これ、もう入らないの'],
        choices: [
          { text: '一緒に買いに行きましょう', money: -8000, aff: 4, say: ['（駅前の店で、今の体に合うドレスを一緒に選んだ）', '…これなら、胸を張って出られる。ありがとう'] },
          { text: '今のほうが似合うドレスがありますよ', aff: 3, say: ['…ほんとに？ …じゃあ、探してみる'] }
        ] } } }
  ],
  commonLines: {
    cheatDay: [['…チートデイ？ 今日だけなら、まあ…'], ['今日はチートデイ！ 好きなだけ食べていいんだよね？'], ['やった、チートデイ！ 今日は遠慮しないからね'], ['チートデイだね。…〇〇くんが用意してくれるもの、全部食べちゃう']],
    lateMeal_jiro: ['こんな時間にラーメン…背徳の味だね', '夜中のニンニク、明日のことは考えないことにする', 'スープまで飲んじゃった。…夜中なのに'],
    lateMeal_famires: ['深夜のファミレスって、なんでこんなにおいしいんだろ', 'この時間のドリンクバー、なんだか特別な感じ', '夜中のパフェ…罪の味がする'],
    lateMeal: ['夜食って、どうしてこんなに罪の味がするんだろうね'],
    // v2.2：部屋に入れない親密度の人の変化に、次に会ったとき主人公が気づく（地の文。{name}＝下の名前）
    lowNoticeStage: ['（…{name}さん、前に会ったときより、ふっくらした気がする）', '（頬のあたりが、少し丸くなったような…？）', '（気のせいかな。{name}さん、少し柔らかい雰囲気になった）', '（観察眼に映る数字が、前より増えている。…やっぱり、ふっくらしたんだ）'],
    lowNoticeBig: ['（…{name}さん、しばらく見ないうちに、ずいぶんふくよかになった）', '（思わず二度見した。{name}さん、前よりひと回り大きくなっている）'],
    lowNoticeDown: ['（…{name}さん、少しすっきりした気がする）'],
    lowNoticeClothes: ['（あれ、服がいつもと違う。サイズを変えたのかな）', '（前に着ていた服より、ゆったりした服を着ている）', '（新しい服だ。…前の服は、もう入らなくなったのかもしれない）'],
    lowNoticeClothesDown: ['（服が、前より少し小さいサイズになっている）'],
    // v2.1：身体の変化・ケア用品（キャラ固有は heroines[].lines で上書き）
    careGift: [['あ…ありがとうございます。…そんなに、気になりました？'], ['え、これ…ありがと。…私、匂う？'], ['…気づいてたんだ。ありがとう。こっそり使うね'], ['ありがと。…ねえ、今度塗ってくれる？ 背中、届かないの']],
    careGiftShy: ['…っ、見ないでって言ったのに。…でも、ありがと。すごく助かる', 'こういうの、自分で買うの恥ずかしくて。…ありがとう'],
    careGiftAccept: ['ありがと。じゃあ早速、塗ってくれる？ 背中とか、もう自分じゃ届かないんだ', 'えへへ、気がきくね。…ほら、ここ。塗って'],
    // v2.1：手渡し（F4）・おふるまい（F3）。キャラ固有は heroines[].lines / extra で上書き
    handGiftOk: [['あ…ありがとうございます。じゃあ、いただきます', 'いいんですか？ …じゃあ、遠慮なく'], ['わ、ありがとう。ちょうど小腹が空いてたんだ', 'いつもありがとう。ちゃんと食べるね'], ['えへへ、うれしい。あとで大事に食べるね', 'もう、〇〇くんたら。…ありがと'], ['ありがとう。〇〇くんがくれるものなら、何でもうれしい', 'ふふ、今日も持ってきてくれたんだ']],
    handGiftNo: [['あ、いえ…お気持ちだけで', 'すみません、そういうのは…大丈夫です'], ['ごめん、今日はおなかいっぱいで', 'ありがとう。でも今日はいいかな'], ['ごめんね、今ちょっと…また今度ちょうだい'], ['今日はだめ。…食べすぎちゃったの']],
    oburumai: ['わあ、おいしそう。いただきます', '大家さんのおふるまい、毎月楽しみにしてるんです', '…じゃあ、ひとつだけ。…もうひとつだけ', 'ごちそうさまです。…あ、おかわりもいいですか？'],
    // v1.6：キャラごとの extra に無いときの予備
    party: ['いただきます！', 'みんなで食べると、おいしいね', 'おかわり、ある？'],
    partyAbout: ['{other}さん、いい食べっぷり', '{other}さんと食べるの、楽しいね'],
    gossip: ['ねえ、{other}さん、最近ちょっと丸くなったよね', '{other}さん、前よりよく食べるようになったみたい'],
    compete: ['…負けないから', 'まだまだ入るよ'],
    jealous: ['…今日、{other}さんと会ってたでしょ', '{other}さんにも、そういう顔するんだ'],
    dietRefuse: ['ごめん、今ダイエット中なの', '…今はだめ。決めたんだから'],
    birthday: ['覚えててくれたの？…ありがとう', 'ケーキ…！ うれしい'],
    clothes: ['この服、どうかな', '…サイズ、ひとつ上にしなきゃ'],
    orderAsk: ['次は{food}ね。持ってこなかったら許さないから'],
    bored: ['…またこれ？ いや、おいしいけど', 'これ、最近ちょっと続いてるかも'],
    hooked: ['これ、クセになっちゃった…', 'ねえ、またこれ持ってきて。…好きになっちゃったの'],
    keepOn: ['…この体のままで、いいの？ ふふ、わかった'],
    challengeWin: ['…食べきっちゃった。写真、撮られちゃった…', 'まだいけるけど？ …次のメニュー、気になる'],
    challengeLose: ['…ギブ。もう一口も入らない…', 'くやしい…次は、ぜったい食べきる'],
    request: ['助かったぁ…ありがとう', 'さすが管理人さん。頼りになる'],
    quarrel: ['…ちょっと、{other}。今の、どういう意味？', '{other}には言われたくないんだけど'],
    taxNotice: ['…ねえ、これ。机の上に「督促状」って書いてあったけど。大丈夫？'],
    hotDay: ['冷たいの、最高…！ 生き返る'], coldDay: ['あったかいの、しみる…'],
    typhoon: ['停電、こわいね…でも、みんなといると平気', '冷蔵庫のもの、傷む前に食べちゃお', 'ろうそくの明かりで食べると、なんかおいしいね'],
    typhoonAfter: ['昨日はありがと。…片付け、手伝うね'],
    homeBack: ['ただいま。実家のお土産、一緒に食べよ', '実家、ごはんが多すぎて…。はい、お土産'],
    busy: ['今、いちばん忙しい時期で…食べないとやってられない', 'ストレスで、お菓子が止まらないの'],
    examEnd: ['終わったー！ 打ち上げ、行こ？', 'やっと解放された…。今日は、思いっきり食べたい'],
    myBirthday: ['お誕生日おめでとう！ みんなでケーキ作ったんだよ', '…作りすぎちゃった。残りは、わたしたちが食べるね'],
    sento: ['いいお湯だった〜。…コーヒー牛乳、いっしょに飲も', '湯上がりのアイス、最高'],
    familyDinner: ['…お母さん、食べさせすぎ。わたしも食べるけど'],
    whiteday: ['お返し、ちゃんと覚えててくれたんだ', '…ありがとう。大事に食べる。…すぐ食べちゃうけど'],
    orderOk: ['ちゃんと持ってきたじゃん。…ほめてあげる'],
    focusGift: ['そこに置いといて。今、手が離せないの'],
    offering: ['おさがり、ありがたくいただきました'],
    ake: ['夜勤明けは、腹が減ってかなわん'],
    greetMorning: [['…おはようございます'], ['おはよう。朝から精が出るね'], ['おはよう。顔が見られてうれしい'], ['おはよう。…今日も来てくれる？']],
    greetEvening: [['…ただいま戻りました'], ['ただいま。掃除、おつかれさま'], ['ただいま。…顔を見たら、疲れが取れた'], ['ただいま。…待っててくれたの？']],
    greet: [['…何かご用ですか？'], ['いらっしゃい'], ['来てくれたんだ。どうぞ'], ['おかえり']],
    talk: [['……'], ['最近、いろいろあってね'], ['こうして話してると、落ち着く'], ['ずっとここにいたいな']],
    rent: [['…はい、家賃です'], ['はい、今月の家賃。いつもありがとう'], ['はい、家賃。少し話していく？'], ['はい。…家賃の日、好きなんだ']],
    packageReceive: [['…どうも。わざわざすみません'], ['ありがとう、助かった'], ['ありがとう。いつも頼りになるね'], ['ありがとう。…いつもごめんね']],
    packageLate: ['…それ、届いてたんですね。どうも'],
    giftLike: [['…いいんですか？これ、好きなんです'], ['わ、好きなやつ！ありがとう'], ['さすが、わかってるね'], ['もう…太らせる気でしょ。食べるけど']],
    giftNormal: [['…どうも。あとでいただきます'], ['ありがとう、いただくね'], ['ありがとう。一緒に食べよ'], ['くれるものなら、何でもうれしい']],
    giftDislike: ['…ごめんなさい、これはちょっと苦手で'],
    giftDislikeWarm: ['苦手なんだけど…せっかくだから、食べてみる'],
    full: [['…もう結構です'], ['ストップ、もうお腹いっぱい'], ['ちょっと休憩させて…苦しい'], ['今日はもう無理。また明日ね']],
    wary: [['…なんで食べ物ばかりくれるんですか？'], ['最近ちょっと、もらいすぎかも'], ['今日はいいかな'], ['今日はやめとく']],
    refuseVisit: ['（ドア越しに）今日はちょっと…すみません'],
    eatOut: [['…じゃあ、少しだけ'], ['いいね、行こう'], ['デザートも頼んでいい？'], ['一緒に食べると、つい食べすぎちゃう']],
    homeCook: [['…料理、できたんだ。おいしい'], ['おいしい！おかわりある？'], ['これ、毎日食べたい'], ['もう、このごはんじゃないと満足できない']],
    capture: ['…少し、話を聞いてほしいの', '気づいたら、あなたが来るのを毎日待ってた', '…これからも、ずっとそばにいていい？'],
    invite: ['お邪魔します。…ここが〇〇の部屋なんだ', 'おじいさんの写真…優しそうな人だね'],
    night: ['…今夜は、帰りたくないな', '（そっと手を握られた）', '（——部屋の灯りを消した）', '（翌朝）', 'おはよう。…ふふ、なんだか照れるね']
  },

  /* ---- 周りの人からの評判（うわさ）。{who} はヒロインごとの circles から選ばれる。段階の範囲ごと ---- */
  reputation: {
    early: [ // 段階2〜4
      '{who}に「最近、顔色いいね」と言われたらしい', '{who}が「なんか雰囲気がやわらかくなった」と話していたらしい',
      '{who}に「ちゃんと食べてるみたいで安心した」と言われたらしい', '{who}の間で「最近よく笑うようになった」と話題らしい'
    ],
    mid: [ // 段階5〜8（強がり）
      '{who}に「ちょっとふっくらした？」と聞かれて、全力で否定していたらしい', '{who}から「幸せ太り？」とからかわれたらしい',
      '{who}に「服の趣味、変わった？」と聞かれて、言葉に詰まっていたらしい', '{who}の前で「明日からダイエット」と宣言して、その場でおかわりしていたらしい'
    ],
    late: [ // 段階9〜12（恥じらい）
      '{who}の前では、体型を隠すように大きめの服を着ているらしい', '{who}に「だいぶ…」と言いかけられて、真っ赤になっていたらしい',
      '{who}に会わないように、時間をずらして出かけているらしい', '{who}の間で「最近見かけないね」とうわさになっているらしい'
    ],
    final: [ // 段階13〜15（受け入れ）
      '{who}に「前より楽しそう」と言われたらしい', '{who}の間で「すっかり丸くなったけど、笑顔が増えた」と評判らしい',
      '{who}に体型をいじられても、笑って返せるようになったらしい', '{who}から「なんだか頼れる雰囲気になった」と言われたらしい'
    ]
  },
  // うわさの出どころ（ヒロインごと）
  circles: {
    hinata: ['大学のゼミ仲間', 'カフェのバイト仲間', '実家のお母さん'],
    saya: ['会社の同僚', '静岡の妹', '銭湯の常連さん'],
    reina: ['スーパーのパート仲間', '保育園のママ友', '居酒屋の店長'],
    sayuri: ['お弁当屋さんの常連さん', '商店街のおかみさんたち', '娘の同級生のお母さん'],
    akane: ['ジムの会員さん', 'ママさんバレーのチーム', '元チームメイト'],
    kotori: ['メイド喫茶の常連さん', '配信の視聴者', '元アイドル仲間'],
    yukino: ['大学のミスコン実行委員', '家庭教師先の子ども', 'モデル事務所のマネージャー'],
    rio: ['栄養学部の同級生', 'ジムのインストラクター', 'ひなた先輩'],
    rei: ['法律事務所の先輩', '依頼人', '司法修習の同期'],
    shiori: ['花屋の元同僚', '拓海くんとのビデオ通話', 'マンションの奥さんたち'],
    aoi: ['女子大の友達', '英会話教室の生徒さん', '留学先の友達のSNS'],
    mariko: ['お店の常連客', '同僚のホステス', '昔のお客さん'],
    sumire: ['ブランドのスタッフ', '取引先のバイヤー', 'ファッション誌の編集者'],
    mio: ['学生自治会の後輩', '寮の後輩', '神戸の実家'],
    nagisa: ['パティスリーの店長', '保育実習先の先生', '大学の友達'],
    chihaya: ['氏子さんたち', '宮司のお父さん', '参拝客の子どもたち'],
    rin: ['交番の先輩', '近所のおばあちゃん', '署の同期'],
    karen: ['ヨガ教室の生徒さん', 'SNSのフォロワー', '出版社の担当さん'],
    himeka: ['サークルの取り巻き', '読者モデルの仲間', '大学の同級生']
  },

  /* ---- 段階の中での位置の一言（体の様子）。{next} は次の段階の名前 ---- */
  stageProgress: {
    early: '{name}になったばかりだ',
    late:  '少しずつ「{next}」の気配が見えはじめている'
  },

  /* ---- ヒロイン ----
     lines の書き方:
       ・[[よそよそしい], [顔なじみ], [好意], [特別]] … 親密度の段階で出し分け（足りない段階は最後のものを使う）
       ・['…', '…'] … 段階に関係なく使う
       ・〇〇Captured というキーがあれば攻略後はそちらを使う（例: greetCaptured）
       ・stageUp: { 段階番号: { low: 親密度が低いとき, high: 好意（70）以上 or 攻略後 } }
     新しく追加したキー（v0.4）:
       ・greetMorning   朝の掃除中の挨拶（4段階）
       ・packageReceive 預かった荷物を渡したとき（4段階）／packageLate 渡すのが遅れたとき
       ・rent           月末の家賃回収（4段階。[0]は嫌な顔、[1]は雑談まじり）
       ※ 選択肢つきの会話イベントは scenes.js に書く（ここの lines はシーンがないときの予備）
     images: { 段階番号: 'img/ファイル名.png' } … ファイルがなければ仮シルエットを表示
     bodyType: { frame: straight/wave/natural, fat: apple/pear/hidden }
     mods（任意）: { habitDecay: 食習慣の減り方の倍率, stretch: 胃袋の広がり方の倍率 }
     sizes: { bust, under, waist, hip } … 段階1のスリーサイズとアンダーバスト（服のサイズ・節目の計算に使う）
     maxWeight（任意）: このヒロインの体重上限（kg）
     building（任意）: 'apartment'（ひだまり荘、省略時）か 'mansion'（マンション。建つまで登場しない）
       マンションの room は '101'〜'304'。rent（任意）でヒロインごとの家賃を上書き
     startWary（任意）: 警戒の初期値（凛60・香蓮50・姫華40・莉緒70）
     appearIf（任意）: { heroine: 'hinata', minStage: 9 } … 登場条件（莉緒）
     stageUpEffect（任意）: { wary: -15, aff: 2 } … 体型段階が上がったときの変化（莉緒は警戒が下がる）
     twinOf（任意）: 同じ部屋に住む双子の相手（澪・渚）。部屋に入るとき、どちらと話すか選ぶ
     routes（任意）: { fromStage: 13, otaku: { 13: 'img/…' } } … ルートで立ち絵を切り替える（姫華）
     ※ 追加のヒロインは heroines.js に書く
     lines.milestone（任意）: { clothesUp: { narr, low, high }, weight100: {…}, … } 節目イベントの固有セリフ
  */
  heroines: [
    {
      id: 'hinata', room: '102',
      name: '南 ひなた', nameIsTemp: true,
      age: 21, job: '大学3年生',
      height: 157, weight: 49,
      appetite: 1.0,
      color: '#f2a6b8',
      likes: ['sweet', 'snack'], dislikes: ['alcohol'],
      schedule: { weekday: ['夕', '夜'], weekend: ['昼', '夕'] },
      startAffection: 10,
      bodyType: { frame: 'straight', fat: 'hidden' },
      sizes: { bust: 82, under: 67, waist: 57, hip: 85 },   // 段階1のスリーサイズ（Cカップ）
      images: { 1: 'img/hinata_1.png', 2: 'img/hinata_2.png', 3: 'img/hinata_3.png', 4: 'img/hinata_4.png', 5: 'img/hinata_5.png',
                6: 'img/hinata_6.png', 7: 'img/hinata_7.png', 8: 'img/hinata_8.png', 9: 'img/hinata_9.png', 10: 'img/hinata_10.png',
                11: 'img/hinata_11.png', 12: 'img/hinata_12.png', 13: 'img/hinata_13.png', 14: 'img/hinata_14.png', 15: 'img/hinata_15.png' },
      lines: {
        greetMorning: [
          ['あ…おはようございます。お掃除、おつかれさまです', 'おはようございます。…行ってきます'],
          ['おはよー、管理人さん。朝から偉いね', 'あ、管理人さん！今日も掃除？えらいなあ'],
          ['おはよ！見て見て、今日は寝ぐせついてないよ', 'おはよう。管理人さんの顔見ると一日がんばれるんだよね'],
          ['おはよ。…ちょっとだけ、ぎゅってしていい？', 'いってきます。夜、待ってるからね']
        ],
        packageReceive: [
          ['あ、すみません…わざわざありがとうございます', '受け取ってくださったんですか。助かります'],
          ['わ、ありがと！実家からの荷物なんだ', 'ありがとう〜。重かったでしょ？'],
          ['ありがと！お礼に、中身ちょっと分けてあげるね', 'いつも助かってるよ、管理人さん'],
          ['ふふ、管理人さんが受け取ってくれると安心しちゃう']
        ],
        packageLate: ['あ、それ…届いてたんですね。…ありがとうございます'],
        rent: [
          ['あ…家賃ですね。…はい、これ', '（少し困った顔で封筒を差し出す）今月の分です…'],
          ['はい、今月の家賃。いつもありがとね', 'もう月末かあ。早いね。ちょっと上がってく？'],
          ['はい、家賃。…ついでにお茶でも飲んでってよ', '家賃払うの、管理人さんに会える日だから好きなんだ'],
          ['はい、家賃。…ねえ、今日はこのまま泊まってく？']
        ],
        greet: [
          ['あ、管理人さん。こんにちは', 'えっと…何か用ですか？'],
          ['管理人さんだ。どうしたの？', 'おつかれさまー'],
          ['いらっしゃい！ちょうど暇してたとこ', 'あ、来た来た。上がってく？'],
          ['待ってたよ。今日は何持ってきてくれたの？', 'おかえり…って、ここ私の部屋だった']
        ],
        talk: [
          ['このアパート、古いけど静かでいいですよね', '大学、レポートばっかりで大変で…'],
          ['この前の雨、廊下ちょっと漏れてたよ', '駅前に新しいケーキ屋さんできたの知ってる？'],
          ['管理人さんと話してると、なんか落ち着くんだよね', '最近ね、甘いもの我慢するのやめたの'],
          ['ねえ、もうちょっとここにいてよ', '管理人さんが持ってきてくれるもの、全部おいしいんだもん']
        ],
        giftLike: [
          ['え、いいんですか？…これ好きなんです'],
          ['わ、これ好きなやつ！ありがと！'],
          ['さすが、わかってるね〜'],
          ['もう、私のこと太らせる気でしょ。…食べるけどね']
        ],
        giftNormal: [
          ['ありがとうございます。あとでいただきます'],
          ['ありがと、あとで食べるね'],
          ['ありがと。一緒に食べよっか'],
          ['管理人さんがくれるなら何でもうれしいよ']
        ],
        giftDislike: ['あ…ごめん、これはちょっと苦手で'],
        giftDislikeWarm: ['お酒かあ…私すぐ赤くなるんだよね。でも、管理人さんと一緒ならちょっとだけ'],
        full: [
          ['も、もう入らないです…'],
          ['ストップ、もうお腹いっぱい…'],
          ['ちょっと休憩させて…苦しい'],
          ['今日はもう無理〜。明日またちょうだい']
        ],
        wary: [
          ['…なんで食べ物ばかりくれるんですか？'],
          ['最近ちょっと、もらいすぎかも…'],
          ['んー、今日はいいかな'],
          ['今日はちょっとやめとく']
        ],
        refuseVisit: ['（ドア越しに）今日はちょっと…すみません'],
        capture: [
          'ねえ、管理人さん。ちょっと聞いてほしいことがあるの',
          '最初はただの大家さんだと思ってた。でも、気づいたら毎日待ってたんだ',
          '…これからも、ずっとそばにいていい？'
        ],
        greetCaptured: ['おかえり！今日も来てくれたんだ', '待ってたよ。ほら、こっち座って'],
        eatOut: [
          ['…じゃあ、少しだけ'],
          ['ファミレス？いいね、行こ行こ'],
          ['デザートも頼んでいい？'],
          ['管理人さんと食べると、つい食べすぎちゃうんだよね']
        ],
        homeCook: [
          ['管理人さん、料理できたんだ…おいしい'],
          ['え、おいしい！おかわりある？'],
          ['これ毎日食べたいなあ'],
          ['もう管理人さんのごはんじゃないと満足できないよ']
        ],
        stageUp: {
          3: { low: '最近ちょっと顔まるくなったかも…気のせいかな', high: 'なんかね、最近ちょっとふっくらしてきた。…管理人さんのせいだからね' },
          4: { low: 'スカートがきつくて…ダイエットしようかな', high: 'もうぽっちゃりって言われちゃうかな。でも、管理人さんはこっちのほうが好きなんでしょ？' },
          5: { low: '服、ほとんど買い直しになっちゃった…', high: 'このお腹、管理人さんが育てたんだよ。責任とってね' },
          6: { low: '鏡見てびっくりしちゃった…', high: 'ここまで来たら、もう戻れないね。ちゃんと最後まで面倒見てよ' },
          // 7以降は仮。ない段階はタイプ共通の反応を使う
          7: { low: '階段の上り下りがちょっとつらくなってきた…', high: 'まんまるになってきたでしょ。でも嫌じゃないの' },
          9: { low: '椅子がぎしって鳴った…', high: '抱きしめたら、ふかふかだよ？' },
          10: { low: 'さすがに食べすぎかなあ…', high: '管理人さんのごはん、もう生きがいかも' },
          12: { low: '服、ほとんど入らなくなっちゃった', high: 'ここまで大きくなったの、管理人さんのせいなんだからね' },
          14: { low: 'もう、どこまで大きくなるんだろ…', high: 'これが管理人さんの理想？…ふふ、よかった' }
        }
      }
    },
    {
      id: 'saya', room: '201',
      name: '高梨 沙耶', nameIsTemp: true,
      age: 27, job: '会社員（OL）',
      height: 163, weight: 53,
      appetite: 1.1,
      color: '#9fc3e8',
      likes: ['alcohol', 'fried'], dislikes: ['sweet'],
      schedule: { weekday: ['夜'], weekend: ['昼', '夕', '夜'] },
      startAffection: 5,
      bodyType: { frame: 'straight', fat: 'apple' },
      sizes: { bust: 85, under: 67.5, waist: 59, hip: 87 }, // 段階1のスリーサイズ（Dカップ）
      images: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, `img/saya_${i + 1}.png`])),
      lines: {
        greetMorning: [
          ['…おはよう', '（軽く会釈して、足早に駅へ向かっていった）'],
          ['おはよう。朝から精が出るわね', 'おはよ。…今日も残業かな'],
          ['おはよう。あなたの顔見てから出勤するの、悪くないわ', 'おはよ。夜、少し飲まない？'],
          ['おはよう。…ネクタイ、じゃなかった。寝ぐせ、ついてるわよ']
        ],
        packageReceive: [
          ['…どうも。中身、見てないわよね？', 'ああ、預かってくれたの。どうも'],
          ['ありがと。助かったわ、平日は受け取れないから'],
          ['ありがと。お礼に一杯おごるわ'],
          ['ありがと。…あなたがいると、なんでも任せちゃうわね']
        ],
        packageLate: ['…それ、もっと早く渡してほしかったわ'],
        rent: [
          ['…はい、家賃。数えて', '（無言で封筒を突き出す。目は合わせてくれない）'],
          ['はい、今月分。…あなた、ちゃんと食べてる？', 'もう月末？はい、家賃。…ついでに少し話していく？'],
          ['はい、家賃。…ねえ、ビール一本付き合っていきなさいよ', '家賃の日が楽しみなんて、変な話よね'],
          ['はい。…家賃っていうより、生活費かしらね、もう']
        ],
        greet: [
          ['…はい。管理人さん？', 'どうも。何か？'],
          ['ああ、管理人さん。おつかれ'],
          ['ちょうど一杯やろうと思ってたの。付き合う？'],
          ['遅い。待ってたんだから']
        ],
        talk: [
          ['仕事で遅くなることが多いけど、気にしないで'],
          ['上司がね、また無茶言うのよ', '休みの日くらい、何も考えずに飲みたいわ'],
          ['仕事終わりに誰かと話せるの、悪くないわね'],
          ['あなたといると、気が抜けちゃう']
        ],
        giftLike: [
          ['…ありがと。こういうの、嫌いじゃない'],
          ['気が利くじゃない'],
          ['わかってるわね。今夜はこれで飲もう'],
          ['もう、そうやって甘やかすんだから']
        ],
        giftNormal: [
          ['どうも。いただくわ'],
          ['ありがと'],
          ['ありがと、あとで食べる'],
          ['あなたがくれるならね']
        ],
        giftDislike: ['ごめんなさい、甘いのはあまり…'],
        giftDislikeWarm: ['甘いのは苦手なんだけど…あなたが選んだなら、食べてみる'],
        full: [
          ['もう結構よ'],
          ['さすがにもう無理'],
          ['ちょっと…ベルトきつい'],
          ['今日はここまで。また明日ね']
        ],
        wary: [
          ['…何か下心でもあるの？'],
          ['ちょっと最近、多くない？'],
          ['今日は遠慮しとく'],
          ['今日はいいわ']
        ],
        refuseVisit: ['（ドア越しに）悪いけど、今日は疲れてるの'],
        capture: [
          '…ちょっと、座って。話があるの',
          'こんなボロアパート、すぐ出ていくつもりだった。なのに、あなたがいるから出ていけなくなったじゃない',
          '責任、とってくれるわよね？'
        ],
        greetCaptured: ['おかえり。…なによ、ここが私たちの部屋みたいなものでしょ', '遅いわよ。ほら、乾杯しましょ'],
        eatOut: [
          ['…まあ、たまにはいいか'],
          ['居酒屋なら付き合うわ'],
          ['今日は飲むわよ。あなたも食べなさい'],
          ['あなたと食べるごはん、なんでこんなにおいしいのかしら']
        ],
        homeCook: [
          ['…意外。ちゃんとおいしい'],
          ['これ、お酒が進むわね'],
          ['ねえ、明日も作ってくれる？'],
          ['もう外で食べる気がしないわ']
        ],
        stageUp: {
          3: { low: 'スーツのウエスト、ちょっときついのよね', high: 'ちょっと太ったかも。…誰かさんのせいでね' },
          4: { low: 'まずいわね、ジム行かなきゃ', high: 'ジム？…もういいわ。あなたがこのほうがいいって言うなら' },
          5: { low: 'スーツ、全部サイズ上げたわ…', high: 'すっかり丸くなっちゃった。会社で幸せ太りかって言われるのよ' },
          6: { low: '…さすがにこれは、まずくない？', high: 'ここまで来たら開き直るわ。ちゃんと最後まで養ってよね' },
          // 7以降は仮。ない段階はタイプ共通の反応を使う
          7: { low: '会社の制服、特注になったわ…', high: '丸くなったわね、私。…悪くないでしょ？' },
          9: { low: '通勤電車、座るのに気を遣うのよね', high: 'ビールのあとの一品、あなたが作ってくれないと落ち着かないの' },
          10: { low: 'ちょっと動くだけで息が上がるわ', high: 'こんな体にしたんだから、ちゃんと責任とってよね' },
          12: { low: '鏡を見るのが怖いわ…', high: 'もう誰にも見せられないわ。あなた以外にはね' },
          14: { low: '…私、どうしちゃったのかしら', high: 'ここまで来たら、とことん付き合ってもらうわよ' }
        }
      }
    }
  ]
};
