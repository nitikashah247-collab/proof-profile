import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface ProfileSection {
  id: string;
  profile_id: string;
  user_id: string;
  section_type: string;
  section_order: number;
  is_visible: boolean;
  section_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useProfileSections = (profileId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSections = useCallback(async () => {
    if (!profileId || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profile_sections")
      .select("*")
      .eq("profile_id", profileId)
      .eq("user_id", user.id)
      .order("section_order", { ascending: true });

    if (error) {
      toast({ title: "Error loading sections", description: error.message, variant: "destructive" });
    } else {
      setSections((data as ProfileSection[]) || []);
    }
    setLoading(false);
  }, [profileId, user, toast]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const addSection = async (sectionType: string) => {
    if (!profileId || !user) return;
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.section_order)) + 1 : 0;

    const { data, error } = await supabase
      .from("profile_sections")
      .insert({
        profile_id: profileId,
        user_id: user.id,
        section_type: sectionType,
        section_order: maxOrder,
        section_data: {},
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error adding section", description: error.message, variant: "destructive" });
      return null;
    }

    setSections((prev) => [...prev, data as ProfileSection]);
    toast({ title: "Section added" });
    return data;
  };

  const removeSection = async (sectionId: string) => {
    const { error } = await supabase.from("profile_sections").delete().eq("id", sectionId);
    if (error) {
      toast({ title: "Error removing section", description: error.message, variant: "destructive" });
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    toast({ title: "Section removed" });
  };

  const toggleVisibility = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newVisibility = !section.is_visible;
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, is_visible: newVisibility } : s)));

    const { error } = await supabase
      .from("profile_sections")
      .update({ is_visible: newVisibility })
      .eq("id", sectionId);

    if (error) {
      setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, is_visible: !newVisibility } : s)));
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateSectionData = async (sectionId: string, sectionData: Record<string, any>) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, section_data: sectionData } : s)));

    const { error } = await supabase
      .from("profile_sections")
      .update({ section_data: sectionData })
      .eq("id", sectionId);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Section saved" });
    }
  };

  const reorderSections = useCallback(
    (newSections: ProfileSection[]) => {
      const reordered = newSections.map((s, i) => ({ ...s, section_order: i }));
      setSections(reordered);

      // Debounce the database save
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        const updates = reordered.map((s) =>
          supabase.from("profile_sections").update({ section_order: s.section_order }).eq("id", s.id)
        );
        await Promise.all(updates);
      }, 500);
    },
    []
  );

  return {
    sections,
    loading,
    addSection,
    removeSection,
    toggleVisibility,
    updateSectionData,
    reorderSections,
    refetch: fetchSections,
  };
};
