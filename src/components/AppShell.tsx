import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, CalendarCheck, MessageSquare, Settings, Zap } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 backdrop-blur md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)" }}>
            <Zap className="h-5 w-5" />
          </span>
          <span className="font-display text-sm font-bold leading-tight text-foreground">
            AI Workplace
            <br />
            <span className="font-medium text-muted-foreground">Productivity Assistant</span>
          </span>
        </Link>
        <nav className="space-y-1">
          {nav.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted"}`}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <p className="mt-auto px-2 text-[11px] leading-relaxed text-muted-foreground">Your data stays in this browser. AI output should always be reviewed.</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border bg-card/95 py-2 backdrop-blur md:hidden">
        {nav.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-0.5 px-2 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              <n.icon className="h-5 w-5" />
              {n.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: typeof Zap }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
