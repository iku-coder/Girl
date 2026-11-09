# scenes/mood・scenes/tower・scenes/hero/aoi_v411.js の script タグを index.html に足す（何度実行してもよい）
import os, re
p = 'index.html'; s = open(p).read()
anchor = '<script src="scenes/v26/himeka.js"></script>'
files = []
for d in ['scenes/tower', 'scenes/mood']:
    if os.path.isdir(d): files += [f'{d}/{f}' for f in sorted(os.listdir(d)) if f.endswith('.js')]
if os.path.exists('scenes/hero/aoi_v411.js'): files.append('scenes/hero/aoi_v411.js')
add = [f for f in files if f'src="{f}"' not in s]
if add:
    i = s.index(anchor) + len(anchor)
    s = s[:i] + ''.join(f'\n<script src="{f}"></script>' for f in add) + s[i:]
    open(p, 'w').write(s)
print('added', len(add), add)
