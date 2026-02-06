import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: "screenshot" | "pdf" | "link";
  url?: string;
}

interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

export const PortfolioGallery = ({ items }: PortfolioGalleryProps) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-2">Work Samples</h2>
          <p className="text-muted-foreground mb-8">
            Screenshots, documents, and live work examples
          </p>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-video rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/20">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left">
                    <p className="text-white text-sm font-medium mb-1">{item.title}</p>
                    <p className="text-white/70 text-xs line-clamp-1">{item.description}</p>
                  </div>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-foreground" />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded text-[10px] font-medium uppercase bg-background/90 text-foreground">
                    {item.type}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="aspect-video bg-muted">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <span className="text-8xl font-bold text-primary/20">
                      {selectedItem.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                
                {selectedItem.url && (
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
