import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";
import { ArtifactLightbox } from "./ArtifactLightbox";

interface ProofItem {
  url: string;
  caption: string;
  fileType: string;
}

interface ProofGallerySectionProps {
  items: ProofItem[];
}

const EASE = [0.22, 1, 0.36, 1];

export const ProofGallerySection = ({ items }: ProofGallerySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState("");

  if (!items || items.length === 0) return null;

  const isPdf = (fileType: string) => fileType?.toLowerCase() === "pdf";
  const isImage = (fileType: string) => !isPdf(fileType);

  return (
    <>
      <section ref={ref} className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE as any }}
            className="max-w-5xl"
          >
            <p className="section-overline mb-2">Portfolio</p>
            <h2 className="section-heading text-4xl mb-3 text-foreground">Proof & Evidence</h2>
            <p className="text-muted-foreground mb-10">
              Work samples and artifacts that demonstrate results
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE as any }}
                  className="rounded-2xl border border-border/50 bg-card overflow-hidden group cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  onClick={() => {
                    if (isPdf(item.fileType)) {
                      window.open(item.url, "_blank");
                    } else {
                      setLightboxUrl(item.url);
                      setLightboxCaption(item.caption);
                    }
                  }}
                >
                  <div className="relative aspect-video bg-muted">
                    {isImage(item.fileType) ? (
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <FileText className="w-10 h-10 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">PDF Document</span>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-background/80 text-foreground backdrop-blur-sm border border-border/50">
                      {item.fileType || "IMG"}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground line-clamp-2">{item.caption}</p>
                    {isPdf(item.fileType) && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary mt-1.5">
                        <ExternalLink className="w-3 h-3" />
                        Open PDF
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <ArtifactLightbox
        url={lightboxUrl}
        caption={lightboxCaption}
        onClose={() => setLightboxUrl(null)}
      />
    </>
  );
};
