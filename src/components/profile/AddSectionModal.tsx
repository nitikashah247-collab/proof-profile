import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, Plus, Check, Loader2 } from "lucide-react";
import { useSectionTemplates, SECTION_CATEGORIES, SectionTemplate } from "@/hooks/useSectionTemplates";
import { SectionIcon } from "@/components/editor/SectionIcon";

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string) => Promise<void>;
  activeSectionTypes: string[];
}

export const AddSectionModal = ({
  open,
  onClose,
  onAddSection,
  activeSectionTypes,
}: AddSectionModalProps) => {
  const { data: templates = [] } = useSectionTemplates();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);

  // Build a lookup from section_type → template
  const templateMap = useMemo(() => new Map(templates.map((t) => [t.section_type, t])), [templates]);

  // Group by SECTION_CATEGORIES, filtering out core and applying search
  const filteredCategories = useMemo(() => {
    return Object.entries(SECTION_CATEGORIES)
      .filter(([key]) => key !== "core") // Don't show core sections
      .map(([key, cat]) => ({
        key,
        label: cat.label,
        templates: cat.types
          .map((type) => templateMap.get(type))
          .filter((t): t is SectionTemplate =>
            !!t &&
            !t.is_core &&
            (search === "" ||
              t.display_name.toLowerCase().includes(search.toLowerCase()) ||
              t.description.toLowerCase().includes(search.toLowerCase()))
          ),
      }))
      .filter((cat) => cat.templates.length > 0);
  }, [templateMap, search]);

  const handleAdd = async (sectionType: string) => {
    setAdding(sectionType);
    await onAddSection(sectionType);
    setAdding(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Add a Section</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose from {templates.filter((t) => !t.is_core).length} section types to customize your profile
          </p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div key={category.key}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category.label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.templates.map((template) => {
                    const isActive = activeSectionTypes.includes(template.section_type);
                    const isAdding = adding === template.section_type;

                    return (
                      <button
                        key={template.section_type}
                        disabled={isActive || isAdding}
                        onClick={() => handleAdd(template.section_type)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isActive
                            ? "border-primary/30 bg-primary/5 opacity-70 cursor-default"
                            : "border-border hover:border-primary/40 hover:bg-muted/50 cursor-pointer"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <SectionIcon iconName={template.icon_name} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{template.display_name}</span>
                            {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {template.description || "Add this section to your profile"}
                          </p>
                        </div>
                        {!isActive && (
                          <div className="flex-shrink-0 mt-1">
                            {isAdding ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <Plus className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No sections match "{search}"
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
