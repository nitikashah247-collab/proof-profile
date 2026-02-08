import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Profile not found</h1>
          <p className="text-muted-foreground mb-8">
            This profile doesn't exist or hasn't been published yet.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Basic public profile view */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-2xl icon-gradient-bg flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-2xl shadow-primary/20">
            {profile.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "?"}
          </div>
          <h1 className="text-4xl font-bold mb-2">{profile.full_name}</h1>
          {profile.headline && (
            <p className="text-xl text-muted-foreground mb-4">{profile.headline}</p>
          )}
          {profile.location && (
            <p className="text-muted-foreground mb-6">{profile.location}</p>
          )}
          {profile.bio && (
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </motion.div>
      </div>

      {/* Proof Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-5 h-5 rounded icon-gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">P</span>
          </div>
          <span className="text-sm font-medium">Made with Proof</span>
        </Link>
      </div>
    </div>
  );
};

export default PublicProfile;
