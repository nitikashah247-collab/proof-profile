import { motion } from "framer-motion";

interface GenericSectionRendererProps {
  sectionType: string;
  displayName: string;
  sectionData: Record<string, any>;
}

export const GenericSectionRenderer = ({
  sectionType,
  displayName,
  sectionData,
}: GenericSectionRendererProps) => {
  const items =
    sectionData?.items ||
    sectionData?.[sectionType] ||
    (Array.isArray(sectionData) ? sectionData : null);

  // If no items array, try key-value rendering
  if (!items || !Array.isArray(items) || items.length === 0) {
    const meaningfulEntries = Object.entries(sectionData || {}).filter(
      ([key, val]) => typeof val === "string" && val.length > 0 && key !== "id"
    );
    if (meaningfulEntries.length === 0) return null;

    return (
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl"
          >
            <p className="section-overline mb-2">{sectionType.replace(/_/g, " ")}</p>
            <h2 className="section-heading text-4xl mb-10 text-foreground">{displayName}</h2>
            <div className="space-y-3">
              {meaningfulEntries.map(([key, val], i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                  <p className="text-xs text-muted-foreground capitalize mb-1 tracking-wide">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-foreground">{String(val)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <p className="section-overline mb-2">{sectionType.replace(/_/g, " ")}</p>
          <h2 className="section-heading text-4xl mb-10 text-foreground">{displayName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any, i: number) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-2 hover:border-primary/30 transition-colors">
                <h3 className="font-semibold text-foreground">
                  {item.title || item.name || item.role || item.company || item.project || `Item ${i + 1}`}
                </h3>

                {(item.company || item.organization || item.outlet || item.platform) && (
                  <p className="text-xs text-muted-foreground">
                    {[item.company, item.organization, item.outlet, item.platform, item.year, item.date]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}

                {(item.description || item.summary || item.details || item.content) && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description || item.summary || item.details || item.content}
                  </p>
                )}

                {(item.url || item.link) && (
                  <a
                    href={item.url || item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-block"
                  >
                    View →
                  </a>
                )}

                {(item.metric || item.value || item.result) && (
                  <p className="text-sm font-mono font-semibold text-primary">
                    {item.metric || item.value || item.result}
                  </p>
                )}

                {item.skills && Array.isArray(item.skills) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills.slice(0, 5).map((skill: string, j: number) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
