import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TextEditor from '@/components/TextEditor';
import FileUpload from '@/components/FileUpload';
import Footer from '@/components/Footer';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = 'QuickShare - Share Text Instantly';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <TextEditor />
        <FileUpload />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
