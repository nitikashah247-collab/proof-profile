import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSection } from "@/hooks/useProfileSections";
import { SectionTemplate } from "@/hooks/useSectionTemplates";
import { SectionIcon } from "./SectionIcon";
import { motion } from "framer-motion";

interface SectionPreviewProps {
  sections: ProfileSection[];
  templates: SectionTemplate[];
  profileName?: string;
}

export const SectionPreview = ({ sections, templates, profileName }: SectionPreviewProps) => {
  const templateMap = new Map(templates.map((t) => [t.section_type, t]));
  const visibleSections = sections.filter((s) => s.is_visible);

  return (
    <div className="h-full flex flex-col border-l border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold">Live Preview</h2>
        <p className="text-xs text-muted-foreground">{visibleSections.length} sections visible</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {visibleSections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No visible sections to preview
            </p>
          ) : (
            visibleSections.map((section, i) => {
              const template = templateMap.get(section.section_type);
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PreviewCard section={section} template={template} profileName={profileName} />
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const PreviewCard = ({
  section,
  template,
  profileName,
}: {
  section: ProfileSection;
  template?: SectionTemplate;
  profileName?: string;
}) => {
  const data = section.section_data;
  const hasContent = Object.keys(data).length > 0;

  switch (section.section_type) {
    case "hero":
      return (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-lg font-bold">{data.name || profileName || "Your Name"}</p>
          <p className="text-sm text-muted-foreground">{data.title || data.positioning_statement || "Your headline"}</p>
          {data.metrics && <p className="text-xs text-primary mt-1 font-mono">{data.metrics}</p>}
          {!data.metrics && data.hero_stats && (
            <p className="text-xs text-primary mt-1 font-mono">
              {data.hero_stats.years_experience && `${data.hero_stats.years_experience}+ years`}
              {data.hero_stats.companies_worked && ` · ${data.hero_stats.companies_worked} companies`}
              {data.hero_stats.key_metric && typeof data.hero_stats.key_metric === 'object'
                ? ` · ${data.hero_stats.key_metric.value || ''}${data.hero_stats.key_metric.suffix || ''} ${data.hero_stats.key_metric.label || ''}`
                : data.hero_stats.key_metric && ` · ${data.hero_stats.key_metric}`
              }
            </p>
          )}
        </div>
      );

    case "about":
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">About</p>
          <p className="text-sm text-muted-foreground line-clamp-3">{data.summary || "Your summary will appear here..."}</p>
        </div>
      );

    case "contact":
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Contact</p>
          <p className="text-sm">{data.email || "email@example.com"}</p>
          {data.cta_text && <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs">{data.cta_text}</span>}
        </div>
      );

    case "case_studies": {
      // Support both formats: {items: [...]} (editor) and {case_studies: [...]} (generated)
      const items = data.items || data.case_studies || [];
      return (
        <div className="p-4 rounded-xl border border-border space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Impact Stories</p>
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground">No stories added yet</p>
          ) : (
            items.slice(0, 2).map((item: any, i: number) => (
              <div key={i} className="p-2 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">{item.title || "Untitled"}</p>
                {(item.metric || item.results) && <p className="text-xs text-primary font-mono">{item.metric || item.results}</p>}
              </div>
            ))
          )}
          {items.length > 2 && <p className="text-xs text-muted-foreground">+{items.length - 2} more</p>}
        </div>
      );
    }

    case "skills":
    case "skills_matrix": {
      // Support both formats: {items: [...]} (editor) and {skills_with_proof: [...]} (generated)
      const items = data.items || data.skills_with_proof || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground">No skills added yet</p>
            ) : (
              items.slice(0, 6).map((item: any, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{item.name || "Skill"}</span>
              ))
            )}
            {items.length > 6 && <span className="px-2 py-0.5 text-xs text-muted-foreground">+{items.length - 6}</span>}
          </div>
        </div>
      );
    }

    case "testimonials":
    case "client_testimonials": {
      const items = data.items || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Testimonials</p>
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground">No testimonials added yet</p>
          ) : (
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-xs italic text-foreground/80 line-clamp-2">"{items[0].quote || "..."}"</p>
              <p className="text-xs text-muted-foreground mt-1">— {items[0].author_name || "Author"}</p>
            </div>
          )}
          {items.length > 1 && <p className="text-xs text-muted-foreground mt-1">+{items.length - 1} more</p>}
        </div>
      );
    }

    case "career_timeline": {
      const items = data.items || data.timeline || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Career Timeline</p>
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground">No roles added yet</p>
          ) : (
            <div className="space-y-1.5">
              {items.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="p-2 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">{item.role || "Role"}</p>
                  <p className="text-xs text-muted-foreground">{item.company || "Company"} · {item.start_date || item.start_year || ""} — {item.end_date || item.end_year || "Present"}</p>
                </div>
              ))}
              {items.length > 3 && <p className="text-xs text-muted-foreground">+{items.length - 3} more</p>}
            </div>
          )}
        </div>
      );
    }

    case "impact_charts": {
      const metrics = data.metrics || data.visualizations || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Impact Metrics</p>
          {metrics.length === 0 ? (
            <p className="text-xs text-muted-foreground">No metrics added yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {metrics.slice(0, 4).map((m: any, i: number) => (
                <div key={i} className="p-2 rounded-lg bg-primary/5 text-center">
                  <p className="text-lg font-bold text-primary">{m.headline_value || m.value || "—"}</p>
                  <p className="text-xs text-muted-foreground">{m.title || m.headline_label || "Metric"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "languages": {
      const langs = data.languages || data.items || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Languages</p>
          {langs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No languages added yet</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {langs.map((l: any, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                  {typeof l === "string" ? l : l.name || l.language || "Language"}{l.level ? ` · ${l.level}` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "publications": {
      const pubs = data.publications || data.items || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Publications</p>
          {pubs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No publications added yet</p>
          ) : (
            pubs.slice(0, 2).map((p: any, i: number) => (
              <p key={i} className="text-sm truncate">{p.title || p.name || "Publication"}</p>
            ))
          )}
        </div>
      );
    }

    case "work_style": {
      const ws = data.work_style;
      const dims = ws?.dimensions || data.items || [];
      return (
        <div className="p-4 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Work Style</p>
          {dims.length === 0 ? (
            <p className="text-xs text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-1">
              {dims.slice(0, 3).map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{d.label || d.name || "Dimension"}</span>
                  <span className="text-muted-foreground">{d.value || d.score || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    default:
      return (
        <div className="p-4 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-1">
            <SectionIcon iconName={template?.icon_name || "Layout"} className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase">{template?.display_name || section.section_type}</p>
          </div>
          {hasContent ? (
            <p className="text-xs text-muted-foreground">
              {(data.items?.length || 0) > 0 ? `${data.items.length} item(s)` : "Content configured"}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Empty section</p>
          )}
        </div>
      );
  }
};