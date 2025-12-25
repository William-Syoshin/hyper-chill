# Discord連携セットアップガイド

このガイドでは、DiscordのメッセージをWebサイトに表示する機能のセットアップ方法を説明します。

## 📋 必要なもの

1. Discord サーバーの管理者権限
2. Discord Bot の作成
3. Bot Token
4. チャンネルID: `1451123539662077984`

## 🚀 セットアップ手順

### Step 1: Discord Botを作成

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力（例: "HYPER CHILL Bot"）
4. 左側メニューから「Bot」を選択
5. 「Add Bot」をクリック
6. 「Reset Token」をクリックしてBot Tokenを取得（後で使用）

### Step 2: Bot権限を設定

「Bot」セクションで以下の権限を有効にする：

**Privileged Gateway Intents:**
- ✅ Message Content Intent

**Bot Permissions:**
- ✅ Read Messages/View Channels
- ✅ Read Message History

### Step 3: Botをサーバーに追加

1. 左側メニューから「OAuth2」→「URL Generator」を選択
2. **Scopes**で以下を選択：
   - ✅ `bot`
3. **Bot Permissions**で以下を選択：
   - ✅ Read Messages/View Channels
   - ✅ Read Message History
4. 生成されたURLをコピーしてブラウザで開く
5. Discordサーバーを選択してBotを追加

### Step 4: 環境変数を設定

プロジェクトの `.env.local` ファイルに以下を追加：

```bash
# Discord Bot Token
DISCORD_BOT_TOKEN=your_bot_token_here
```

**⚠️ 重要:** Bot Tokenは絶対に公開しないでください！

### Step 5: データベースマイグレーションを実行

Supabaseダッシュボードで以下のSQLを実行：

```sql
-- supabase/migrations/00005_add_discord_messages.sql の内容を実行
CREATE TABLE discord_messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  channel_id TEXT NOT NULL
);

CREATE INDEX idx_discord_messages_created_at ON discord_messages(created_at DESC);
CREATE INDEX idx_discord_messages_channel ON discord_messages(channel_id);

ALTER TABLE discord_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "discord_messages_select_all" ON discord_messages FOR SELECT USING (true);
```

### Step 6: デプロイ

Vercelに環境変数を追加：

1. Vercelダッシュボードでプロジェクトを開く
2. Settings → Environment Variables
3. `DISCORD_BOT_TOKEN` を追加
4. Redeploy

## 🔄 動作確認

1. Discordのチャンネル（`1451123539662077984`）にメッセージを投稿
2. Webサイトの成功ページにアクセス
3. 15秒以内にメッセージが表示される

## 📊 機能

### 自動同期
- 15秒ごとにDiscord APIからメッセージを取得
- 最新5件のメッセージを表示
- ユーザーアバター、名前、投稿時刻を表示

### 表示内容
```
┌─────────────────────────────┐
│ 💬 リアルタイムで来場者の   │
│        会話をチェックしよう  │
│ AIが来場者の会話を要約して...│
├─────────────────────────────┤
│ [ユーザー名] 12:34          │
│ メッセージ内容...           │
│                             │
│ [ユーザー名] 12:35          │
│ メッセージ内容...           │
├─────────────────────────────┤
│    [Discordに参加] ボタン   │
└─────────────────────────────┘
```

## ⚙️ カスタマイズ

### メッセージの表示件数を変更

`src/components/DiscordFeed.tsx` の `getLatestDiscordMessages(5)` の数字を変更：

```typescript
const data = await getLatestDiscordMessages(10) // 10件表示
```

### 更新間隔を変更

`src/components/DiscordFeed.tsx` の `15000` を変更：

```typescript
const interval = setInterval(fetchMessages, 30000) // 30秒ごと
```

## 🐛 トラブルシューティング

### メッセージが表示されない

1. Bot TokenがVercelの環境変数に設定されているか確認
2. BotがDiscordサーバーに追加されているか確認
3. Botがチャンネルにアクセスできるか確認（権限）
4. ブラウザのコンソールでエラーを確認

### Bot Tokenエラー

エラーメッセージ: `DISCORD_BOT_TOKEN is not set`

**解決策:**
1. `.env.local` にBot Tokenを追加
2. 開発サーバーを再起動
3. Vercelの環境変数を確認してRedeploy

### 403 Forbidden エラー

**原因:** Botに権限がない

**解決策:**
1. Discord Developer Portalで「Message Content Intent」を有効化
2. Botをサーバーから削除して再度追加
3. チャンネルの権限でBotに「メッセージ履歴を読む」権限を付与

## 📝 API仕様

### Discord API エンドポイント

```
GET https://discord.com/api/v10/channels/{channel_id}/messages
Authorization: Bot {token}
```

### Webhook エンドポイント（オプション）

```
POST /api/discord-webhook
```

リアルタイム更新が必要な場合、Discordのwebhookをこのエンドポイントに設定できます。

## 🔒 セキュリティ

- Bot Tokenは環境変数に保存
- データベースにはRLSを設定
- メッセージは公開チャンネルのみ表示
- Botメッセージは自動的にフィルター

## 📚 参考リンク

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Discord.js Guide](https://discordjs.guide/)

