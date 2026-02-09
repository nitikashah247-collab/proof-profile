import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BrandLogosProps {
  title?: string;
  subtitle?: string;
  brands: { name: string; logoUrl?: string }[];
}

export const BrandLogos = ({
  title = "Brands I've Worked With",
  subtitle = "Companies and clients across my career",
  brands,
}: BrandLogosProps) => {
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

          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {brand.name}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
