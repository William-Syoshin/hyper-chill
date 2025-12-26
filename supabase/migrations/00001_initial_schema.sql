-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- venues テーブル（会場）
CREATE TABLE venues (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ挿入
INSERT INTO venues (id, name) VALUES
  ('homeplanet', 'EOS BASEMENT'),
  ('movement', 'MOVEMENT'),
  ('astro', 'ASTRO');

-- users テーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(20) NOT NULL,
  instagram_id VARCHAR(30),
  icon_image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- visit_logs テーブル（来場ログ）
CREATE TABLE visit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id VARCHAR(20) NOT NULL REFERENCES venues(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- photos テーブル
CREATE TABLE photos (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_visit_logs_user_id ON visit_logs(user_id);
CREATE INDEX idx_visit_logs_venue_id ON visit_logs(venue_id);
CREATE INDEX idx_visit_logs_created_at ON visit_logs(created_at DESC);
CREATE INDEX idx_visit_logs_user_created ON visit_logs(user_id, created_at DESC);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_approved ON photos(approved);

-- RLS (Row Level Security) ポリシー設定
-- 注：管理者はサービスロールキーを使用するため、RLSをバイパスできる

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーも読み取り可能（来場者用）
CREATE POLICY "venues_select_all" ON venues FOR SELECT USING (true);
CREATE POLICY "users_insert_anon" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_select_own" ON users FOR SELECT USING (true);
CREATE POLICY "visit_logs_insert_anon" ON visit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "visit_logs_select_own" ON visit_logs FOR SELECT USING (true);
CREATE POLICY "photos_insert_anon" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "photos_select_all" ON photos FOR SELECT USING (true);

-- コメント追加
COMMENT ON TABLE venues IS '会場情報（EOS BASEMENT/MOVEMENT/ASTRO）';
COMMENT ON TABLE users IS '来場者情報';
COMMENT ON TABLE visit_logs IS '来場ログ（チェックイン履歴）';
COMMENT ON TABLE photos IS '投稿写真';
COMMENT ON COLUMN visit_logs.created_at IS '最新のレコードがユーザーの現在地を示す';
COMMENT ON COLUMN photos.approved IS '管理者による使用承認フラグ';

