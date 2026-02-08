import {
  User, FileText, Mail, Briefcase, Target, Clock, Quote, Award,
  Image, Building2, Rocket, Heart, Mic, TrendingUp, GitBranch,
  Users, DollarSign, Code, Cpu, GitMerge, BookOpen, Trophy,
  Building, BarChart3, MessageSquare, Layout,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  User, FileText, Mail, Briefcase, Target, Clock, Quote, Award,
  Image, Building2, Rocket, Heart, Mic, TrendingUp, GitBranch,
  Users, DollarSign, Code, Cpu, GitMerge, BookOpen, Trophy,
  Building, BarChart3, MessageSquare, Layout,
};

interface SectionIconProps {
  iconName: string;
  className?: string;
}

export const SectionIcon = ({ iconName, className = "w-4 h-4" }: SectionIconProps) => {
  const Icon = iconMap[iconName] || Layout;
  return <Icon className={className} />;
};
