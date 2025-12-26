-- Discordメッセージを保存するテーブル
CREATE TABLE discord_messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  channel_id TEXT NOT NULL
);

-- インデックス作成
CREATE INDEX idx_discord_messages_created_at ON discord_messages(created_at DESC);
CREATE INDEX idx_discord_messages_channel ON discord_messages(channel_id);

-- RLS（Row Level Security）を有効化
ALTER TABLE discord_messages ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが読み取り可能
CREATE POLICY "discord_messages_select_all" ON discord_messages FOR SELECT USING (true);





