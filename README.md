# HyperSystem - イベントチェックインシステム

回遊型イベント用のQRチェックインWebシステムです。
会場は3つ（A・B・C）で、来場者がどの会場にいるかを把握し、人の流れを記録・可視化します。

## 機能概要

### 来場者向け機能
- **事前登録**: イベント前にオンラインで登録可能
- QRコードでのチェックイン
- 初回登録（写真・ニックネーム・Instagram ID）
- 事前登録済みユーザーは簡易チェックインフォーム
- 会場間の自動移動記録

### 管理者向け機能
- リアルタイム会場別人数表示
- 来場者一覧管理
- 移動ログの時系列表示
- 写真管理（承認/非承認）
- 分析機能（ピーク時間、移動パターンなど）

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **バックエンド**: Next.js Server Actions
- **データベース**: Supabase (PostgreSQL)
- **画像保存**: Supabase Storage
- **認証**: Supabase Auth（管理者のみ）
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. データベースURLとAPIキーを取得

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. データベースのセットアップ

Supabaseのダッシュボードで、以下のマイグレーションファイルを順番に実行してください：

1. `supabase/migrations/00001_initial_schema.sql` - 初期スキーマ
2. `supabase/migrations/00003_add_ticket_paid.sql` - チケット支払いフラグ
3. `supabase/migrations/00004_add_entrance_venue.sql` - 事前登録用会場の追加

### 5. Storageバケットの作成

Supabaseのダッシュボードで以下のバケットを作成：

1. `user-icons`（公開バケット）
2. `event-photos`（公開バケット）

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで`http://localhost:3000`を開いてください。

## QRコードの生成

各会場用と事前登録用のQRコードを生成してください：

- **事前登録**: `https://your-domain.com/pre-register`
- **HOME PLANET**: `https://your-domain.com/checkin/homeplanet`
- **MOVEMENT**: `https://your-domain.com/checkin/movement`
- **ASTRO**: `https://your-domain.com/checkin/astro`

自動生成スクリプトを使用する場合：

```bash
node scripts/generate-qr-codes.js
```

または、無料のQRコード生成サービスを使用：
- https://www.qr-code-generator.com/
- https://www.the-qrcode-generator.com/

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com/)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

詳細は`docs/DEPLOYMENT.md`を参照してください。

## ディレクトリ構造

```
hyper_system/
├── src/
│   ├── app/              # Next.js App Router ページ
│   ├── actions/          # Server Actions
│   ├── components/       # Reactコンポーネント
│   ├── lib/              # ユーティリティ関数
│   └── types/            # TypeScript型定義
├── supabase/
│   └── migrations/       # データベースマイグレーション
├── docs/                 # ドキュメント
└── public/               # 静的ファイル
```

## ライセンス

MIT License

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

