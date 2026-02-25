import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TestimonialsInlineEditProps {
  testimonials: Array<{ quote: string; author: string; role: string; company: string }>;
  onSave: (testimonials: Array<{ quote: string; author: string; role: string; company: string }>) => Promise<void>;
  onCancel: () => void;
}

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const TestimonialsInlineEdit = ({ testimonials: initial, onSave, onCancel }: TestimonialsInlineEditProps) => {
  const [items, setItems] = useState<TestimonialItem[]>(
    initial.map((t) => ({
      quote: t.quote || "",
      author: t.author || "",
      role: t.role || "",
      company: t.company || "",
    }))
  );
  const [saving, setSaving] = useState(false);

  const update = (index: number, field: string, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const add = () => {
    setItems((prev) => [...prev, { quote: "", author: "", role: "", company: "" }]);
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(items);
    setSaving(false);
    toast({ title: "Changes saved", description: "Your testimonials have been updated." });
  };

  return (
    <div className="space-y-6">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No testimonials yet. Click "Add Testimonial" to create one.</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Testimonial {i + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} className="text-destructive h-7 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Quote</Label>
            <Textarea value={item.quote} onChange={(e) => update(i, "quote", e.target.value)} rows={3} className="mt-1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Author Name</Label>
              <Input value={item.author} onChange={(e) => update(i, "author", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Input value={item.role} onChange={(e) => update(i, "role", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input value={item.company} onChange={(e) => update(i, "company", e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Testimonial
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
