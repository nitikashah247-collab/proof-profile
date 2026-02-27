import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Lightbulb, TrendingUp, ExternalLink, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtifactLightbox } from "./ArtifactLightbox";
import { cn } from "@/lib/utils";

interface CaseStudyArtifact { url: string; caption: string; type: string; }
interface CaseStudy {
  title: string; company: string; keyMetric: string; summary: string;
  challenge: string; approach: string; outcome: string; skills: string[];
  artifacts?: CaseStudyArtifact[]; images?: string[];
  testimonial?: { quote: string; author: string; role: string; };
}
interface CaseStudyCardProps { study: CaseStudy; index: number; isHighlighted: boolean; }

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const CaseStudyCard = ({ study, index, isHighlighted }: CaseStudyCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState("");

  const isImageType = (type: string) => {
    const t = type?.toLowerCase() || "";
    return t.startsWith("image") || ["dashboard", "screenshot", "presentation", "png", "jpg", "jpeg"].includes(t);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease, delay: index * 0.1 }}
        className="bg-card border border-border rounded-2xl transition-all hover:shadow-md"
      >
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="font-metrics text-2xl font-bold text-foreground">{study.keyMetric}</span>
            <span className="text-xs font-medium uppercase tracking-wider text-primary/70 bg-primary/10 px-2.5 py-1 rounded-full">{study.company}</span>
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">{study.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{study.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {study.skills.slice(0, 4).map(skill => (
              <span key={skill} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{skill}</span>
            ))}
            {study.skills.length > 4 && <span className="text-xs text-muted-foreground px-2 py-0.5">+{study.skills.length - 4}</span>}
          </div>
          <div className="mt-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            {isExpanded ? "Show less" : "Read more"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Target, label: "Challenge", text: study.challenge },
                    { icon: Lightbulb, label: "Approach", text: study.approach },
                    { icon: TrendingUp, label: "Outcome", text: study.outcome, bold: true },
                  ].map(({ icon: Icon, label, text, bold }) => (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                      </div>
                      <p className={cn("text-sm leading-relaxed", bold ? "text-foreground font-medium" : "text-muted-foreground")}>{text}</p>
                    </div>
                  ))}
                </div>

                {study.artifacts && study.artifacts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Image className="w-4 h-4" /><span className="text-sm font-medium">Evidence</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {study.artifacts.map((artifact, i) => (
                        <div key={i} className="rounded-xl border border-border overflow-hidden bg-muted/30 cursor-pointer hover:border-primary/30 transition-colors"
                          onClick={() => { artifact.type === "pdf" || artifact.type === "document" ? window.open(artifact.url, "_blank") : (setLightboxUrl(artifact.url), setLightboxCaption(artifact.caption)); }}>
                          {isImageType(artifact.type)
                            ? <img src={artifact.url} alt={artifact.caption} className="w-full h-48 object-cover" loading="lazy" />
                            : <div className="flex items-center gap-3 p-4"><FileText className="w-8 h-8 text-muted-foreground" /><span className="text-sm text-foreground hover:underline">{artifact.caption}</span></div>}
                          <p className="text-xs text-muted-foreground p-2">{artifact.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {study.images && study.images.length > 0 && (!study.artifacts || study.artifacts.length === 0) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground"><Image className="w-4 h-4" /><span className="text-sm font-medium">Work Samples</span></div>
                    <div className="grid grid-cols-3 gap-3">
                      {study.images.map((img, i) => (
                        <div key={i} className="aspect-video rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs">Screenshot {i + 1}</div>
                      ))}
                    </div>
                  </div>
                )}

                {study.testimonial && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-sm italic text-foreground/80 mb-3">"{study.testimonial.quote}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{study.testimonial.author.split(" ").map(n => n[0]).join("")}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{study.testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{study.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                  <ExternalLink className="w-4 h-4" />View Full Case Study
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ArtifactLightbox url={lightboxUrl} caption={lightboxCaption} onClose={() => setLightboxUrl(null)} />
    </>
  );
};
