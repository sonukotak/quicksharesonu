import { X, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: 'Basic',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '5 shares per day',
      'Basic text formatting',
      '24 hour expiry',
      'Community support',
    ],
    popular: false,
    cta: 'Current Plan',
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For power users',
    features: [
      'Unlimited shares',
      'Rich text formatting',
      'Custom expiry dates',
      'Priority support',
      'API access',
      'No ads',
    ],
    popular: true,
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    description: 'For teams and businesses',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom branding',
      'Analytics dashboard',
      'SSO authentication',
      'Dedicated support',
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  const handleSelect = (planName: string) => {
    toast.success(`${planName} plan selected!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl mx-4 bg-card rounded-2xl shadow-2xl border border-border animate-scale-in">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-brand" />
                Upgrade Your Plan
              </h2>
              <p className="text-muted-foreground mt-1">
                Choose the perfect plan for your needs
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-brand bg-brand/5'
                    : 'border-border hover:border-brand/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-brand-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-brand hover:bg-brand/90 text-brand-foreground'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSelect(plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
