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
    version: '試作版 v1.8',
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

    // ---- マンション（ヒロインを5人攻略 → 祖父の通帳 → 隣の敷地に建設。建設期間なし） ----
    mansion: {
      name: 'ひだまりレジデンス',   // 仮の名前
      unlockCaptured: 5,          // 攻略人数がこれに届くと、祖父の通帳イベント
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
      { id: 'repair',  name: '外壁と屋根の修繕',             price: 80000, desc: '建物の傷み方が半分になる' }
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
      { id: 'matsuri',    name: '夏祭り',       label: '夏祭りに誘う',       from: '07-27', to: '07-29', slots: ['夕', '夜'],       bg: 'town', kcal: 1400 },
      { id: 'umi',        name: '海',           label: '海に誘う',           from: '08-10', to: '08-16', slots: ['昼'],             bg: 'town', kcal: 1200 },
      { id: 'tsukimi',    name: 'お月見',       label: 'お月見に誘う',       from: '09-15', to: '09-20', slots: ['夜'],             bg: 'apartment', kcal: 800 },
      { id: 'halloween',  name: 'ハロウィン',   label: 'ハロウィンに誘う',   from: '10-31', to: '10-31', slots: ['夕', '夜'],       bg: 'town', kcal: 1000 },
      { id: 'xmas',       name: 'クリスマス',   label: 'クリスマスに誘う',   from: '12-24', to: '12-25', slots: ['夕', '夜'],       bg: 'town', kcal: 1600 },
      { id: 'oomisoka',   name: '大晦日',       label: '年越しそばに誘う',   from: '12-31', to: '12-31', slots: ['夜'],             bg: 'room101', kcal: 900 },
      { id: 'shogatsu',   name: 'お正月',       label: '初詣に誘う',         from: '01-01', to: '01-03', slots: ['朝', '昼', '夕'], bg: 'town', kcal: 1400 },
      { id: 'valentine',  name: 'バレンタイン', label: 'バレンタインに会う', from: '02-14', to: '02-14', slots: ['夕', '夜'],       bg: 'room101', kcal: 900 },
      { id: 'hinamatsuri',name: 'ひな祭り',     label: 'ひな祭りに誘う',     from: '03-03', to: '03-03', slots: ['昼', '夕', '夜'], bg: 'room101', kcal: 900 },
      // キャラ専用の行事（only の住人だけ誘える）
      { id: 'setsubun',     name: '節分',         label: '陽守神社の節分祭へ',   from: '02-03', to: '02-03', slots: ['昼', '夕'],       bg: 'town', kcal: 900,  only: ['chihaya'] },
      { id: 'shichigosan',  name: '七五三',       label: '陽守神社の七五三へ',   from: '11-15', to: '11-15', slots: ['昼', '夕'],       bg: 'town', kcal: 700,  only: ['chihaya'] },
      { id: 'mochitsuki',   name: '餅つき',       label: '陽守神社の餅つきへ',   from: '12-28', to: '12-28', slots: ['昼', '夕'],       bg: 'town', kcal: 1500, only: ['chihaya'] },
      { id: 'kagura_natsu', name: '夏祭りの神楽', label: '千早の神楽を見に行く', from: '07-28', to: '07-28', slots: ['夕', '夜'],       bg: 'town', kcal: 600,  only: ['chihaya'] },
      { id: 'kagura_haru',  name: '初詣の神楽',   label: '千早の神楽を見に行く', from: '01-02', to: '01-02', slots: ['昼', '夕'],       bg: 'town', kcal: 600,  only: ['chihaya'] },
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
    eatTalkChance: 0.35,        // 部屋で「話す」とき、食べる量の区分のセリフ（scenes/eat）になる確率
    eatGiftChance: 0.7,         // 差し入れを受け取ったあと、区分のセリフを足す確率

    tagNames: { sweet: '甘いもの', snack: 'スナック', fried: '揚げ物', meal: 'ごはん', alcohol: 'お酒' },

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
    { id: 'pudding',   name: 'コンビニプリン',   price: 180, kcal: 250,  full: 8,  tags: ['sweet'] },
    { id: 'creampuff', name: 'シュークリーム',   price: 150, kcal: 230,  full: 7,  tags: ['sweet'] },
    { id: 'cake',      name: 'ショートケーキ',   price: 450, kcal: 380,  full: 12, tags: ['sweet'] },
    { id: 'donuts',    name: 'ドーナツ6個入り',  price: 780, kcal: 1400, full: 28, tags: ['sweet'] },
    { id: 'chips',     name: 'ポテトチップス',   price: 160, kcal: 550,  full: 14, tags: ['snack'] },
    { id: 'nikuman',   name: '肉まん',           price: 150, kcal: 250,  full: 10, tags: ['meal'] },
    { id: 'karaage',   name: 'からあげ弁当',     price: 550, kcal: 900,  full: 30, tags: ['fried', 'meal'] },
    { id: 'beerset',   name: 'ビールとつまみ',   price: 600, kcal: 700,  full: 16, tags: ['alcohol', 'fried'], night: 1 },
    // v1.7 追加。night＝深夜に差し入れると、満腹ゲージの上限がこの分だけ広がる（夜食は胃袋を育てる）
    { id: 'cupramen',  name: 'カップラーメン',       price: 220,  kcal: 450,  full: 14, tags: ['meal', 'snack'], night: 1 },
    { id: 'famichiki', name: 'ホットスナックのチキン', price: 230, kcal: 300,  full: 8,  tags: ['fried', 'snack'] },
    { id: 'daifuku',   name: '豆大福',               price: 160,  kcal: 250,  full: 8,  tags: ['sweet'] },
    { id: 'potatol',   name: 'フライドポテトL',      price: 400,  kcal: 520,  full: 14, tags: ['fried', 'snack'], night: 1 },
    { id: 'pan5',      name: '菓子パン5個',          price: 650,  kcal: 1600, full: 30, tags: ['sweet'] },
    { id: 'katsudon',  name: 'カツ丼',               price: 700,  kcal: 1100, full: 32, tags: ['fried', 'meal'], night: 1 },
    { id: 'gyudon',    name: '特盛り牛丼',           price: 900,  kcal: 1300, full: 36, tags: ['meal'], night: 2 },
    { id: 'burger',    name: '特大ハンバーガーセット', price: 1100, kcal: 1500, full: 38, tags: ['fried', 'meal'], night: 2 },
    { id: 'icefamily', name: 'アイスのファミリーパック', price: 900, kcal: 1400, full: 26, tags: ['sweet'], night: 1 },
    { id: 'ramenbig',  name: '背脂ラーメン（持ち帰り）', price: 1200, kcal: 1700, full: 42, tags: ['meal'], night: 3 },
    { id: 'sake',      name: '日本酒の一升瓶とおでん', price: 2400, kcal: 1900, full: 30, tags: ['alcohol'], night: 1 },
    { id: 'bucketpud', name: 'バケツプリン',         price: 1600, kcal: 2400, full: 40, tags: ['sweet'], night: 2 },
    { id: 'pizzal',    name: 'ピザLサイズ',          price: 2800, kcal: 2700, full: 55, tags: ['fried', 'meal'], night: 3 },
    { id: 'wholecheese', name: 'チーズケーキ1ホール', price: 2200, kcal: 3000, full: 50, tags: ['sweet'], night: 2 },
    { id: 'friedbucket', name: 'フライドチキンのバケツ', price: 3200, kcal: 3600, full: 65, tags: ['fried', 'meal'], night: 3 }
  ],

  // 外食に誘う：店を選ぶ（v1.7）。bg は背景（famires / teishoku / izakaya）。likeTag が好物なら親密度+2
  restaurants: [
    { id: 'teishoku', name: '定食屋',           price: 1000,  kcal: 1000, full: 34, affection: 5,  habit: 0.03, slots: ['昼', '夕', '夜'], bg: 'teishoku', likeTag: 'meal' },
    { id: 'famires',  name: 'ファミレス',       price: 1600,  kcal: 1200, full: 38, affection: 5,  habit: 0.03, slots: ['昼', '夕', '夜'], bg: 'famires',  likeTag: 'sweet' },
    { id: 'jiro',     name: '二郎系ラーメン',   price: 1200,  kcal: 1900, full: 58, affection: 4,  habit: 0.04, slots: ['昼', '夕', '夜'], bg: 'teishoku', likeTag: 'meal' },
    { id: 'sushi',    name: '回転寿司',         price: 2500,  kcal: 1300, full: 44, affection: 6,  habit: 0.03, slots: ['昼', '夕', '夜'], bg: 'teishoku', likeTag: 'meal' },
    { id: 'izakaya',  name: '居酒屋',           price: 3500,  kcal: 1600, full: 46, affection: 6,  habit: 0.03, slots: ['夕', '夜'],       bg: 'izakaya',  likeTag: 'alcohol' },
    { id: 'cakebuf',  name: 'ケーキバイキング', price: 3200,  kcal: 2300, full: 52, affection: 6,  habit: 0.05, slots: ['昼', '夕'],       bg: 'famires',  likeTag: 'sweet' },
    { id: 'yakiniku', name: '焼肉食べ放題',     price: 4500,  kcal: 2600, full: 66, affection: 7,  habit: 0.05, slots: ['夕', '夜'],       bg: 'izakaya',  likeTag: 'fried' },
    { id: 'french',   name: 'フレンチのコース', price: 12000, kcal: 1500, full: 40, affection: 10, habit: 0.02, slots: ['夜'],             bg: 'teishoku', likeTag: 'sweet' }
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
  commonLines: {
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
