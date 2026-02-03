import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: February 3, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us, as well as data collected automatically through cookies when you visit our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Google AdSense & Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              This website uses Google AdSense to serve ads. Google uses cookies to serve ads based on your prior visits to this or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites. You may opt out of personalized advertising by visiting{" "}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ads Settings
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Third-Party Vendors</h2>
            <p className="text-muted-foreground leading-relaxed">
              Third-party vendors and ad networks may also serve ads on our site. You can visit those websites to opt out of the use of cookies for personalized advertising if the vendor offers this capability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Protection (GDPR)</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you are visiting from the EEA or UK, we request your consent before serving personalized ads. You can manage your choices at any time through the 'Manage Options' button on our consent banner.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
