import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VoiceMemoProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceMemo = ({ onTranscript, disabled }: VoiceMemoProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const updateLevels = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);

    const bucketSize = Math.floor(data.length / 20);
    const levels = Array.from({ length: 20 }, (_, i) => {
      const slice = data.slice(i * bucketSize, (i + 1) * bucketSize);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      return avg / 255;
    });
    setAudioLevels(levels);
    animFrameRef.current = requestAnimationFrame(updateLevels);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analysis for waveform
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setAudioLevels(Array(20).fill(0));

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(blob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);

      updateLevels();
    } catch (err) {
      console.error("Microphone access error:", err);
      toast({
        title: "Microphone access required",
        description: "Please allow microphone access to record a voice memo.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "voice-memo.webm");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      if (data.text) {
        onTranscript(data.text);
      } else {
        toast({
          title: "No speech detected",
          description: "We couldn't detect any speech. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast({
        title: "Transcription failed",
        description: "Could not transcribe your recording. Please type your answer instead.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isTranscribing) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Transcribing your voice memo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/5 border border-destructive/20"
          >
            {/* Waveform */}
            <div className="flex items-center gap-0.5 h-8 flex-1">
              {audioLevels.map((level, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-destructive/70"
                  animate={{ height: Math.max(4, level * 32) }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>

            <span className="text-sm font-mono text-destructive font-medium min-w-[40px]">
              {formatTime(duration)}
            </span>

            <Button
              size="sm"
              variant="destructive"
              onClick={stopRecording}
              className="gap-1.5"
            >
              <Square className="w-3.5 h-3.5" />
              Stop
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startRecording}
              disabled={disabled}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Mic className="w-4 h-4" />
              Record voice memo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
