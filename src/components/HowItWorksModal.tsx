import { X, Edit3, Save, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Edit3,
    title: 'Type Your Text',
    description: 'Simply start typing in the text area. No signup required for basic sharing.',
  },
  {
    icon: Save,
    title: 'Save Your Content',
    description: 'Click the Save button to store your text. It gets saved instantly.',
  },
  {
    icon: Share2,
    title: 'Share Anywhere',
    description: 'Copy the link and share it with anyone. They can view your text instantly.',
  },
  {
    icon: CheckCircle,
    title: 'Access Anytime',
    description: 'Your saved texts are accessible from any device, anywhere in the world.',
  },
];

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl border border-border animate-scale-in">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">How QuickShare Works</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    <span className="text-brand mr-2">{index + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              className="bg-brand hover:bg-brand/90 text-brand-foreground"
              onClick={onClose}
            >
              Got it, let's start!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
