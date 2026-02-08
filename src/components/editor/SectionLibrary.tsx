import { useState } from "react";
import { Search, Plus, Check, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SectionIcon } from "./SectionIcon";
import { SectionTemplate, SECTION_CATEGORIES } from "@/hooks/useSectionTemplates";

interface SectionLibraryProps {
  templates: SectionTemplate[];
  activeSectionTypes: string[];
  userIndustry?: string;
  onAddSection: (sectionType: string) => void;
}

export const SectionLibrary = ({
  templates,
  activeSectionTypes,
  userIndustry,
  onAddSection,
}: SectionLibraryProps) => {
  const [search, setSearch] = useState("");

  const templateMap = new Map(templates.map((t) => [t.section_type, t]));

  const filteredCategories = Object.entries(SECTION_CATEGORIES)
    .map(([key, cat]) => ({
      key,
      label: cat.label,
      templates: cat.types
        .map((type) => templateMap.get(type))
        .filter((t): t is SectionTemplate =>
          !!t && (search === "" || t.display_name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
        ),
    }))
    .filter((cat) => cat.templates.length > 0);

  return (
    <div className="h-full flex flex-col border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold mb-3">Add Sections</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-5">
          {filteredCategories.map((category) => (
            <div key={category.key}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {category.label}
              </p>
              <div className="space-y-1">
                {category.templates.map((template) => {
                  const isActive = activeSectionTypes.includes(template.section_type);
                  const isRecommended =
                    userIndustry &&
                    template.recommended_for.some((r) => userIndustry.toLowerCase().includes(r));

                  return (
                    <button
                      key={template.section_type}
                      onClick={() => !isActive && !template.is_core && onAddSection(template.section_type)}
                      disabled={isActive || template.is_core}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-primary/5 cursor-default"
                          : template.is_core
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted cursor-pointer"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <SectionIcon iconName={template.icon_name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium truncate">{template.display_name}</span>
                          {isRecommended && (
                            <Star className="w-3 h-3 text-proof-warning flex-shrink-0" fill="currentColor" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isActive ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : !template.is_core ? (
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
