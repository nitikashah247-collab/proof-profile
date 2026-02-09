import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

interface PortfolioPiece {
  imageUrl: string;
  title: string;
  caption: string;
  metric?: string;
}

interface VisualPortfolioProps {
  title?: string;
  subtitle?: string;
  pieces: PortfolioPiece[];
}

export const VisualPortfolio = ({
  title = "Visual Portfolio",
  subtitle = "Campaign work, creative output, and design highlights",
  pieces,
}: VisualPortfolioProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<PortfolioPiece | null>(null);

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-1">{title}</h2>
          <p className="text-muted-foreground mb-8">{subtitle}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pieces.map((piece, index) => (
              <motion.button
                key={piece.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelected(piece)}
                className="group relative rounded-xl overflow-hidden border border-border aspect-[4/3] bg-card"
              >
                <img
                  src={piece.imageUrl}
                  alt={piece.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Metric badge */}
                {piece.metric && (
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {piece.metric}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-semibold text-sm">{piece.title}</p>
                  <p className="text-white/70 text-xs line-clamp-2">{piece.caption}</p>
                </div>
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/90 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{selected.title}</h3>
                  {selected.metric && (
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {selected.metric}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{selected.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
