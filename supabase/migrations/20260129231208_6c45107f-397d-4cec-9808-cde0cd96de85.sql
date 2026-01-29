-- Create a table for shared global text
CREATE TABLE public.shared_text (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shared_text ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the shared text
CREATE POLICY "Anyone can view shared text" 
ON public.shared_text 
FOR SELECT 
USING (true);

-- Allow anyone to update the shared text
CREATE POLICY "Anyone can update shared text" 
ON public.shared_text 
FOR UPDATE 
USING (true);

-- Allow anyone to insert shared text
CREATE POLICY "Anyone can insert shared text" 
ON public.shared_text 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to delete shared text
CREATE POLICY "Anyone can delete shared text" 
ON public.shared_text 
FOR DELETE 
USING (true);

-- Insert an initial empty row
INSERT INTO public.shared_text (content) VALUES ('');