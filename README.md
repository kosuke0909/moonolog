This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# 🌕 Moonolog - 英語独り言習慣化アプリ

Moonolog（ムーノログ）は、英語学習者が「毎晩、英語を声に出す」習慣を気軽に始められる、シンプルなWebアプリです。  
寝る前にスマホを開いて、月に向かって独り言をつぶやくだけ。  
**話すこと・続けること**に特化した体験を提供します。

---

## ✨ 特徴（MVP）

- 🧠 **習慣化**に特化：開いたらすぐ話せる最短導線
- 🌙 **月が反応**するアニメーション（Rive連携）
- 💬 **毎日1トピック**＋例文3つの超シンプル設計
- 🎤 **録音フロー**：マイクボタンを押して喋るだけ
- 🔁 **継続記録**：連続日数をローカルに保存

---

## 📱 使い方

### 基本操作
1. **🌙 月をタップ** → 音声認識 + 音声録音が開始
2. **英語で話す** → フレーズを参考に独り言
3. **もう一度月をタップ** → 録音停止
4. **▶️ 再生ボタン** → 録音した音声を確認（フレーズ下の横スクロール）

### 録音管理
- **最大5個まで**の録音を自動保存
- **横スクロール**で過去の録音を確認
- **✕ボタン**で個別の録音を削除
- **ページリロード後**も録音データは保持

### キーボードショートカット
| ショートカット | 機能 | 説明 |
|---|---|---|
| **Ctrl + Shift + D** | デバッグモード切り替え | 開発者向けの詳細情報を表示/非表示 |

> **デバッグモード**: 音声認識の状態、エラー情報、transcriptなどの技術的な詳細を確認できます。右上に🐛アイコンが表示されます。

---

## 🛠 技術スタック

| 技術 | 用途 |
|------|------|
| [Next.js 14](https://nextjs.org/) | アプリケーションフレームワーク（App Router） |
| TypeScript | 型安全な開発 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 状態管理（録音状態・習慣記録など） |
| [Rive](https://rive.app/) | 月のアニメーション |
| Tailwind CSS | スタイリング（UIデザイン） |
| Web Speech API | 録音／音声入力（将来的には拡張予定） |

---

## 📐 設計思想

### 1. 開いたらすぐ話せるUX
- 起動 → トピックが表示 → マイクタップ → 話す
- 1分以内に完了できる体験で習慣化を促進

### 2. アニメーションによる報酬感
- 喋ると月が光る・微笑むなどの反応
- 自分の声が「世界に届く」ような感覚設計

### 3. トピックと例文の最小セット
- 毎日切り替わるお題（例: "My dream job"）
- 使える表現を3つ表示（例: "If I could...", "I wish I..."）

---

## 📁 ディレクトリ構成（概要）

> ※詳細な構造は `/docs/structure.yaml` に記載予定

- `app/` - ルーティングとページ設計（App Router）
- `components/` - Moon, MicButton, TopicCardなどの再利用UI
- `store/` - Zustandによる状態管理（isListening, streakなど）
- `lib/` - 音声認識・トピック管理ロジック
- `public/` - 静的ファイル（Rive, JSONなど）

---

## 💡 今後の構想（非MVP）

- 🔊 発音フィードバック（AIによるスコアリング）
- 🔒 ユーザーアカウントとクラウド同期
- 🌍 トピックカテゴリの選択（旅行・ビジネスなど）
- 🪙 課金要素（テーマスキン / プレミアムお題パック）
- 🏅 バッジ・進化する月などのゲーミフィケーション

---

## 💸 マネタイズ案（初期段階）

1. **プレミアムプラン（月額）**
   - 高度なお題セット／発音チェック機能の提供
2. **スキン課金**
   - 月の見た目を変えるコレクション要素
3. **スポンサーお題提供**
   - 英会話系YouTuberやブランドとのコラボ

---

## 🧪 開発ステータス

- ✅ MVP機能の設計完了
- ✅ ディレクトリ構造テンプレート定義済み
- 🚧 UI・Rive連携中
- 🔜 Firebase or ローカルDB連携検討中

---

## 🧑‍💻 開発者

**Hosuke**  
趣味で英語学習を続ける学生エンジニア。夜の英語習慣のハードルを下げたくて開発中。  
Twitter: [@yourhandle](https://twitter.com/)（仮）  
GitHub: [github.com/yourname](https://github.com/)

---

## 🌓 ライセンス

MIT License  
Moonolog is open-source and free to use.  
（将来的には一部有償機能の検討あり）

