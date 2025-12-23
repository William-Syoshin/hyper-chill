# アーキテクチャドキュメント

HyperSystemの技術的なアーキテクチャを詳細に説明します。

## システム概要

```
┌─────────────────────────────────────────────────────────┐
│                    来場者（モバイル）                      │
│              QRコードをスキャンしてチェックイン              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Edge Network)                │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)              │  │
│  │                                                   │  │
│  │  ┌─────────────────┐    ┌────────────────────┐   │  │
│  │  │  Pages (SSR)    │    │  Server Actions    │   │  │
│  │  │  - /checkin/[A] │───▶│  - checkIn()       │   │  │
│  │  │  - /register/[A]│    │  - registerUser()  │   │  │
│  │  │  - /admin/*     │    │  - getVenueCounts()│   │  │
│  │  └─────────────────┘    └────────────────────┘   │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │          Client Components                  │ │  │
│  │  │  - RegisterForm (画像アップロード)           │ │  │
│  │  │  - RealtimeCounter (リアルタイム更新)        │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ REST API / WebSocket
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase Platform                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │         PostgreSQL Database (RLS有効)            │   │
│  │  - users (来場者情報)                             │   │
│  │  - venues (会場A/B/C)                            │   │
│  │  - visit_logs (チェックインログ)                  │   │
│  │  - photos (投稿写真)                              │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Storage (Public Buckets)            │   │
│  │  - user-icons/ (アイコン画像)                     │   │
│  │  - event-photos/ (イベント写真)                   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Auth (管理者認証・将来実装)             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## データフロー

### チェックインフロー

```
1. ユーザーがQRコードをスキャン
   ↓
2. /checkin/A にアクセス
   ↓
3. Server ActionでcheckIn()を実行
   ↓
4. Cookieをチェック
   ├─ Cookie無し → /register/A へリダイレクト
   │                ↓
   │              登録フォーム表示
   │                ↓
   │              画像をSupabase Storageにアップロード
   │                ↓
   │              usersテーブルに新規作成
   │                ↓
   │              visit_logsに記録
   │                ↓
   │              Cookieにuser_idを保存
   │                ↓
   │              /success へリダイレクト
   │
   └─ Cookie有り → 最新のvisit_logsをチェック
                    ├─ 同じ会場 → /success へ（記録なし）
                    └─ 異なる会場 → visit_logsに新規記録
                                    ↓
                                  /success へリダイレクト
```

### リアルタイム更新フロー（管理画面）

```
1. 管理画面 /admin にアクセス
   ↓
2. RealtimeCounterコンポーネントがマウント
   ↓
3. 初期データを表示（SSRで取得）
   ↓
4. useEffect でsetIntervalを設定（7秒間隔）
   ↓
5. Server Action getVenueCounts() を呼び出し
   ↓
6. 最新データを取得して状態を更新
   ↓
7. コンポーネントが再レンダリング
   ↓
8. 4に戻る（アンマウントまで継続）
```

## 技術スタック詳細

### フロントエンド

**Next.js 15 (App Router)**
- React Server Components (RSC) を活用
- Server Actionsでバックエンド処理
- Dynamic Rendering for Admin Pages

**React 19**
- Hooks (useState, useEffect) を使用
- Client Componentsで動的UI

**Tailwind CSS**
- ユーティリティファーストCSS
- レスポンシブデザイン
- カスタムカラーとスタイル

### バックエンド

**Next.js Server Actions**
- サーバーサイド処理を関数として実装
- `'use server'` ディレクティブ
- 型安全なRPC

**Supabase Client Libraries**
- `@supabase/ssr` - SSR対応
- `@supabase/supabase-js` - クライアント

### データベース

**PostgreSQL (Supabase)**
- テーブル設計
  - users: 来場者マスタ
  - venues: 会場マスタ（A/B/C固定）
  - visit_logs: チェックインログ（時系列）
  - photos: 投稿写真
- インデックス最適化
- RLS (Row Level Security) で権限管理

### ストレージ

**Supabase Storage**
- Public Buckets
- CDN配信
- 画像の自動最適化

### Cookie管理

**js-cookie**
- クライアント側でCookie操作
- user_id を保存（UUID）
- SameSite=Lax, HttpOnly=false

## セキュリティ

### 認証・認可

- **来場者**: 認証不要（Cookie識別のみ）
- **管理者**: 現在は認証なし（将来的にSupabase Authで実装予定）

### RLS (Row Level Security)

```sql
-- 匿名ユーザーも読み書き可能（来場者用）
CREATE POLICY "users_insert_anon" ON users 
  FOR INSERT WITH CHECK (true);

-- サービスロールはすべての操作が可能（管理者用）
```

### 環境変数

- `NEXT_PUBLIC_SUPABASE_URL`: 公開OK
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 公開OK（RLSで保護）
- `SUPABASE_SERVICE_ROLE_KEY`: **秘密鍵**（サーバーのみ）

### CORS

- Next.js/Vercelが自動で処理
- Supabaseも同一ドメインからのアクセスを許可

## パフォーマンス

### 最適化手法

1. **Static Generation**
   - トップページ、登録ページはビルド時に生成
   - `generateStaticParams` でA/B/C の3パターンを事前生成

2. **Server-Side Rendering**
   - 管理画面は常に最新データを取得
   - `export const dynamic = 'force-dynamic'`

3. **画像最適化**
   - Next.js Image コンポーネント使用
   - 自動でWebP変換、サイズ最適化

4. **データベースクエリ最適化**
   - インデックスを適切に設定
   - 必要な列のみSELECT
   - LIMIT/OFFSET でページネーション

5. **キャッシュ戦略**
   - CDNキャッシュ（Vercel Edge Network）
   - revalidatePath でキャッシュ無効化

### スケーラビリティ

**想定規模**
- 来場者: 100〜300名
- 同時アクセス: 50名程度
- チェックイン: 300〜900回
- 写真: 100枚程度

**無料プランの制限**
- Vercel: 100GB帯域/月
- Supabase: 500MB DB, 1GB Storage

**スケールアップ時**
- Vercel Pro: 1TB帯域/月
- Supabase Pro: より高いパフォーマンス

## データモデル

### ER図

```
users (来場者)
├─ id (UUID, PK)
├─ nickname (VARCHAR)
├─ instagram_id (VARCHAR, NULL)
├─ icon_image_url (TEXT)
└─ created_at (TIMESTAMPTZ)
   │
   ├─── visit_logs (チェックインログ)
   │    ├─ id (BIGSERIAL, PK)
   │    ├─ user_id (UUID, FK)
   │    ├─ venue_id (VARCHAR, FK)
   │    └─ created_at (TIMESTAMPTZ)
   │
   └─── photos (投稿写真)
        ├─ id (BIGSERIAL, PK)
        ├─ user_id (UUID, FK)
        ├─ image_url (TEXT)
        ├─ approved (BOOLEAN)
        └─ created_at (TIMESTAMPTZ)

venues (会場)
├─ id (VARCHAR, PK)
├─ name (VARCHAR)
└─ created_at (TIMESTAMPTZ)
   │
   └─── visit_logs
        └─ venue_id (VARCHAR, FK)
```

### クエリ例

**現在地の取得**
```sql
SELECT venue_id 
FROM visit_logs 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT 1;
```

**会場別人数カウント**
```sql
SELECT 
  v.id,
  v.name,
  COUNT(DISTINCT latest.user_id) as current_count
FROM venues v
LEFT JOIN LATERAL (
  SELECT DISTINCT ON (user_id) user_id, venue_id
  FROM visit_logs
  ORDER BY user_id, created_at DESC
) latest ON latest.venue_id = v.id
GROUP BY v.id, v.name;
```

## デプロイメント

### CI/CD

```
GitHub Push (main)
  ↓
Vercel自動デプロイ
  ↓
ビルド実行
  ↓
型チェック
  ↓
ESLint
  ↓
本番デプロイ
  ↓
Edge Networkに配信
```

### 環境

- **Development**: ローカル環境 (localhost:3000)
- **Preview**: プルリクエストごとにプレビューURL生成
- **Production**: 本番環境 (your-domain.vercel.app)

## 監視とロギング

### Vercel Analytics

- ページビュー
- Core Web Vitals
- エラー率

### Supabase Dashboard

- データベース使用量
- API呼び出し数
- ストレージ使用量

### エラーハンドリング

- try-catch でエラーをキャッチ
- console.error でログ出力
- ユーザーにフレンドリーなエラーメッセージ

## 今後の拡張性

### 実装予定の機能

1. **管理者認証**
   - Supabase Auth でメールログイン
   - middleware.ts で `/admin` を保護

2. **写真複数投稿**
   - 1人あたり複数枚の写真投稿を許可
   - ギャラリー機能

3. **CSVエクスポート**
   - 来場者データのエクスポート
   - ログデータのエクスポート

4. **リアルタイムアップデート**
   - Supabase Realtime を使用
   - WebSocketで即時更新

5. **オフライン対応**
   - Service Worker
   - IndexedDB でローカルキャッシュ

### アーキテクチャの柔軟性

- Server Actionsの代わりにRoute Handlersも使用可能
- Supabaseの代わりに他のPostgreSQLも使用可能
- Vercelの代わりに他のホスティングも可能

## まとめ

HyperSystemは、モダンなWeb技術スタックを使用した、
シンプルでスケーラブルなイベント管理システムです。

**主な特徴:**
- 🚀 高速なSSR/SSG
- 🔄 リアルタイム更新
- 📱 モバイルフレンドリー
- 🔒 セキュアなRLS
- 💰 コスト効率的（無料プランで運用可能）

