import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";
import { useProfileSections, ProfileSection } from "@/hooks/useProfileSections";
import { SectionLibrary } from "@/components/editor/SectionLibrary";
import { SectionList } from "@/components/editor/SectionList";
import { SectionEditModal } from "@/components/editor/SectionEditModal";
import { SectionPreview } from "@/components/editor/SectionPreview";
import { CareerCoachDrawer } from "@/components/editor/CareerCoachDrawer";
import { ThemeCustomization, type ThemeSettings } from "@/components/onboarding/ThemeCustomization";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ProfileSection | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const { data: templates = [], isLoading: templatesLoading } = useSectionTemplates();
  const {
    sections,
    loading: sectionsLoading,
    addSection,
    removeSection,
    toggleVisibility,
    updateSectionData,
    reorderSections,
  } = useProfileSections(profile?.id || null);

  const templateMap = new Map(templates.map((t) => [t.section_type, t]));

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleAddSection = async (sectionType: string) => {
    await addSection(sectionType);
  };

  const handleDeleteSection = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const template = section ? templateMap.get(section.section_type) : null;
    if (template?.is_core) {
      toast({ title: "Cannot remove core section", variant: "destructive" });
      return;
    }
    await removeSection(sectionId);
  };

  const handleSaveSection = async (sectionId: string, data: Record<string, any>) => {
    await updateSectionData(sectionId, data);
  };

  if (loading || templatesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">No profile found. Complete onboarding first.</p>
        <Link to="/onboarding">
          <Button>Start Onboarding</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-border bg-card shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/p/${profile.slug || ""}`)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Edit Profile</h1>
          <p className="text-xs text-muted-foreground">{profile.full_name || "Your profile"}</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </header>

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Section Library */}
        <div className="w-72 shrink-0 overflow-hidden flex flex-col">
          <SectionLibrary
            templates={templates}
            activeSectionTypes={sections.map((s) => s.section_type)}
            userIndustry={profile.industry}
            onAddSection={handleAddSection}
          />
          <div className="p-3 border-t border-border">
            <button
              onClick={() => setShowThemeModal(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Palette className="w-4 h-4" />
              Change Theme
            </button>
          </div>
        </div>

        {/* Center: Active Sections */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Your Sections</h2>
              <p className="text-sm text-muted-foreground">
                Drag to reorder, toggle visibility, or click edit to add content
              </p>
            </div>
            {sectionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : (
              <SectionList
                sections={sections}
                templates={templates}
                onReorder={reorderSections}
                onEdit={setEditingSection}
                onToggleVisibility={toggleVisibility}
                onDelete={handleDeleteSection}
              />
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-80 shrink-0 overflow-hidden">
          <SectionPreview sections={sections} templates={templates} profileName={profile.full_name} />
        </div>
      </div>

      {/* Edit Modal */}
      <SectionEditModal
        section={editingSection}
        template={editingSection ? templateMap.get(editingSection.section_type) || null : null}
        open={!!editingSection}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveSection}
      />

      {/* AI Career Coach */}
      <CareerCoachDrawer
        profileData={profile}
        sections={sections}
        activeSectionTypes={sections.map((s) => s.section_type)}
        onAddSection={handleAddSection}
      />

      {/* Theme Modal */}
      <Dialog open={showThemeModal} onOpenChange={setShowThemeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ThemeCustomization
            userId={user?.id || ""}
            onComplete={async (settings: ThemeSettings) => {
              await supabase
                .from("profiles")
                .update({
                  theme_base: settings.themeBase,
                  theme_primary_color: settings.primaryColor,
                  theme_secondary_color: settings.secondaryColor,
                  banner_type: settings.bannerType,
                  banner_value: settings.bannerValue,
                  banner_url: settings.bannerUrl || null,
                })
                .eq("id", profile.id);
              setProfile({ ...profile, ...{
                theme_base: settings.themeBase,
                theme_primary_color: settings.primaryColor,
                theme_secondary_color: settings.secondaryColor,
                banner_type: settings.bannerType,
                banner_value: settings.bannerValue,
                banner_url: settings.bannerUrl || null,
              }});
              setShowThemeModal(false);
              toast({ title: "Theme updated!" });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfile;
