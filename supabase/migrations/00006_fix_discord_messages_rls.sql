-- discord_messagesテーブルのRLSポリシーを修正

-- 既存のINSERTポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "discord_messages_insert_all" ON discord_messages;
DROP POLICY IF EXISTS "discord_messages_update_all" ON discord_messages;

-- すべてのユーザーがINSERT可能
CREATE POLICY "discord_messages_insert_all" 
ON discord_messages 
FOR INSERT 
WITH CHECK (true);

-- すべてのユーザーがUPDATE可能
CREATE POLICY "discord_messages_update_all" 
ON discord_messages 
FOR UPDATE 
USING (true)
WITH CHECK (true);



