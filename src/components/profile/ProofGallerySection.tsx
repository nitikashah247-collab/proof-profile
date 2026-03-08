import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, ExternalLink, Globe } from "lucide-react";
import { ArtifactLightbox } from "./ArtifactLightbox";

interface ProofItem {
  url: string;
  caption: string;
  fileType: string;
  ogImage?: string;
}

interface ProofGallerySectionProps {
  items: ProofItem[];
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const ProofGallerySection = ({ items }: ProofGallerySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState("");

  if (!items || items.length === 0) return null;

  const isPdf = (fileType: string) => fileType?.toLowerCase() === "pdf";
  const isLink = (fileType: string) => fileType?.toLowerCase() === "link";
  const isImage = (fileType: string) => !isPdf(fileType) && !isLink(fileType);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  };

  const handleClick = (item: ProofItem) => {
    if (isLink(item.fileType) || isPdf(item.fileType)) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    } else {
      setLightboxUrl(item.url);
      setLightboxCaption(item.caption);
    }
  };

  return (
    <>
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease }}
        className="py-12"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-5xl">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">
                Proof & Evidence
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                Work samples and artifacts
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease, delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleClick(item)}
                >
                  {/* Thumbnail area */}
                  <div className="relative aspect-video bg-muted">
                    {isLink(item.fileType) ? (
                      item.ogImage ? (
                        <img
                          src={item.ogImage}
                          alt={item.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <Globe className="w-10 h-10 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getDomain(item.url)}
                          </span>
                        </div>
                      )
                    ) : isImage(item.fileType) ? (
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
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-background/80 text-foreground backdrop-blur-sm border border-border">
                      {isLink(item.fileType) ? getDomain(item.url) : (item.fileType || "IMG")}
                    </span>
                  </div>

                  {/* Caption + link indicator */}
                  <div className="p-3">
                    <p className="text-sm text-foreground line-clamp-2">{item.caption}</p>
                    {(isLink(item.fileType) || isPdf(item.fileType)) && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary mt-1.5">
                        <ExternalLink className="w-3 h-3" />
                        {isLink(item.fileType) ? "Open link" : "Open PDF"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      <ArtifactLightbox
        url={lightboxUrl}
        caption={lightboxCaption}
        onClose={() => setLightboxUrl(null)}
      />
    </>
  );
};
