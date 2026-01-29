import { useState, useEffect } from 'react';
import { FileText, AlignLeft, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function TextEditor() {
  const [text, setText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved text from database on mount
  useEffect(() => {
    const fetchText = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_text')
          .select('content')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching text:', error);
          toast.error('Failed to load saved text');
          return;
        }

        if (data) {
          setText(data.content || '');
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Failed to load saved text');
      } finally {
        setIsLoading(false);
      }
    };

    fetchText();
  }, []);

  const handleSave = async () => {
    if (!text.trim()) return;
    
    setIsSaving(true);
    try {
      // Get the first row's id
      const { data: existing } = await supabase
        .from('shared_text')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        // Update existing row
        const { error } = await supabase
          .from('shared_text')
          .update({ content: text, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new row
        const { error } = await supabase
          .from('shared_text')
          .insert({ content: text });

        if (error) throw error;
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save text');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    try {
      const { data: existing } = await supabase
        .from('shared_text')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('shared_text')
          .update({ content: '', updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      }

      setText('');
      toast.success('Text cleared');
    } catch (err) {
      console.error('Error clearing:', err);
      toast.error('Failed to clear text');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <div className="p-3 rounded-xl bg-brand/10">
            <AlignLeft className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Text</h2>
            <p className="text-sm text-muted-foreground">Shared globally with all users</p>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Type something..."
                className="min-h-[300px] resize-none border-0 bg-transparent text-lg focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer with Save and Clear Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-secondary/30">
          <Button
            onClick={handleClear}
            disabled={!text.trim()}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={handleSave}
            disabled={!text.trim() || isSaving}
            className={`min-w-[140px] transition-all ${
              isSaved
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : 'bg-transparent border border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            variant={isSaved ? 'default' : 'outline'}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Text Saved
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="mt-4 p-4 rounded-xl bg-success/10 border border-success/20 text-center animate-fade-in">
          <p className="text-success font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Your text has been saved globally!
          </p>
        </div>
      )}
    </div>
  );
}
