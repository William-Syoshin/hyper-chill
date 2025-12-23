-- Storage Policies for user-icons bucket
-- user-icons バケットへのアップロードを許可
CREATE POLICY "Allow anon upload to user-icons"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'user-icons');

-- user-icons バケットの閲覧を許可
CREATE POLICY "Allow public read from user-icons"
ON storage.objects FOR SELECT
TO anon, authenticated, public
USING (bucket_id = 'user-icons');

-- Storage Policies for event-photos bucket
-- event-photos バケットへのアップロードを許可
CREATE POLICY "Allow anon upload to event-photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'event-photos');

-- event-photos バケットの閲覧を許可
CREATE POLICY "Allow public read from event-photos"
ON storage.objects FOR SELECT
TO anon, authenticated, public
USING (bucket_id = 'event-photos');

