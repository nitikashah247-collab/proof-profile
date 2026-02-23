import { Pencil, Eye } from "lucide-react";

export const ProfileOwnerBar = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Pencil className="w-3.5 h-3.5" />
          <span>Hover any section to edit</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          <span>This is your public profile</span>
        </div>
      </div>
    </div>
  );
};
