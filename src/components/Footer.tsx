import { Heart, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} QuickShare.com
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made by{' '}
            <span className="text-brand font-medium">Sonu Kotak</span>
            {' '}with{' '}
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="#"
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-brand transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
