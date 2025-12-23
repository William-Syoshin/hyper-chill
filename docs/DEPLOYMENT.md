# デプロイガイド

HyperSystemをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント
- Supabaseプロジェクトのセットアップ完了

## ステップ1: GitHubリポジトリの準備

### 1.1 リポジトリの作成

1. GitHubで新しいリポジトリを作成
2. ローカルリポジトリをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repository-url>
git push -u origin main
```

### 1.2 .gitignoreの確認

`.gitignore`に以下が含まれていることを確認：

```
node_modules
.next
.env*.local
.vercel
```

**重要**: `.env.local`をコミットしないでください。

## ステップ2: Vercelへのデプロイ

### 2.1 Vercelプロジェクトの作成

1. https://vercel.com/ にログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. 「Import」をクリック

### 2.2 環境変数の設定

「Environment Variables」セクションで以下を追加：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意**: 
- すべての環境（Production, Preview, Development）にチェックを入れる
- `SUPABASE_SERVICE_ROLE_KEY`は外部に公開しない

### 2.3 デプロイ実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待つ（約2〜3分）
3. デプロイが成功したら、URLが表示される

## ステップ3: カスタムドメインの設定（オプション）

### 3.1 ドメインの追加

1. Vercelプロジェクトの「Settings」→「Domains」に移動
2. 「Add」ボタンをクリック
3. カスタムドメインを入力
4. DNSレコードを設定

### 3.2 DNSレコードの設定

ドメインレジストラで以下のレコードを追加：

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

または

```
Type: A
Name: @
Value: 76.76.21.21
```

## ステップ4: デプロイ後の確認

### 4.1 基本動作の確認

1. デプロイされたURLにアクセス
2. トップページが表示されることを確認
3. `/checkin/A`、`/checkin/B`、`/checkin/C`が動作することを確認
4. 管理画面 `/admin` が表示されることを確認

### 4.2 チェックイン機能のテスト

1. 実際にQRコードを生成（デプロイ先のURLを使用）
2. スマートフォンでQRコードをスキャン
3. 登録からチェックインまでの一連の流れをテスト

### 4.3 管理画面のテスト

1. ダッシュボードで人数が正しく表示されるか確認
2. リアルタイム更新が動作するか確認
3. 来場者一覧、ログ、写真管理が動作するか確認

## ステップ5: 継続的デプロイの設定

Vercelは自動的にGitHubと連携されています：

- `main`ブランチにプッシュ → 本番環境にデプロイ
- その他のブランチにプッシュ → プレビュー環境にデプロイ

## パフォーマンス最適化

### 5.1 画像最適化

Next.jsの`Image`コンポーネントを使用しているため、
自動的に画像が最適化されます。

### 5.2 キャッシュ設定

管理画面では`export const dynamic = 'force-dynamic'`を使用して、
リアルタイムデータを取得しています。

### 5.3 エッジファンクション

Vercelは自動的にエッジファンクションを使用して、
世界中で高速なレスポンスを提供します。

## トラブルシューティング

### ビルドエラー

```
Error: Module not found
```

**解決方法**: 
- `package.json`に必要なパッケージがすべて含まれているか確認
- ローカルで`npm install`を実行
- `npm run build`でビルドが成功するか確認

### 環境変数エラー

```
Error: Invalid Supabase URL
```

**解決方法**:
- Vercelの「Settings」→「Environment Variables」で環境変数が正しく設定されているか確認
- 環境変数の値にスペースや改行が含まれていないか確認
- デプロイを再実行（Deployments → ... → Redeploy）

### Supabase接続エラー

```
Error: Failed to fetch
```

**解決方法**:
- SupabaseプロジェクトのURLが正しいか確認
- Supabaseプロジェクトが一時停止していないか確認
- ネットワーク接続を確認

### 画像アップロードエラー

```
Error: Storage bucket not accessible
```

**解決方法**:
- Supabaseのストレージバケットが公開設定になっているか確認
- CORS設定を確認

## セキュリティチェックリスト

- [ ] `.env.local`がGitにコミットされていない
- [ ] `SUPABASE_SERVICE_ROLE_KEY`が環境変数にのみ保存されている
- [ ] Supabaseのデータベースポリシー（RLS）が有効になっている
- [ ] 本番環境のURLでHTTPSが有効になっている

## モニタリング

### Vercel Analytics

1. Vercelプロジェクトの「Analytics」タブで利用状況を確認
2. ページビュー、パフォーマンス指標などを確認

### Supabase Dashboard

1. Supabaseダッシュボードで以下を確認：
   - データベースの使用量
   - ストレージの使用量
   - API呼び出し数

## スケーリング

### Vercelの無料プラン制限

- 帯域幅: 100GB/月
- ビルド時間: 6,000分/月
- エッジファンクション実行: 100GB-時間/月

制限を超える場合は、Proプランへのアップグレードを検討してください。

### Supabaseの無料プラン制限

- データベース容量: 500MB
- ストレージ: 1GB
- API呼び出し: 無制限

大規模イベントの場合は、Proプランへのアップグレードを検討してください。

## バックアップ

### データベースバックアップ

Supabaseダッシュボードから：

1. 「Database」→「Backups」に移動
2. 「Create backup」をクリック
3. バックアップをダウンロード

### ストレージバックアップ

定期的に写真をローカルにダウンロードしてバックアップしてください。

## 次のステップ

- [QRコードの生成](./QR_CODES.md)
- イベント当日の運用マニュアル作成
- 来場者向けの案内資料作成

