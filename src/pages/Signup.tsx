import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";


const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { key: "hasLength", text: "At least 8 characters", met: password.length >= 8 },
    { key: "hasLetter", text: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    { key: "hasNumber", text: "Contains a number", met: /\d/.test(password) },
  ];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="space-y-2 pt-2"
    >
      {requirements.map((req) => (
        <div
          key={req.key}
          className={`flex items-center gap-2 text-sm ${
            req.met ? "text-proof-success" : "text-muted-foreground"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              req.met ? "bg-proof-success/20" : "bg-muted"
            }`}
          >
            {req.met && <Check className="w-3 h-3" />}
          </div>
          {req.text}
        </div>
      ))}
    </motion.div>
  );
};

const SignupFeatureList = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="relative z-10 max-w-md"
  >
    <h2 className="text-3xl font-bold mb-6">What you'll get</h2>
    <ul className="space-y-4">
      {[
        "AI-powered content extraction from your resume",
        "Interactive interview to surface your best stories",
        "Beautiful, responsive profile hosted for free",
        "Unlimited job-tailored versions (Pro)",
        "Analytics to see who's viewing your profile",
      ].map((feature, index) => (
        <motion.li
          key={feature}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          className="flex items-start gap-3"
        >
          <div className="w-6 h-6 rounded-full bg-proof-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-proof-success" />
          </div>
          <span className="text-foreground/80">{feature}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [marketingOptedIn, setMarketingOptedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      toast({ title: "You already have a profile!", description: "Redirecting to your dashboard." });
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate, toast]);

  const isPasswordValid =
    password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    setIsLoading(true);
    const { error } = await signUp(email, password, name, {
      marketing_opted_in: marketingOptedIn,
    });
    setIsLoading(false);

    if (error) {
      const isExisting = error.message?.toLowerCase().includes("already registered") || 
                         error.message?.toLowerCase().includes("already been registered");
      toast({ 
        title: isExisting ? "Account already exists" : "Signup failed", 
        description: isExisting 
          ? "An account with this email already exists. Log in instead?" 
          : error.message, 
        variant: "destructive" 
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We sent you a confirmation link. Please verify your email to continue.",
      });
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl icon-gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
            Click the link to verify your account and get started.
          </p>
          <Link to="/login">
            <Button variant="outline">Back to sign in</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl icon-gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">Proof</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Start building your professional identity in minutes
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-muted/50 border-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <PasswordRequirements password={password} />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="marketing"
                checked={marketingOptedIn}
                onCheckedChange={(checked) => setMarketingOptedIn(checked === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="marketing"
                  className="text-sm font-normal text-foreground cursor-pointer leading-snug"
                >
                  I'd like to receive product updates, tips, and occasional emails from Proof
                </Label>
                <p className="text-xs text-muted-foreground">
                  You can unsubscribe anytime. See our{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || !isPasswordValid}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>

          <p className="text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.03]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <SignupFeatureList />
      </div>
    </div>
  );
};

export default Signup;
