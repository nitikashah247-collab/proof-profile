import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LanguagesInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const LanguagesInlineEdit = ({ sectionData, onSave, onCancel }: LanguagesInlineEditProps) => {
  const [languages, setLanguages] = useState<{ name: string; proficiency: string }[]>(
    (sectionData?.languages || []).map((l: any) => ({ name: l.name || "", proficiency: l.proficiency || "Professional" }))
  );
  const [saving, setSaving] = useState(false);

  const updateLang = (i: number, field: string, value: string) => {
    setLanguages((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, languages: languages.filter((l) => l.name.trim()) });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-3">
      {languages.map((lang, i) => (
        <div key={i} className="flex items-center gap-3">
          <Input value={lang.name} onChange={(e) => updateLang(i, "name", e.target.value)} placeholder="Language" className="h-8 text-sm flex-1" />
          <select value={lang.proficiency} onChange={(e) => updateLang(i, "proficiency", e.target.value)} className="h-8 px-2 rounded-md border border-input bg-background text-xs">
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Professional">Professional</option>
            <option value="Conversational">Conversational</option>
            <option value="Basic">Basic</option>
          </select>
          <Button type="button" variant="ghost" size="icon" onClick={() => setLanguages((p) => p.filter((_, idx) => idx !== i))} className="h-7 w-7 text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setLanguages((p) => [...p, { name: "", proficiency: "Professional" }])} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Language
      </Button>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
