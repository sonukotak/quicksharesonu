import { useState, useEffect } from 'react';
import { FileText, AlignLeft, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const STORAGE_KEY = 'quickshare-text';

export default function TextEditor() {
  const [text, setText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Restore saved text on mount
  useEffect(() => {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText) {
      setText(savedText);
    }
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    
    localStorage.setItem(STORAGE_KEY, text);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClear = () => {
    setText('');
    localStorage.removeItem(STORAGE_KEY);
  };

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
            disabled={!text.trim()}
            className={`min-w-[140px] transition-all ${
              isSaved
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : 'bg-transparent border border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
            variant={isSaved ? 'default' : 'outline'}
          >
            {isSaved ? (
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
            Your text has been saved successfully!
          </p>
        </div>
      )}
    </div>
  );
}
