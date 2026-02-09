import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, FileText, ExternalLink, Calendar } from "lucide-react";

interface SpeakingItem {
  type: "talk" | "article" | "podcast";
  title: string;
  venue: string;
  date: string;
  description: string;
  url?: string;
}

interface SpeakingWritingProps {
  items: SpeakingItem[];
}

const typeIcons = { talk: Mic, article: FileText, podcast: Mic };
const typeLabels = { talk: "Talk", article: "Article", podcast: "Podcast" };

export const SpeakingWriting = ({ items }: SpeakingWritingProps) => {
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
          <h2 className="text-3xl font-bold mb-1">Speaking & Writing</h2>
          <p className="text-muted-foreground mb-8">
            Thought leadership across conferences, publications, and podcasts
          </p>

          <div className="space-y-4">
            {items.map((item, index) => {
              const Icon = typeIcons[item.type];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-primary/10 text-primary">
                        {typeLabels[item.type]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-0.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.venue}
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      {item.description}
                    </p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
