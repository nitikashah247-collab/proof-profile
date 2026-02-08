import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Proof</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground text-sm">Last updated: 8 February 2026</p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By creating an account or using Proof (showproof.app), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Proof is an AI-powered platform that helps professionals create dynamic career profiles. The service includes resume parsing, AI-assisted interviews, profile generation, and hosting of public profile pages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating your account. You may not use another person's account without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Content Ownership</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain full ownership of all content you upload or create on Proof, including resume data, interview responses, and profile content. By publishing a profile, you grant Proof a licence to display that content publicly at your chosen URL.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to use Proof to create profiles containing false or misleading professional information, impersonate another person, upload malicious content, or violate any applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Pro Subscriptions</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pro features are available via paid subscription. Subscriptions are billed monthly or annually. You may cancel at any time, and access will continue until the end of your billing period. Refunds are provided at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, your data will be deleted in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Proof is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these terms from time to time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms, contact us at:
              </p>
              <p className="text-foreground font-medium mt-2">
                legal@showproof.app
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;
