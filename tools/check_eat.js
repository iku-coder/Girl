// 使い方: node tools/check_eat.js scenes/eat/*.js
const fs = require('fs'); let bad = 0; const err = (f, m) => { bad++; console.log('NG ' + f + ': ' + m); };
const LV = 6, NEED = { talk: 2, gift: 3, full: 2 };
for (const f of process.argv.slice(2)) {
  const got = {}; const window = { addEatLines: (id, o) => { got[id] = o; } };
  try { new Function('window', fs.readFileSync(f, 'utf8'))(window); } catch (e) { err(f, '構文エラー ' + e.message); continue; }
  const ids = Object.keys(got); if (ids.length !== 1) { err(f, 'addEatLines は1回だけ'); continue; }
  const o = got[ids[0]];
  for (const k of Object.keys(NEED)) {
    if (!Array.isArray(o[k]) || o[k].length !== LV) { err(f, `${k} は${LV}区分の配列`); continue; }
    o[k].forEach((lv, i) => {
      if (!Array.isArray(lv) || lv.length < NEED[k]) err(f, `${k}[${i}] は${NEED[k]}個以上`);
      (lv || []).forEach(x => {
        const arr = [].concat(x);
        if (k === 'talk' && !Array.isArray(x)) err(f, `talk[${i}] の各要素はセリフの配列`);
        if (arr.some(s => typeof s !== 'string' || !s.trim())) err(f, `${k}[${i}] に文字列でない要素`);
      });
    });
  }
  console.log(`OK? ${f} id=${ids[0]}`);
}
console.log(bad ? `エラー ${bad} 件` : 'エラーなし'); process.exit(bad ? 1 : 0);
