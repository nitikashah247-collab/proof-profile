import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface LifestyleItem {
  imageUrl: string;
  caption: string;
  emoji?: string;
}

interface LifestyleGalleryProps {
  title?: string;
  subtitle?: string;
  items: LifestyleItem[];
}

export const LifestyleGallery = ({
  title = "Beyond Work",
  subtitle = "A glimpse into what drives me outside the office",
  items,
}: LifestyleGalleryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.caption}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-border aspect-square"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">
                    {item.emoji && <span className="mr-1">{item.emoji}</span>}
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
