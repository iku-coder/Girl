# 公開版の立ち絵の置き方（v2.8.1）
- 公開版（claude.ai のアーティファクト）は、1つの版に入れられるファイルが511まで。いまはほぼ上限なので、**新しい立ち絵は「素材置き場」（assets）に入れる**
- 手順：1) GitHub の img/*.png を img/*.webp（半分の大きさ・quality 80）にする 2) Artifact の publish（url・asset: true・file_paths で25枚ずつ）で素材置き場に上げる 3) 返ってきた url（/_blob/<id>）を tools/img_assets.json に足し、img_assets.js を作り直す 4) img_assets.js を files に入れて公開
- ゲームは imageOf／imageAt で、パス（img/x.webp）が window.IMG_ASSET にあればその url を使う。ローカル版・GitHub版は img_assets.js が空でも動く
