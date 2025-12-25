-- 事前登録用の「entrance」会場を追加
-- この会場は、事前登録したユーザーの初回チェックイン用

INSERT INTO venues (id, name) VALUES
  ('entrance', 'ENTRANCE');

-- RLSポリシーは既存のものが適用される

