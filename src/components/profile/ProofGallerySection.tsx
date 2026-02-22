import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

export const ProofGallerySection = ({ items }: ProofGallerySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState("");

  if (!items || items.length === 0) return null;

  const isPdf = (fileType: string) => fileType?.toLowerCase() === "pdf";
  const isImage = (fileType: string) => !isPdf(fileType);

  return (
    <>
      <section ref={ref} className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-5xl"
          >
            <h2 className="text-3xl font-bold mb-2">Proof & Evidence</h2>
            <p className="text-muted-foreground mb-8">
              Work samples and artifacts that demonstrate results
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-xl border border-border bg-card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => {
                    if (isPdf(item.fileType)) {
                      window.open(item.url, "_blank");
                    } else {
                      setLightboxUrl(item.url);
                      setLightboxCaption(item.caption);
                    }
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted">
                    {isImage(item.fileType) ? (
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <FileText className="w-10 h-10 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">PDF Document</span>
                      </div>
                    )}
                    {/* File type badge */}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-background/80 text-foreground backdrop-blur-sm border border-border">
                      {item.fileType || "IMG"}
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="p-3">
                    <p className="text-sm text-foreground line-clamp-2">{item.caption}</p>
                    {isPdf(item.fileType) && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
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
