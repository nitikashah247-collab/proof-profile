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

  // Derive overline from section type
  const overline = sectionType.replace(/_/g, " ").toUpperCase();

  // If no items array, try key-value rendering
  if (!items || !Array.isArray(items) || items.length === 0) {
    const meaningfulEntries = Object.entries(sectionData || {}).filter(
      ([key, val]) => typeof val === "string" && val.length > 0 && key !== "id"
    );
    if (meaningfulEntries.length === 0) return null;

    return (
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl"
          >
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">{overline}</p>
              <h2 className="text-2xl font-semibold text-foreground">{displayName}</h2>
            </div>
            <div className="space-y-3">
              {meaningfulEntries.map(([key, val], i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
                  <p className="text-xs text-muted-foreground capitalize mb-1">
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
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">{overline}</p>
            <h2 className="text-2xl font-semibold text-foreground">{displayName}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl border border-border bg-card space-y-2 hover:shadow-md transition-shadow">
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
                  <p className="text-sm text-muted-foreground">
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
                  <p className="text-sm font-semibold text-foreground font-metrics">
                    {item.metric || item.value || item.result}
                  </p>
                )}

                {item.skills && Array.isArray(item.skills) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills.slice(0, 5).map((skill: string, j: number) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
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
