import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  MoreHorizontal,
  Copy,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [profileRes, versionsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("profile_versions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (versionsRes.data) setVersions(versionsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const displayName = profile?.full_name || user?.email || "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg icon-gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">Proof</span>
        </Link>

        <div className="p-3 rounded-xl bg-sidebar-accent mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full icon-gradient-bg flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Profiles</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
          <p className="text-sm font-medium mb-1">
            {profile?.is_pro ? "Pro Plan" : "Free Plan"}
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {profile?.is_pro
              ? "Unlimited versions"
              : `${Math.min(versions.length, 3)} of 3 versions used`}
          </p>
          {!profile?.is_pro && (
            <Button size="sm" className="w-full">Upgrade to Pro</Button>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="p-8 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Your Profiles</h1>
              <p className="text-muted-foreground">
                {profile?.onboarding_completed
                  ? "Manage your base profile and job-specific versions"
                  : "Complete onboarding to create your first profile"}
              </p>
            </div>
            <Link to="/onboarding">
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                {profile?.onboarding_completed ? "New Version" : "Get Started"}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card animate-pulse h-24" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-2xl icon-gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No profiles yet</h2>
              <p className="text-muted-foreground mb-6">
                Complete the onboarding to generate your first Proof profile
              </p>
              <Link to="/onboarding">
                <Button size="lg">Start Onboarding</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border bg-card ${
                    version.is_default ? "border-primary/30" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          version.is_default ? "icon-gradient-bg" : "bg-secondary"
                        }`}
                      >
                        {version.is_default ? (
                          <span className="text-white font-bold">{initials}</span>
                        ) : (
                          <span className="text-muted-foreground font-mono text-xs">v{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{version.version_name}</h3>
                          {version.is_default && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">Base</span>
                          )}
                          {version.is_published && (
                            <span className="px-2 py-0.5 rounded-full bg-proof-success/20 text-proof-success text-xs font-medium">Published</span>
                          )}
                        </div>
                        {version.slug && (
                          <p className="text-sm text-muted-foreground font-mono">{version.slug}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/dashboard/edit-profile">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Sections
                        </Link>
                      </Button>
                      {version.slug && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/p/${version.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </a>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {version.slug && (
                            <DropdownMenuItem onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/p/${version.slug}`);
                              toast({ title: "Link copied!" });
                            }}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy link
                            </DropdownMenuItem>
                          )}
                          {!version.is_default && (
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
