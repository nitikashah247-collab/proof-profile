import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSectionCard } from "./SortableSectionCard";
import { ProfileSection } from "@/hooks/useProfileSections";
import { SectionTemplate } from "@/hooks/useSectionTemplates";
import { LayoutGrid } from "lucide-react";

interface SectionListProps {
  sections: ProfileSection[];
  templates: SectionTemplate[];
  onReorder: (sections: ProfileSection[]) => void;
  onEdit: (section: ProfileSection) => void;
  onToggleVisibility: (sectionId: string) => void;
  onDelete: (sectionId: string) => void;
}

export const SectionList = ({
  sections,
  templates,
  onReorder,
  onEdit,
  onToggleVisibility,
  onDelete,
}: SectionListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const templateMap = new Map(templates.map((t) => [t.section_type, t]));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);
    onReorder(reordered);
  };

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No sections yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add sections from the library on the left to build your profile
        </p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableSectionCard
              key={section.id}
              section={section}
              template={templateMap.get(section.section_type)}
              onEdit={onEdit}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
