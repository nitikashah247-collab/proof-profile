import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileText,
  Image,
  Presentation,
  ArrowRight,
  Loader2,
  CheckCircle2,
  BarChart3,
  Mail,
  Award,
  Monitor,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ArtifactFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

interface ArtifactUploadProps {
  userId: string;
  profileId: string;
  onComplete: (artifacts: ArtifactFile[]) => void;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const VALID_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const exampleItems = [
  { icon: BarChart3, label: "Dashboard screenshots" },
  { icon: Presentation, label: "Presentation decks" },
  { icon: Mail, label: "Emails praising your work" },
  { icon: Award, label: "Awards or certificates" },
  { icon: Monitor, label: "Project deliverables" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.includes("pdf")) return FileText;
  if (type.includes("presentation") || type.includes("powerpoint")) return Presentation;
  return FileText;
}

export const ArtifactUpload = ({ userId, profileId, onComplete }: ArtifactUploadProps) => {
  const [artifacts, setArtifacts] = useState<ArtifactFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (artifacts.length + fileArray.length > MAX_FILES) {
        toast({
          title: "Too many files",
          description: `Maximum ${MAX_FILES} artifacts allowed. You can upload ${MAX_FILES - artifacts.length} more.`,
          variant: "destructive",
        });
        return;
      }

      for (const file of fileArray) {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 10MB limit`,
            variant: "destructive",
          });
          continue;
        }

        if (!VALID_TYPES.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported format. Use PNG, JPG, PDF, or PPTX.`,
            variant: "destructive",
          });
          continue;
        }

        setUploadingFiles((prev) => [...prev, file.name]);

        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `${userId}/artifacts/${fileName}`;

          const { error } = await supabase.storage
            .from("profile-artifacts")
            .upload(filePath, file);

          if (error) {
            toast({
              title: "Upload failed",
              description: error.message,
              variant: "destructive",
            });
            continue;
          }

          const { data: urlData } = supabase.storage
            .from("profile-artifacts")
            .getPublicUrl(filePath);

          const artifact: ArtifactFile = {
            id: fileName,
            name: file.name,
            type: file.type,
            size: file.size,
            url: urlData.publicUrl,
            uploadedAt: new Date().toISOString(),
          };

          setArtifacts((prev) => [...prev, artifact]);
        } catch (err) {
          console.error("Upload error:", err);
          toast({
            title: "Upload failed",
            description: `Could not upload ${file.name}`,
            variant: "destructive",
          });
        } finally {
          setUploadingFiles((prev) => prev.filter((f) => f !== file.name));
        }
      }
    },
    [artifacts.length, userId]
  );

  const handleRemove = useCallback(
    async (artifact: ArtifactFile) => {
      const filePath = `${userId}/artifacts/${artifact.id}`;
      await supabase.storage.from("profile-artifacts").remove([filePath]);

      setArtifacts((prev) => prev.filter((a) => a.id !== artifact.id));
    },
    [userId]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleContinue = () => {
    onComplete(artifacts);
  };

  const isUploading = uploadingFiles.length > 0;

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">
        Got <span className="text-primary">proof</span>?
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Upload artifacts that show your impact — these will be analyzed and embedded in your profile as evidence.
      </p>

      {/* Example items */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {exampleItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground"
          >
            <item.icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all mb-6 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        } ${artifacts.length >= MAX_FILES ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.pptx,.ppt"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, PDF, PPTX · Max {MAX_FILES} files, 10MB each
          </p>
        </div>
      </div>

      {/* Uploading indicators */}
      <AnimatePresence>
        {uploadingFiles.map((fileName) => (
          <motion.div
            key={fileName}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted mb-2"
          >
            <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
            <span className="text-sm truncate flex-1 text-left">{fileName}</span>
            <span className="text-xs text-muted-foreground">Uploading...</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Uploaded files list */}
      {artifacts.length > 0 && (
        <div className="space-y-2 mb-8">
          <p className="text-sm font-medium text-left text-muted-foreground mb-3">
            Uploaded ({artifacts.length}):
          </p>
          <AnimatePresence>
            {artifacts.map((artifact) => {
              const IconComp = getFileIcon(artifact.type);
              return (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                >
                  {artifact.type.startsWith("image/") ? (
                    <img
                      src={artifact.url}
                      alt={artifact.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{artifact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(artifact.size)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--proof-success))] shrink-0" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(artifact);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="ghost"
          onClick={handleContinue}
          disabled={isUploading}
          className="text-muted-foreground"
        >
          Skip for now
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isUploading}
          className="group"
        >
          {artifacts.length > 0 ? "Continue" : "Continue without artifacts"}
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
