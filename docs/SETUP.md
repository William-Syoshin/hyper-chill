# セットアップガイド

このドキュメントでは、HyperSystemの詳細なセットアップ手順を説明します。

## 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- Vercelアカウント（デプロイ用）

## ステップ1: プロジェクトのクローン

```bash
git clone <repository-url>
cd hyper_system
```

## ステップ2: 依存パッケージのインストール

```bash
npm install
```

## ステップ3: Supabaseプロジェクトのセットアップ

### 3.1 プロジェクトの作成

1. https://supabase.com/ にアクセス
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワード、リージョンを設定
4. プロジェクトが作成されるまで待つ（約2分）

### 3.2 APIキーの取得

1. プロジェクトダッシュボードで「Settings」→「API」に移動
2. 以下の値をコピー：
   - `Project URL`
   - `anon public` key
   - `service_role` key（Show をクリックして表示）

### 3.3 データベーステーブルの作成

1. ダッシュボードで「SQL Editor」に移動
2. 「New query」をクリック
3. `supabase/migrations/00001_initial_schema.sql`の内容を貼り付け
4. 「Run」をクリックして実行

### 3.4 Storageバケットの作成

#### user-icons バケット

1. ダッシュボードで「Storage」に移動
2. 「Create a new bucket」をクリック
3. 名前: `user-icons`
4. Public bucket: **ON**
5. 「Create bucket」をクリック

#### event-photos バケット

1. 「Create a new bucket」をクリック
2. 名前: `event-photos`
3. Public bucket: **ON**
4. 「Create bucket」をクリック

### 3.5 RLS（Row Level Security）の確認

スキーマ作成時に自動的にRLSポリシーが設定されていますが、
確認する場合は「Authentication」→「Policies」で各テーブルのポリシーを確認してください。

## ステップ4: 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**: `SUPABASE_SERVICE_ROLE_KEY`は外部に公開しないでください。

## ステップ5: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## ステップ6: 動作確認

### 6.1 チェックイン機能のテスト

1. http://localhost:3000/checkin/A にアクセス
2. 登録フォームが表示されることを確認
3. 写真、ニックネームを入力して送信
4. チェックイン完了画面が表示されることを確認

### 6.2 管理画面のテスト

1. http://localhost:3000/admin にアクセス
2. ダッシュボードが表示されることを確認
3. 来場者一覧、ログ、写真管理などの各ページが動作することを確認

## トラブルシューティング

### データベース接続エラー

```
Error: Invalid Supabase URL
```

**解決方法**: `.env.local`のURLが正しいか確認してください。

### 画像アップロードエラー

```
Error: Storage bucket not found
```

**解決方法**: Supabaseダッシュボードで`user-icons`と`event-photos`バケットが作成されているか確認してください。

### Cookieが保存されない

**解決方法**: ブラウザのCookie設定を確認してください。プライベートブラウジングモードではCookieが保存されない場合があります。

## 次のステップ

- [QRコードの生成](./QR_CODES.md)
- [Vercelへのデプロイ](./DEPLOYMENT.md)

