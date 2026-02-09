import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Deal {
  type: string;
  company: string;
  size: string;
  year: string;
  role: string;
  outcome: string;
}

interface DealExperienceProps {
  deals: Deal[];
}

export const DealExperience = ({ deals }: DealExperienceProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-1">Deal Experience</h2>
          <p className="text-muted-foreground mb-8">
            M&A, fundraising, and strategic transactions
          </p>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Type
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Size
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Year
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      My Role
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Outcome
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, index) => (
                    <motion.tr
                      key={`${deal.company}-${deal.year}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                          {deal.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium">{deal.company}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-primary font-mono">
                        {deal.size}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{deal.year}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{deal.role}</td>
                      <td className="px-5 py-4 text-sm font-medium">{deal.outcome}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
