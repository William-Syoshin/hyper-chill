-- Seed data for development and testing

-- Venues are already inserted in the migration file
-- This file can be used to add additional test data if needed

-- Example: Insert test users (uncomment if needed for development)
/*
INSERT INTO users (nickname, instagram_id, icon_image_url) VALUES
  ('テスト太郎', 'test_taro', 'https://via.placeholder.com/150'),
  ('テスト花子', 'test_hanako', 'https://via.placeholder.com/150'),
  ('サンプルユーザー', NULL, 'https://via.placeholder.com/150');

-- Example: Insert test visit logs (uncomment if needed for development)
INSERT INTO visit_logs (user_id, venue_id, created_at) VALUES
  ((SELECT id FROM users WHERE nickname = 'テスト太郎'), 'A', NOW() - INTERVAL '2 hours'),
  ((SELECT id FROM users WHERE nickname = 'テスト太郎'), 'B', NOW() - INTERVAL '1 hour'),
  ((SELECT id FROM users WHERE nickname = 'テスト花子'), 'B', NOW() - INTERVAL '1.5 hours'),
  ((SELECT id FROM users WHERE nickname = 'サンプルユーザー'), 'C', NOW() - INTERVAL '30 minutes');
*/

-- Note: In production, delete all test data before the event

