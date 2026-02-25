import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface InlineEditWrapperProps {
  isOwner: boolean;
  sectionId: string;
  sectionType: string;
  sectionLabel: string;
  children: ReactNode;
  editForm: ReactNode;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onRemove?: () => void;
  isEmpty?: boolean;
  isCoreSection?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const InlineEditWrapper = ({
  isOwner,
  sectionId,
  sectionType,
  sectionLabel,
  children,
  editForm,
  isEditing,
  onEditStart,
  onEditEnd,
  onRemove,
  isEmpty,
  isCoreSection,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: InlineEditWrapperProps) => {
  const isMobile = useIsMobile();

  if (!isOwner) return <>{children}</>;

  return (
    <div className="relative group/edit">
      {/* Hover outline - only when NOT editing */}
      {!isEditing && (
        <div className="absolute inset-0 border-2 border-transparent group-hover/edit:border-primary/30 rounded-xl pointer-events-none transition-colors duration-200 z-10" />
      )}

      {/* Reorder + Edit buttons - appears on hover */}
      {!isEditing && !isEmpty && (
        <div className={`absolute top-4 right-4 z-20 transition-opacity duration-200 flex items-center gap-1 ${isMobile ? "opacity-100" : "opacity-0 group-hover/edit:opacity-100"}`}>
          {onMoveUp && !isFirst && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 shadow-lg rounded-full"
              onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
          {onMoveDown && !isLast && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 shadow-lg rounded-full"
              onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
              title="Move down"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 shadow-lg rounded-full text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEditStart();
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit {sectionLabel}
          </Button>
        </div>
      )}

      {/* Section content OR edit form */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Edit header bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-primary/5 border-b border-primary/20 rounded-t-xl">
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" />
                Editing {sectionLabel}
              </span>
              <div className="flex items-center gap-2">
                {onRemove && !isCoreSection && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="gap-1 text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Section
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onEditEnd} className="gap-1 text-xs h-7">
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
            {/* Edit form content */}
            <div className="p-6 border border-primary/20 border-t-0 rounded-b-xl bg-card">
              {editForm}
            </div>
          </motion.div>
        ) : isEmpty ? (
          <motion.div key="empty" initial={false} animate={{ opacity: 1 }}>
            <div className="py-8 px-6 text-center border-2 border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground mb-3">
                No content in {sectionLabel} yet
              </p>
              <div className="flex items-center justify-center gap-2">
                {onMoveUp && !isFirst && (
                  <Button type="button" size="icon" variant="ghost" onClick={onMoveUp} className="h-8 w-8" title="Move up">
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                )}
                {onMoveDown && !isLast && (
                  <Button type="button" size="icon" variant="ghost" onClick={onMoveDown} className="h-8 w-8" title="Move down">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={onEditStart}>
                  <Plus className="w-3.5 h-3.5" />
                  Add Content
                </Button>
                {onRemove && !isCoreSection && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={onRemove}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="view" initial={false} animate={{ opacity: 1 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
