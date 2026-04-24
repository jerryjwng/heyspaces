
-- Create public bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'inserate-bilder',
  'inserate-bilder',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
CREATE POLICY "Inserat-Bilder sind öffentlich lesbar"
ON storage.objects FOR SELECT
USING (bucket_id = 'inserate-bilder');

-- Authenticated upload, file path must start with own user id folder
CREATE POLICY "Authentifizierte Nutzer können Inserat-Bilder hochladen"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'inserate-bilder'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Owner update
CREATE POLICY "Nutzer können eigene Inserat-Bilder aktualisieren"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'inserate-bilder'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Owner delete
CREATE POLICY "Nutzer können eigene Inserat-Bilder löschen"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'inserate-bilder'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
