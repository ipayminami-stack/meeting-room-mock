# 若手エンジニア向け：環境構築・リポジトリ構成ガイド

このドキュメントでは、本プロジェクト（会議室予約システムモック）の開発環境構築手順と、リポジトリの構成ルールについて解説します。
**なぜこの構成にするのか？** という背景も併せて記載していますので、学習の参考にしてください。

---

## 1. 開発環境のセットアップ (Setup)

### 前提条件
- **Node.js**: v18以上 (LTS推奨)
- **Git**: インストール済みであること
- **VS Code**: 推奨エディタ

### 手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd pj_coe_coraboy_anti_prom
   ```

2. **依存パッケージのインストール**
   ```bash
   npm install
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   コマンド実行後、ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスし、画面が表示されれば成功です。

---

## 2. ディレクトリ構成と役割 (Directory Structure)

本プロジェクトでは **Next.js (App Router)** を採用しています。
機能ごとに整理された構成にすることで、コードの迷子を防ぎます。

```text
/
├── .vscode/               # エディタ設定 (共有設定)
├── docs/                  # ドキュメント類 (設計書、マニュアル)
├── public/                # 静的ファイル (画像、フォントなど)
├── src/
│   ├── app/               # ルーティングとページ定義
│   │   ├── layout.tsx     # 全ページ共通のレイアウト (ヘッダーなど)
│   │   ├── page.tsx       # トップページ (今回はログイン画面想定)
│   │   ├── dashboard/     # ダッシュボード機能
│   │   └── ...
│   │
│   ├── components/        # Reactコンポーネント
│   │   ├── ui/            # 汎用パーツ (ボタン、入力欄、カードなど)
│   │   │                    → ロジックを持たない、見た目担当
│   │   ├── features/      # 機能単位のパーツ (予約フォーム、承認リストなど)
│   │   │                    → データ操作などのロジックを含むこともある
│   │   └── layout/        # レイアウト用パーツ (サイドバー、ヘッダー)
│   │
│   ├── lib/               # ユーティリティ、ヘルパー関数、モックデータ
│   ├── types/             # TypeScriptの型定義
│   └── styles/            # グローバルスタイル (Tailwind設定含む)
│
├── .eslintrc.json         # リント設定 (コードの品質チェック)
├── .prettierrc            # フォーマット設定 (コードの整形)
├── next.config.js         # Next.jsの設定
├── package.json           # プロジェクト設定・依存関係
├── tailwind.config.ts     # Tailwind CSSのデザイン設定
└── tsconfig.json          # TypeScriptの設定
```

### ポイント
*   **srcディレクトリ**: ソースコードをルートから分離し、設定ファイルと混ざらないようにしています。
*   **components/ui**: 「Atomic Design」の考え方を取り入れ、小さく再利用可能な部品をここに置きます（例: `Button.tsx`, `Card.tsx`）。これらはアプリ内のどこでも使えます。
*   **components/features**: 特定の機能（ユースケース）に特化した大きな部品です（例: `BookingForm.tsx`）。

---

## 3. 名前付けのルール (Naming Conventions)

コードの読みやすさを保つため、以下のルールを守りましょう。

| 対象 | ルール | 例 | 備考 |
| :--- | :--- | :--- | :--- |
| **フォルダ名** | ケバブケース (kebab-case) | `user-profile`, `booking-list` | URLの一部になるため小文字推奨 |
| **コンポーネントファイル** | パスカルケース (PascalCase) | `Button.tsx`, `Header.tsx` | Reactコンポーネントは大文字開始 |
| **関数・変数** | キャメルケース (camelCase) | `handleClick`, `userData` | JS/TSの標準 |
| **型 (Type/Interface)** | パスカルケース | `User`, `BookingRequest` | クラス名などと同じ扱い |
| **定数** | アッパースネーク (UPPER_SNAKE) | `MAX_USERS`, `API_URL` | 固定値であることを強調 |

---

## 4. 推奨ツール (Recommended Tools)

VS Codeには以下の拡張機能を入れることを強く推奨します。

1.  **ESLint**: コードの潜在的なエラーをリアルタイムで警告します。
2.  **Prettier**: 保存時にコードを自動整形します（誰が書いても同じ見た目になります）。
3.  **Tailwind CSS IntelliSense**: Tailwindのクラス名を補完してくれます。
4.  **Japanese Language Pack**: VS Codeを日本語化する場合に。

---

## 5. 技術スタック (Tech Stack)

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Library**: Radix UI (Headless) + Lucide React (Icons) ※必要に応じて導入

---

このガイドに従って開発を進めることで、チーム全体で統一感のあるコードを維持できます。

---

## 6. Web公開（デプロイ）について

作成したアプリをWeb上で公開する手順は、別紙 [Web公開（デプロイ）ガイド](./deployment_guide.md) を参照してください。

