import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionIcon } from "./SectionIcon";
import { ProfileSection } from "@/hooks/useProfileSections";
import { SectionTemplate } from "@/hooks/useSectionTemplates";

interface SortableSectionCardProps {
  section: ProfileSection;
  template?: SectionTemplate;
  onEdit: (section: ProfileSection) => void;
  onToggleVisibility: (sectionId: string) => void;
  onDelete: (sectionId: string) => void;
}

const hasContentData = (data: Record<string, any>): boolean => {
  if (!data || Object.keys(data).length === 0) return false;
  // Check for common generated data keys beyond just "items"
  const knownContentKeys = [
    "items", "positioning_statement", "hero_stats", "summary", "email",
    "case_studies", "timeline", "skills_with_proof", "metrics",
    "visualizations", "languages", "publications", "work_style",
    "name", "title", "cta_text",
  ];
  return knownContentKeys.some((key) => {
    const val = data[key];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object") return Object.keys(val).length > 0;
    return true;
  });
};

export const SortableSectionCard = ({
  section,
  template,
  onEdit,
  onToggleVisibility,
  onDelete,
}: SortableSectionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCore = template?.is_core ?? false;
  const hasContent = hasContentData(section.section_data);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-xl border bg-card transition-all ${
        isDragging
          ? "border-primary shadow-lg shadow-primary/10 z-50 opacity-90"
          : "border-border hover:border-primary/30"
      } ${!section.is_visible ? "opacity-60" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Icon + Info */}
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
        <SectionIcon iconName={template?.icon_name || "Layout"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{template?.display_name || section.section_type}</p>
        <p className="text-xs text-muted-foreground">
          {hasContent ? "Content added" : "Empty — click edit to add content"}
        </p>
      </div>

      {/* Actions - stopPropagation prevents drag interference */}
      <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(section); }}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onToggleVisibility(section.id); }}>
          {section.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </Button>
        {!isCore && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};