import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, X } from "lucide-react";
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
}: InlineEditWrapperProps) => {
  const isMobile = useIsMobile();

  if (!isOwner) return <>{children}</>;

  return (
    <div className="relative group/edit">
      {/* Hover outline - only when NOT editing */}
      {!isEditing && (
        <div className="absolute inset-0 border-2 border-transparent group-hover/edit:border-primary/30 rounded-xl pointer-events-none transition-colors duration-200 z-10" />
      )}

      {/* Edit button - appears on hover (or always on mobile), top right of section */}
      {!isEditing && (
        <div className={`absolute top-4 right-4 z-20 transition-opacity duration-200 ${isMobile ? "opacity-100" : "opacity-0 group-hover/edit:opacity-100"}`}>
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
              <Button variant="ghost" size="sm" onClick={onEditEnd} className="gap-1 text-xs h-7">
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
            {/* Edit form content */}
            <div className="p-6 border border-primary/20 border-t-0 rounded-b-xl bg-card">
              {editForm}
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
