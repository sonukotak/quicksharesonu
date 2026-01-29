import { useState } from 'react';
import { Menu, X, Sun, Moon, Download, LogIn, Sparkles, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginModal from './LoginModal';
import UpgradeModal from './UpgradeModal';
import HowItWorksModal from './HowItWorksModal';
import FeedbackModal from './FeedbackModal';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleDownload = () => {
    const content = `
QuickShare - Text Sharing Made Simple
=====================================

Thank you for downloading QuickShare!

This is a simple text sharing application that allows you to:
- Share text instantly
- Save your notes locally
- Access from any device

Visit us at: quickshare.app

© 2024 QuickShare. Made by Sonu Kotak
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickshare-readme.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { label: 'How it works', icon: HelpCircle, onClick: () => setIsHowItWorksOpen(true) },
    { label: 'Download', icon: Download, onClick: handleDownload },
    { label: 'Upgrade', icon: Sparkles, onClick: () => setIsUpgradeOpen(true) },
    { label: 'Feedback', icon: MessageSquare, onClick: () => setIsFeedbackOpen(true) },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                <span className="text-muted-foreground">Quick</span>
                <span className="text-gradient">Share</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="text-brand hover:text-brand/80 font-medium"
                onClick={() => setIsLoginOpen(true)}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login / Register
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="ml-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="justify-start text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="justify-start text-brand hover:text-brand/80"
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Register
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
