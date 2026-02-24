import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileActionsProps {
  profileUrl: string;
  name: string;
  email?: string;
  calendlyUrl?: string;
}

export const ProfileActions = ({ profileUrl, name, email, calendlyUrl }: ProfileActionsProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };


  const contactEmail = email || "";
  const mailtoGetInTouch = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Inquiry from your Proof profile")}`
    : null;
  const scheduleLink = calendlyUrl || (contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Schedule a call")}`
    : null);

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-8">
            Interested in working together? I'd love to hear from you.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {mailtoGetInTouch && (
              <Button size="lg" className="gap-2" asChild>
                <a href={mailtoGetInTouch}>
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </a>
              </Button>
            )}
            {scheduleLink && (
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href={scheduleLink} target={calendlyUrl ? "_blank" : undefined} rel={calendlyUrl ? "noopener noreferrer" : undefined}>
                  <Calendar className="w-5 h-5" />
                  Schedule a Call
                </a>
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile URL Display */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border"
          >
            <span className="text-sm text-muted-foreground font-mono">
              {profileUrl}
            </span>
            <button
              onClick={handleShare}
              className="p-1 rounded hover:bg-background transition-colors"
            >
              <Copy className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
