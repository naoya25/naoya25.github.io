// ここだけ編集すれば OK。他のファイルは触らなくてよい。
window.PORTFOLIO_CONFIG = {
  // GitHub のユーザー名。プロフィール・アイコン・リポジトリはここから自動取得される
  username: "naoya25",

  // 外部リンク
  qiita: "https://qiita.com/Naoya_pro",

  // Products カードの上部ビジュアル: "gradient"(言語色のグラデ) or "og"(GitHub の OG 画像)
  coverStyle: "gradient",

  // GitHub の bio が空のときに表示される一文
  fallbackBio:
    "ソフトウェアエンジニア。「あったらいいな」を手を動かして形にしています。",

  // 大きく見せたい作品。GitHub 側の description があればそれを優先し、
  // 無ければここの desc を表示する。順番どおりに並ぶ。
  // デモリンクは demo → リポの homepage → GitHub Pages(有効時) の順で自動判定
  featured: [
    {
      repo: "sudocube",
      title: "Sudocube",
      desc: "数独を、立方体の6面に。各面が 9×9 の数独として成立しつつ、隣り合う面が辺で数字を共有するブラウザパズル。",
    },
    {
      repo: "trapop",
      title: "TraPoP",
      desc: "貼り付けた瞬間に翻訳する macOS アプリ。日本語⇔英語の双方向。",
    },
    {
      repo: "earthquake-checker",
      title: "日本中の耐震検査",
      desc: "建物の位置・地盤・固有周期から、過去の地震への推定応答加速度と震度を一覧表示。",
    },
    {
      repo: "snap-ocr",
      title: "snap-ocr",
      desc: "メニューバー常駐。範囲選択したスクリーンショットを OCR して、そのままクリップボードへ。",
    },
    {
      repo: "shogi-mods",
      title: "Shogi MODs",
      desc: "将棋に「ルール MOD」を着せ替えるサンドボックス。第一弾は挟んだ駒が裏返る「オセロ将棋」。",
    },
  ],

  // Skills: 言語はリポジトリから自動集計されるので書かなくてよい。
  // ここにはフレームワーク・ツールなど言語以外を書く
  tools: [
    "React / Next.js",
    "Flutter",
    "Tauri",
    "Cloudflare Workers",
    "GitHub Actions",
  ],

  // 経歴(古い順)。公開サイトに載る内容なので文面はよく確認すること
  career: [
    {
      period: "2002.11",
      title: "誕生",
    },
    {
      period: "2021.04",
      title: "長崎大学 工学部 入学",
    },
    {
      period: "2026.03",
      title: "長崎大学 工学部 卒業",
    },
    {
      period: "2026.04",
      title: "株式会社ジーニー 入社",
      detail: "ソフトウェアエンジニア",
    },
  ],

  // 「すべてのリポジトリ」から隠したいもの(プロフィール用リポなど)
  hidden: ["naoya25", "naoya25.github.io", ".github"],

  // 「すべてのリポジトリ」の最大表示件数
  maxRepos: 12,
};
