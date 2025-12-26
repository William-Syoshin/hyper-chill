# 事前登録機能

## 概要

イベント前にオンラインで事前登録できる機能を実装しました。事前登録済みユーザーは、当日会場でQRコードをスキャンするだけで簡単にチェックインできます。

## 仕様

### ユーザーフロー

#### 1. 事前登録なし（従来の動作）
```
会場でQRコードスキャン
  ↓
登録フォーム表示（写真・ニックネーム・Instagram ID）
  ↓
登録完了してチェックイン
```

#### 2. 事前登録あり（新機能）
```
【事前】
事前登録QRコードスキャン（または /pre-register にアクセス）
  ↓
登録フォーム表示（写真・ニックネーム・Instagram ID）
  ↓
事前登録完了

【当日】
会場でQRコードスキャン
  ↓
簡易チェックインフォーム表示（ボタンを押すだけ）
  ↓
チェックイン完了
```

### データベース

#### 新しい会場: `entrance`

事前登録を表す特別な会場IDとして `entrance` を追加しました。

```sql
INSERT INTO venues (id, name) VALUES ('entrance', 'ENTRANCE');
```

ユーザーの最初の `visit_log` が `entrance` の場合、そのユーザーは事前登録済みと判定されます。

### ページとルーティング

#### 新規ページ

- `/pre-register` - 事前登録ページ
  - 事前登録用のQRコードのリンク先
  - RegisterForm を使用して登録
  - venue_id として 'entrance' を使用

#### 変更されたページ

- `/register/[venue]` - 会場登録/チェックインページ
  - ユーザーの状態をチェック：
    - 事前登録済み → SimpleCheckinForm を表示
    - 未登録または非事前登録 → RegisterForm を表示

- `/success` - 成功ページ
  - venue_id が 'entrance' の場合、事前登録完了メッセージを表示
  - 会場チェックインの場合、従来のメッセージを表示

- `/` - ホームページ
  - 事前登録へのリンクを追加

### コンポーネント

#### 新規コンポーネント

- `SimpleCheckinForm` - 簡易チェックインフォーム
  - 事前登録済みユーザー用
  - ユーザー情報を表示
  - ボタン一つでチェックイン

### アクション

#### 新規アクション

- `simpleCheckin` - 簡易チェックイン処理
  - 事前登録済みユーザーのチェックイン
  - visit_log に記録

#### 変更されたアクション

- `registerUser` - validateAllVenueId を使用するように変更
  - 'entrance' も受け付けるように

### 定数とバリデーション

#### 新しい定数

```typescript
export const ENTRANCE_VENUE_ID = 'entrance' as const;
export const ALL_VENUE_IDS = [...VENUE_IDS, ENTRANCE_VENUE_ID] as const;
export type AllVenueId = typeof ALL_VENUE_IDS[number];
```

#### 新しいバリデーション関数

```typescript
export function validateAllVenueId(venueId: string): venueId is AllVenueId {
  return ALL_VENUE_IDS.includes(venueId as AllVenueId)
}
```

### 管理者機能

- 会場別人数カウントから 'entrance' を除外
- 'entrance' にいるユーザーは「事前登録済み・未入場」として扱われる

## QRコード

事前登録用のQRコードを生成してください：

```
https://your-domain.com/pre-register
```

自動生成スクリプトも更新されています：

```bash
node scripts/generate-qr-codes.js
```

## マイグレーション

データベースに新しい会場を追加するマイグレーション：

```sql
-- supabase/migrations/00004_add_entrance_venue.sql
INSERT INTO venues (id, name) VALUES ('entrance', 'ENTRANCE');
```

Supabaseダッシュボードで実行するか、Supabase CLIを使用してください。

## 今後の拡張案

- 事前登録済みユーザーの一覧表示
- 事前登録率の統計
- 事前登録時の詳細情報収集（アレルギー、参加希望時間など）
- 事前登録完了メールの送信





