import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const QuickAdd: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be under 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File): Promise<void> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${timestamp}_${safeName}`;

    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/shared-files/${filePath}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'x-upsert': 'false',
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    // Save metadata to database
    const { error: dbError } = await supabase
      .from('shared_files')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
      });

    if (dbError) throw dbError;
  };

  const saveText = async (content: string): Promise<void> => {
    const { data: existing } = await supabase
      .from('shared_text')
      .select('id, content')
      .limit(1)
      .maybeSingle();

    if (existing) {
      const newContent = existing.content ? `${existing.content}\n${content}` : content;
      const { error } = await supabase
        .from('shared_text')
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('shared_text')
        .insert({ content });
      if (error) throw error;
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedFile) return;

    setIsSubmitting(true);
    try {
      const promises: Promise<void>[] = [];

      if (text.trim()) {
        promises.push(saveText(text.trim()));
      }

      if (selectedFile) {
        promises.push(uploadFile(selectedFile));
      }

      await Promise.all(promises);

      const messages: string[] = [];
      if (text.trim()) messages.push('Text saved');
      if (selectedFile) messages.push('File uploaded');
      
      toast.success(messages.join(' & '));
      
      setText('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Trigger a page refresh to show updated content
      window.location.reload();
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to add content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up">
        <div className="p-4">
          {/* Selected file preview */}
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-sm">
              <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate flex-1">{selectedFile.name}</span>
              <span className="text-muted-foreground text-xs flex-shrink-0">
                {formatFileSize(selectedFile.size)}
              </span>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Type something to share..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-14 text-base px-4"
              disabled={isSubmitting}
            />

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="h-12 w-12 flex-shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={(!text.trim() && !selectedFile) || isSubmitting}
              className="h-12 px-6 flex-shrink-0"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;
