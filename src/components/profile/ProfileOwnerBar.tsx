import { Plus, Pencil, Eye, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileOwnerBarProps {
  onAddSection: () => void;
  onCustomize?: () => void;
}

export const ProfileOwnerBar = ({ onAddSection, onCustomize }: ProfileOwnerBarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Pencil className="w-3.5 h-3.5" />
          <span>Hover to edit</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 h-7 text-xs rounded-full"
          onClick={onAddSection}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </Button>
        {onCustomize && (
          <>
            <div className="w-px h-4 bg-border" />
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 h-7 text-xs rounded-full"
              onClick={onCustomize}
            >
              <Palette className="w-3.5 h-3.5" />
              Customize
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
