-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('shared-files', 'shared-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the storage bucket
CREATE POLICY "Anyone can view shared files"
ON storage.objects FOR SELECT
USING (bucket_id = 'shared-files');

CREATE POLICY "Anyone can upload shared files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'shared-files');

CREATE POLICY "Anyone can delete shared files"
ON storage.objects FOR DELETE
USING (bucket_id = 'shared-files');

-- Create table to track uploaded files metadata
CREATE TABLE public.shared_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;

-- Create open policies for shared files table
CREATE POLICY "Anyone can view shared files metadata"
ON public.shared_files FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert shared files metadata"
ON public.shared_files FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete shared files metadata"
ON public.shared_files FOR DELETE
USING (true);