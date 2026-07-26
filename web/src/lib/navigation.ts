import { BookOpen, GitBranch, BarChart3, Settings, Home, Mic } from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Courses", href: "/courses", icon: BookOpen },
  { title: "Repositories", href: "/repos", icon: GitBranch },
  { title: "Interview", href: "/interview", icon: Mic },
  { title: "Progress", href: "/progress", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export const xpValues = {
  LESSON_COMPLETE: 25,
  QUIZ_PASS: 50,
  QUIZ_PERFECT: 100,
  REPO_ANALYZE: 75,
  INTERVIEW_PASS: 150,
} as const;
