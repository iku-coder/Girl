// 公開版（Claude のアーティファクト）用：scenes/ 以下のシーンファイルを1つにまとめる
// 使い方: node tools/build_bundle.js  → scenes_bundle.js と index_pub.html を作る
// （アーティファクトは1版あたりのファイル数に上限があるため。開発・GitHub では個別ファイルのまま）
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const re = /<script src="(scenes\/[^"]+)"><\/script>\n?/g;
const srcs = []; let m; while ((m = re.exec(html))) srcs.push(m[1]);
const parts = srcs.map(s => `/* ==== ${s} ==== */\n;${fs.readFileSync(path.join(root, s), 'utf8')}\n`);
fs.writeFileSync(path.join(root, 'scenes_bundle.js'), parts.join('\n'));
let first = true;
const pub = html.replace(re, () => { if (first) { first = false; return '<script src="scenes_bundle.js"></script>\n'; } return ''; });
fs.writeFileSync(path.join(root, 'index_pub.html'), pub);
console.log(`bundled ${srcs.length} files → scenes_bundle.js (${Math.round(fs.statSync(path.join(root, 'scenes_bundle.js')).size / 1024)}KB)`);
