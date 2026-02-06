import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import QuickAdd from '@/components/QuickAdd';
import TextEditor from '@/components/TextEditor';
import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useTheme } from '@/hooks/useTheme';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    document.title = 'QuickShare - Share Text Instantly';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {showNotice && (
        <div className="container mx-auto px-4 pt-6">
          <Alert className="relative border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30 text-foreground">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="pr-8 text-sm leading-relaxed">
              <strong>⚠️ Notice:</strong> Please do not share any secret, personal, or inappropriate messages or files on this platform. This application is for demonstration and learning purposes only. Use it responsibly.
            </AlertDescription>
            <button
              onClick={() => setShowNotice(false)}
              className="absolute right-3 top-3 rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity text-foreground"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 space-y-8">
        <ScrollReveal animation="fade-up">
          <QuickAdd />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={100}>
          <TextEditor />
        </ScrollReveal>
        
        <ScrollReveal animation="scale" delay={200}>
          <FileUpload />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
