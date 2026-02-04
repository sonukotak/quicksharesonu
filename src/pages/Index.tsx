import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QuickAdd from '@/components/QuickAdd';
import TextEditor from '@/components/TextEditor';
import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = 'QuickShare - Share Text Instantly';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
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
