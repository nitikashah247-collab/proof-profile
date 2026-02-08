import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface ResumeData {
  full_name: string;
  headline: string;
  bio: string;
  industry: string;
  years_experience: number | null;
  location: string | null;
  roles: Array<{
    title: string;
    company: string;
    start_date: string;
    end_date: string | null;
    description: string;
    key_achievement: string;
  }>;
  key_achievements: string[];
  skills: Array<{ name: string; category: string }>;
  education: Array<{ institution: string; degree: string; year: string | null }>;
}

interface ResumeUploadProps {
  onComplete: (data: ResumeData, fileUrl: string) => void;
}

type UploadState = "idle" | "uploading" | "analyzing" | "done" | "error";

export const ResumeUpload = ({ onComplete }: ResumeUploadProps) => {
  const { user } = useAuth();
  const [state, setState] = useState<UploadState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      setErrorMessage("Please upload a PDF or DOCX file.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File must be under 10MB.");
      return;
    }
    setErrorMessage("");
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleUploadAndParse = async () => {
    if (!file) return;

    try {
      // Step 1: Upload to storage
      setState("uploading");
      const ext = file.name.split(".").pop();
      const userId = user?.id || "anonymous";
      const fileName = `${userId}/resumes/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-assets")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload file. Please try again.");
      }

      const { data: urlData } = supabase.storage
        .from("profile-assets")
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      // Step 2: Send to edge function for parsing
      setState("analyzing");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to analyse resume");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Resume analysis failed");
      }

      setState("done");

      // Brief pause to show success state
      await new Promise((r) => setTimeout(r, 800));

      onComplete(result.extracted, fileUrl);
    } catch (err) {
      console.error("Resume processing error:", err);
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      toast({
        title: "Resume processing failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setFile(null);
    setState("idle");
    setErrorMessage("");
  };

  if (state === "uploading" || state === "analyzing") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 rounded-2xl border border-border bg-card"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
     <h3 className="text-lg font-semibold mb-2">
          {state === "uploading" ? "Uploading your resume..." : "Analysing your resume..."}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {state === "uploading"
            ? "Securely storing your file"
            : "Our AI is reading your resume and extracting key information. This may take a moment."}
        </p>
      </motion.div>
    );
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 rounded-2xl border border-border bg-card"
      >
        <div className="w-16 h-16 rounded-2xl bg-proof-success/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-proof-success" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Resume analysed!</h3>
        <p className="text-sm text-muted-foreground">Moving to the next step...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5 ${
          file ? "border-primary bg-primary/5" : "border-border"
        } ${errorMessage ? "border-destructive" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div className="text-left">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="ml-2 p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">Drop your resume here</p>
            <p className="text-sm text-muted-foreground">
              PDF or DOCX, up to 10MB
            </p>
          </>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive text-center">{errorMessage}</p>
      )}

      {state === "error" && (
        <div className="text-center">
          <Button variant="outline" onClick={reset} className="mr-2">
            Try again
          </Button>
        </div>
      )}

      {file && state === "idle" && (
        <Button onClick={handleUploadAndParse} className="w-full" size="lg">
          <FileText className="w-4 h-4 mr-2" />
          Upload & Analyse Resume
        </Button>
      )}

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
        <span>🔒</span>
        Your resume is encrypted and only visible to you. We never share your data.{" "}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
};
