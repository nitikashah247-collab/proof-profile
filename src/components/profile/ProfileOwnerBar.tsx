import { useState, useRef, useEffect } from "react";
import { Pencil, Eye, Plus, Quote, Globe, BookOpen, Palette, BarChart3, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_ADDABLE_SECTIONS = [
  { type: "testimonials", label: "Testimonials", icon: Quote },
  { type: "languages", label: "Languages", icon: Globe },
  { type: "publications", label: "Publications", icon: BookOpen },
  { type: "work_style", label: "Work Style", icon: Palette },
  { type: "impact_charts", label: "Impact Metrics", icon: BarChart3 },
  { type: "case_studies", label: "Impact Stories", icon: Briefcase },
];

interface ProfileOwnerBarProps {
  existingSectionTypes?: string[];
  onAddSection?: (sectionType: string) => void;
}

export const ProfileOwnerBar = ({ existingSectionTypes = [], onAddSection }: ProfileOwnerBarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const missingSections = ALL_ADDABLE_SECTIONS.filter(
    (s) => !existingSectionTypes.includes(s.type)
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Pencil className="w-3.5 h-3.5" />
          <span>Hover to edit</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          <span>Public profile</span>
        </div>

        {missingSections.length > 0 && onAddSection && (
          <>
            <div className="w-px h-4 bg-border" />
            <div className="relative" ref={dropdownRef}>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-7 text-xs rounded-full"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Section
              </Button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-52 rounded-xl border border-border bg-card shadow-xl z-50 py-1 animate-in fade-in-0 zoom-in-95">
                  {missingSections.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.type}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                        onClick={() => {
                          onAddSection(s.type);
                          setDropdownOpen(false);
                        }}
                      >
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
