// 使い方: node tools/check_scenes.js scenes/akane.js [scenes/xxx.js ...]
// 追加シーンファイル（window.addScenes('<id>', [...], {...})）の形式チェック
const fs = require('fs'), path = require('path');
const TYPES = ['morning', 'package', 'rent', 'rentExtra', 'talk', 'visit', 'intro', 'evening', 'invite', 'night'];
const COND = ['tiers', 'minAff', 'maxAff', 'flag', 'noFlag', 'late', 'weekend', 'slot', 'captured', 'minStage', 'maxStage', 'minMoney', 'chance', 'minHabit'];
const NODE = ['say', 'aff', 'wary', 'building', 'money', 'habit', 'setFlag', 'clearFlag', 'branch', 'choices', 'prompt', 'next'];
const CHOICE = ['text', 'line', 'if', 'aff', 'wary', 'building', 'money', 'habit', 'setFlag', 'clearFlag', 'say', 'next', 'silent'];
let bad = 0;
const err = (f, m) => { bad++; console.log(`NG ${f}: ${m}`); };
for (const f of process.argv.slice(2)) {
  const calls = [];
  global.window = { addScenes: (id, list, extra) => calls.push({ id, list, extra }) };
  try { new Function('window', fs.readFileSync(f, 'utf8'))(global.window); } catch (e) { err(f, '構文エラー ' + e.message); continue; }
  if (!calls.length) { err(f, 'window.addScenes が呼ばれていない'); continue; }
  for (const { id, list, extra } of calls) {
    const ids = new Set(); const counts = {};
    if (!Array.isArray(list)) { err(f, 'シーンが配列でない'); continue; }
    list.forEach(sc => {
      const where = `${f} ${sc.id}`;
      if (!sc.id || ids.has(sc.id)) err(where, 'id が無いか重複'); ids.add(sc.id);
      if (!String(sc.id).startsWith(id + '_')) err(where, `id は「${id}_」で始める`);
      if (!TYPES.includes(sc.type)) err(where, 'type が不正: ' + sc.type);
      counts[sc.type] = (counts[sc.type] || 0) + 1;
      const chkCond = (c, w) => { if (c) Object.keys(c).forEach(k => { if (!COND.includes(k)) err(w, '条件キーが不正: ' + k); }); };
      chkCond(sc.if, where);
      if (!sc.nodes || !sc.nodes.start) { err(where, 'nodes.start がない'); return; }
      const chkSay = (arr, w) => (arr || []).forEach(l => {
        if (typeof l === 'string') return;
        if (!Array.isArray(l) || !['p', 'n', 'h'].includes(l[0]) || typeof l[1] !== 'string') err(w, 'セリフの形が不正: ' + JSON.stringify(l));
      });
      for (const [nid, n] of Object.entries(sc.nodes)) {
        const w = `${where}.${nid}`;
        Object.keys(n).forEach(k => { if (!NODE.includes(k)) err(w, 'ノードのキーが不正: ' + k); });
        chkSay(n.say, w);
        const targets = [n.next, ...(n.branch || []).map(b => b.next), ...(n.choices || []).map(c => c.next)].filter(Boolean);
        targets.forEach(x => { if (!sc.nodes[x]) err(w, '存在しないノードへ: ' + x); });
        (n.branch || []).forEach(b => chkCond(b.if, w));
        (n.choices || []).forEach(c => {
          Object.keys(c).forEach(k => { if (!CHOICE.includes(k)) err(w, '選択肢のキーが不正: ' + k); });
          if (!c.text) err(w, '選択肢に text がない'); chkCond(c.if, w); chkSay(c.say, w);
        });
      }
    });
    if (extra) {
      const su = extra.stageUp || {};
      Object.entries(su).forEach(([k, v]) => { if (!(+k >= 2 && +k <= 15) || typeof v.low !== 'string' || typeof v.high !== 'string') err(f, `stageUp[${k}] は { low, high } の文字列`); });
      if (extra.milestone) Object.entries(extra.milestone).forEach(([k, v]) => { if (typeof v !== 'object') err(f, `milestone.${k} の形が不正`); });
    }
    console.log(`OK? ${f} id=${id} シーン${list.length}（${Object.entries(counts).map(([k, v]) => k + ':' + v).join(' ')}）stageUp ${Object.keys((extra || {}).stageUp || {}).length}件`);
  }
}
console.log(bad ? `エラー ${bad} 件` : 'エラーなし');
process.exit(bad ? 1 : 0);
