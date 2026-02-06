import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for demo
const mockProfiles = [
  {
    id: "base",
    name: "Base Profile",
    slug: "sarah-chen",
    views: 247,
    lastViewed: "2 hours ago",
    isBase: true,
  },
  {
    id: "stripe",
    name: "Stripe PMM Role",
    slug: "sarah-chen/stripe-pmm",
    views: 18,
    lastViewed: "Yesterday",
    isBase: false,
  },
  {
    id: "linear",
    name: "Linear Growth Lead",
    slug: "sarah-chen/linear-growth",
    views: 12,
    lastViewed: "3 days ago",
    isBase: false,
  },
];

const Dashboard = () => {
  const [profiles] = useState(mockProfiles);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar p-4 flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-proof flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">Proof</span>
        </Link>

        {/* User Info */}
        <div className="p-3 rounded-xl bg-sidebar-accent mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-proof flex items-center justify-center text-white font-semibold">
              SC
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Sarah Chen</p>
              <p className="text-xs text-muted-foreground truncate">
                sarah.getproof.app
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Eye className="w-5 h-5" />
            <span className="text-sm font-medium">Profiles</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>

        {/* Upgrade Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-[hsl(262,83%,58%)]/10 border border-primary/20 mb-4">
          <p className="text-sm font-medium mb-1">Free Plan</p>
          <p className="text-xs text-muted-foreground mb-3">
            2 of 3 versions used
          </p>
          <Button variant="hero" size="sm" className="w-full">
            Upgrade to Pro
          </Button>
        </div>

        {/* Logout */}
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="p-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Your Profiles</h1>
              <p className="text-muted-foreground">
                Manage your base profile and job-specific versions
              </p>
            </div>
            <Link to="/onboarding">
              <Button variant="hero">
                <Plus className="w-5 h-5 mr-2" />
                New Version
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Views", value: "277", change: "+12% this week" },
              { label: "Unique Visitors", value: "156", change: "+8% this week" },
              { label: "Avg. Time", value: "2m 34s", change: "+15% this week" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-proof-success">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Profiles List */}
          <div className="space-y-4">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border bg-card ${
                  profile.isBase ? "border-primary/30 glow-sm" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        profile.isBase
                          ? "bg-gradient-proof"
                          : "bg-secondary"
                      }`}
                    >
                      {profile.isBase ? (
                        <span className="text-white font-bold">SC</span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">
                          v{index}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{profile.name}</h3>
                        {profile.isBase && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                            Base
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {profile.slug}.getproof.app
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Stats */}
                    <div className="text-right">
                      <p className="text-sm font-medium">{profile.views} views</p>
                      <p className="text-xs text-muted-foreground">
                        Last viewed {profile.lastViewed}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link to="/demo">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                          {!profile.isBase && (
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
