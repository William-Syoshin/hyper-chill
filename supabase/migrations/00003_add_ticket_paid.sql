-- usersテーブルにチケット支払い状態を追加
ALTER TABLE users ADD COLUMN ticket_paid BOOLEAN DEFAULT FALSE;

-- ticket_paidカラムにコメントを追加
COMMENT ON COLUMN users.ticket_paid IS 'チケット料金支払い済みフラグ';

