
-- Create interview_responses table for storing adaptive interview Q&A
CREATE TABLE public.interview_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_category TEXT NOT NULL,
  response_text TEXT,
  response_method TEXT DEFAULT 'text' CHECK (response_method IN ('voice', 'text')),
  audio_url TEXT,
  skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- Users can view their own responses
CREATE POLICY "Users can view own interview responses"
ON public.interview_responses FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own responses
CREATE POLICY "Users can create own interview responses"
ON public.interview_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own interview responses"
ON public.interview_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own interview responses"
ON public.interview_responses FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_interview_responses_user_profile ON public.interview_responses(user_id, profile_id);
