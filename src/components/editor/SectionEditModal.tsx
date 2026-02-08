import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ProfileSection } from "@/hooks/useProfileSections";
import { SectionTemplate } from "@/hooks/useSectionTemplates";
import { SectionIcon } from "./SectionIcon";

interface SectionEditModalProps {
  section: ProfileSection | null;
  template: SectionTemplate | null;
  open: boolean;
  onClose: () => void;
  onSave: (sectionId: string, data: Record<string, any>) => void;
}

export const SectionEditModal = ({ section, template, open, onClose, onSave }: SectionEditModalProps) => {
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (section) {
      setData(section.section_data || {});
    }
  }, [section]);

  if (!section || !template) return null;

  const handleSave = () => {
    onSave(section.id, data);
    onClose();
  };

  const renderFields = () => {
    switch (template.section_type) {
      case "hero":
        return <HeroFields data={data} onChange={setData} />;
      case "about":
        return <AboutFields data={data} onChange={setData} />;
      case "contact":
        return <ContactFields data={data} onChange={setData} />;
      case "case_studies":
        return <CaseStudiesFields data={data} onChange={setData} />;
      case "skills":
        return <SkillsFields data={data} onChange={setData} />;
      case "testimonials":
      case "client_testimonials":
        return <TestimonialsFields data={data} onChange={setData} />;
      case "portfolio":
        return <PortfolioFields data={data} onChange={setData} />;
      case "credentials":
        return <CredentialsFields data={data} onChange={setData} />;
      case "timeline":
        return <TimelineFields data={data} onChange={setData} />;
      default:
        return <GenericJsonFields data={data} onChange={setData} template={template} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SectionIcon iconName={template.icon_name} className="w-5 h-5" />
            Edit {template.display_name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">{renderFields()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Field Components ---

const HeroFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
  <div className="space-y-4">
    <FieldRow label="Display Name">
      <Input value={data.name || ""} onChange={(e) => onChange({ ...data, name: e.target.value })} placeholder="Jane Smith" />
    </FieldRow>
    <FieldRow label="Title / Headline">
      <Input value={data.title || ""} onChange={(e) => onChange({ ...data, title: e.target.value })} placeholder="VP of Marketing at Acme" />
    </FieldRow>
    <FieldRow label="Key Metrics (comma-separated)">
      <Input value={data.metrics || ""} onChange={(e) => onChange({ ...data, metrics: e.target.value })} placeholder="$2M ARR growth, 150% ROI, 10+ campaigns" />
    </FieldRow>
  </div>
);

const AboutFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
  <FieldRow label="Summary">
    <Textarea rows={5} value={data.summary || ""} onChange={(e) => onChange({ ...data, summary: e.target.value })} placeholder="Write a brief summary about your background, expertise, and what makes you unique..." />
  </FieldRow>
);

const ContactFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
  <div className="space-y-4">
    <FieldRow label="Email">
      <Input type="email" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} placeholder="you@example.com" />
    </FieldRow>
    <FieldRow label="LinkedIn URL">
      <Input value={data.linkedin || ""} onChange={(e) => onChange({ ...data, linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourname" />
    </FieldRow>
    <FieldRow label="CTA Text">
      <Input value={data.cta_text || ""} onChange={(e) => onChange({ ...data, cta_text: e.target.value })} placeholder="Let's connect" />
    </FieldRow>
  </div>
);

const CaseStudiesFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { title: "", challenge: "", approach: "", results: "" }] });
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-6">
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-border space-y-3 relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Story {i + 1}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Input placeholder="Project title" value={item.title || ""} onChange={(e) => updateItem(i, "title", e.target.value)} />
          <Textarea rows={2} placeholder="What was the challenge?" value={item.challenge || ""} onChange={(e) => updateItem(i, "challenge", e.target.value)} />
          <Textarea rows={2} placeholder="What was your approach?" value={item.approach || ""} onChange={(e) => updateItem(i, "approach", e.target.value)} />
          <Textarea rows={2} placeholder="What were the results?" value={item.results || ""} onChange={(e) => updateItem(i, "results", e.target.value)} />
          <Input placeholder="Key metric (e.g., 150% ROI)" value={item.metric || ""} onChange={(e) => updateItem(i, "metric", e.target.value)} />
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Impact Story
      </Button>
    </div>
  );
};

const SkillsFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { name: "", category: "", proficiency: 80 }] });
  const updateItem = (i: number, field: string, value: any) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-3">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <Input className="flex-1" placeholder="Skill name" value={item.name || ""} onChange={(e) => updateItem(i, "name", e.target.value)} />
          <Input className="w-28" placeholder="Category" value={item.category || ""} onChange={(e) => updateItem(i, "category", e.target.value)} />
          <Input className="w-20" type="number" min={0} max={100} value={item.proficiency || 80} onChange={(e) => updateItem(i, "proficiency", parseInt(e.target.value) || 0)} />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive flex-shrink-0" onClick={() => removeItem(i)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Skill
      </Button>
    </div>
  );
};

const TestimonialsFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { quote: "", author_name: "", author_role: "", author_company: "" }] });
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-6">
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Testimonial {i + 1}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Textarea rows={3} placeholder="What did they say about you?" value={item.quote || ""} onChange={(e) => updateItem(i, "quote", e.target.value)} />
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Name" value={item.author_name || ""} onChange={(e) => updateItem(i, "author_name", e.target.value)} />
            <Input placeholder="Role" value={item.author_role || ""} onChange={(e) => updateItem(i, "author_role", e.target.value)} />
            <Input placeholder="Company" value={item.author_company || ""} onChange={(e) => updateItem(i, "author_company", e.target.value)} />
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Testimonial
      </Button>
    </div>
  );
};

const PortfolioFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { caption: "", link: "", image_url: "" }] });
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-4">
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Item {i + 1}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <Input placeholder="Image URL" value={item.image_url || ""} onChange={(e) => updateItem(i, "image_url", e.target.value)} />
          <Input placeholder="Caption" value={item.caption || ""} onChange={(e) => updateItem(i, "caption", e.target.value)} />
          <Input placeholder="Link (optional)" value={item.link || ""} onChange={(e) => updateItem(i, "link", e.target.value)} />
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Portfolio Item
      </Button>
    </div>
  );
};

const CredentialsFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { title: "", institution: "", year: "", type: "certification" }] });
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-4">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <Input className="flex-1" placeholder="Title" value={item.title || ""} onChange={(e) => updateItem(i, "title", e.target.value)} />
          <Input className="flex-1" placeholder="Institution" value={item.institution || ""} onChange={(e) => updateItem(i, "institution", e.target.value)} />
          <Input className="w-20" placeholder="Year" value={item.year || ""} onChange={(e) => updateItem(i, "year", e.target.value)} />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive flex-shrink-0" onClick={() => removeItem(i)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Credential
      </Button>
    </div>
  );
};

const TimelineFields = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const items = data.items || [];
  const addItem = () => onChange({ ...data, items: [...items, { role: "", company: "", start_date: "", end_date: "", description: "" }] });
  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };
  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-6">
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Role {i + 1}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Job title" value={item.role || ""} onChange={(e) => updateItem(i, "role", e.target.value)} />
            <Input placeholder="Company" value={item.company || ""} onChange={(e) => updateItem(i, "company", e.target.value)} />
            <Input placeholder="Start date" value={item.start_date || ""} onChange={(e) => updateItem(i, "start_date", e.target.value)} />
            <Input placeholder="End date (or Present)" value={item.end_date || ""} onChange={(e) => updateItem(i, "end_date", e.target.value)} />
          </div>
          <Textarea rows={2} placeholder="Brief description" value={item.description || ""} onChange={(e) => updateItem(i, "description", e.target.value)} />
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Role
      </Button>
    </div>
  );
};

const GenericJsonFields = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SectionTemplate }) => {
  const items = data.items || [];
  const fields = (template.template_structure as any)?.fields || [];

  const addItem = () => {
    const emptyItem: Record<string, string> = {};
    fields.forEach((f: string) => (emptyItem[f] = ""));
    onChange({ ...data, items: [...items, emptyItem] });
  };

  const updateItem = (i: number, field: string, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    onChange({ ...data, items: updated });
  };

  const removeItem = (i: number) => onChange({ ...data, items: items.filter((_: any, idx: number) => idx !== i) });

  return (
    <div className="space-y-4">
      {items.map((item: any, i: number) => (
        <div key={i} className="p-4 rounded-xl border border-border space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Item {i + 1}</p>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          {fields.map((field: string) => (
            <Input
              key={field}
              placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
              value={item[field] || ""}
              onChange={(e) => updateItem(i, field, e.target.value)}
            />
          ))}
        </div>
      ))}
      <Button variant="outline" className="w-full gap-2" onClick={addItem}>
        <Plus className="w-4 h-4" /> Add Item
      </Button>
    </div>
  );
};

const FieldRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm">{label}</Label>
    {children}
  </div>
);
