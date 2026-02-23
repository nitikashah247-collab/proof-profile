import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SkillsInlineEditProps {
  sectionData: Record<string, any>;
  skills: any[];
  profileId: string;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

interface SkillItem {
  name: string;
  category: string;
  proficiency: number;
}

export const SkillsInlineEdit = ({ sectionData, skills, onSave, onCancel }: SkillsInlineEditProps) => {
  const [items, setItems] = useState<SkillItem[]>(
    skills.map((s) => ({
      name: s.name || "",
      category: s.category || "general",
      proficiency: s.proficiency || 80,
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateSkill = (index: number, field: string, value: any) => {
    setItems((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSkill = () => {
    setItems((prev) => [...prev, { name: "", category: "general", proficiency: 80 }]);
  };

  const removeSkill = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, skills_list: items });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-4">
      {items.map((skill, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
          <div className="flex-1">
            <Input value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)} placeholder="Skill name" className="h-8 text-sm" />
          </div>
          <select
            value={skill.category}
            onChange={(e) => updateSkill(i, "category", e.target.value)}
            className="h-8 px-2 rounded-md border border-input bg-background text-xs"
          >
            <option value="Core Competency">Core Competency</option>
            <option value="Technical Proficiency">Technical Proficiency</option>
            <option value="general">General</option>
          </select>
          <div className="w-24">
            <Slider
              value={[skill.proficiency]}
              onValueChange={([v]) => updateSkill(i, "proficiency", v)}
              max={100}
              step={5}
            />
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(i)} className="h-7 w-7 text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addSkill} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Skill
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
