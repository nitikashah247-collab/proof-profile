import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Lightbulb, TrendingUp, ExternalLink, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtifactLightbox } from "./ArtifactLightbox";

interface CaseStudyArtifact {
  url: string;
  caption: string;
  type: string;
}

interface CaseStudy {
  title: string;
  company: string;
  keyMetric: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  skills: string[];
  artifacts?: CaseStudyArtifact[];
  images?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  isHighlighted: boolean;
}

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={`rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
          isHighlighted 
            ? "border-primary shadow-lg shadow-primary/10" 
            : "border-border hover:border-primary/30"
        } ${!isHighlighted && isHighlighted !== undefined ? "opacity-50" : ""}`}
      >
        {/* Collapsed View */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {study.company}
              </span>
              <span className="text-2xl font-bold text-foreground font-metrics">
                {study.keyMetric}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{study.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{study.summary}</p>
            
            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {study.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {study.skills.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs text-muted-foreground">
                  +{study.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
                {/* Challenge, Approach, Outcome Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wide">Challenge</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wide">Approach</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {study.approach}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wide">Outcome</span>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>
                </div>

                {/* Embedded Artifacts */}
                {study.artifacts && study.artifacts.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Image className="w-4 h-4" />
                      <span className="text-sm font-medium">Evidence</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {study.artifacts.map((artifact, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border overflow-hidden bg-muted/30 cursor-pointer hover:border-primary/30 transition-colors"
                          onClick={() => {
                            if (artifact.type === "pdf" || artifact.type === "document") {
                              window.open(artifact.url, "_blank");
                            } else {
                              setLightboxUrl(artifact.url);
                              setLightboxCaption(artifact.caption);
                            }
                          }}
                        >
                          {isImageType(artifact.type) ? (
                            <img
                              src={artifact.url}
                              alt={artifact.caption}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex items-center gap-3 p-4">
                              <FileText className="w-8 h-8 text-muted-foreground" />
                              <span className="text-sm text-foreground hover:underline">
                                {artifact.caption}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground p-2">{artifact.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy Images/Screenshots */}
                {study.images && study.images.length > 0 && (!study.artifacts || study.artifacts.length === 0) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Image className="w-4 h-4" />
                      <span className="text-sm font-medium">Work Samples</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {study.images.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs"
                        >
                          Screenshot {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial Quote */}
                {study.testimonial && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-sm italic text-foreground/80 mb-3">
                      "{study.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {study.testimonial.author.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{study.testimonial.author}</p>
                        <p className="text-xs text-muted-foreground">{study.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Full Case Study Button */}
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Full Case Study
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ArtifactLightbox
        url={lightboxUrl}
        caption={lightboxCaption}
        onClose={() => setLightboxUrl(null)}
      />
    </>
  );
};
