import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, FileText, CalendarCheck, MessageSquare, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { useLocal, type Activity, defaultPrefs, type Prefs } from "@/lib/store";
import type { Task } from "./planner";
import type { Note } from "./meetings";
import { Disclaimer } from "@/components/AIResult";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your productivity overview: tasks, meeting summaries, recent activity and quick AI actions." },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Productivity statistics, recent activity and quick AI actions." },
    ],
  }),
  component: Dashboard,
});

const icons = { summary: FileText, plan: CalendarCheck, chat: MessageSquare };

function Dashboard() {
  const [tasks] = useLocal<Task[]>("wp.tasks", []);
  const [notes] = useLocal<Note[]>("wp.notes", []);
  const [activity] = useLocal<Activity[]>("wp.activity", []);
  const [prefs] = useLocal<Prefs>("wp.prefs", defaultPrefs);
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const dueSoon = tasks.filter((t) => !t.done && t.deadline && new Date(t.deadline).getTime() - Date.now() < 3 * 864e5).length;
  const chats = activity.filter((a) => a.type === "chat").length;

  const stats = [
    { label: "Tasks completed", value: `${done}/${tasks.length}`, sub: `${pct}% completion`, icon: CheckCircle2 },
    { label: "Due within 3 days", value: dueSoon, sub: "open tasks", icon: Clock },
    { label: "Meetings summarized", value: notes.length, sub: "saved summaries", icon: FileText },
    { label: "Assistant requests", value: chats, sub: "recent conversations", icon: MessageSquare },
  ];
  const actions = [
    { to: "/meetings", title: "Summarize a meeting", desc: "Turn raw notes into decisions & action items", icon: FileText },
    { to: "/planner", title: "Plan my week", desc: "Prioritise tasks into a realistic schedule", icon: CalendarCheck },
    { to: "/assistant", title: "Draft an email", desc: "Ask the assistant to write or improve text", icon: MessageSquare },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <LayoutDashboard className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Good to see you{prefs.name ? `, ${prefs.name}` : ""}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's your productivity at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-5">
        <div className="mb-2 flex justify-between text-sm"><span className="font-medium">Task progress</span><span className="text-muted-foreground">{pct}%</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-accent"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundImage: "var(--gradient-primary)" }} /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className="card-surface group flex items-center gap-4 p-4 transition-transform hover:-translate-y-0.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary"><a.icon className="h-5 w-5" /></span>
                <span className="flex-1"><span className="block text-sm font-semibold">{a.title}</span><span className="text-xs text-muted-foreground">{a.desc}</span></span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Recent activity</h2>
          <div className="card-surface divide-y divide-border">
            {activity.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No activity yet. Try a quick action to get started.</p>
            ) : (
              activity.slice(0, 7).map((a) => {
                const I = icons[a.type];
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3.5">
                    <I className="h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 truncate text-sm">{a.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{new Date(a.at).toLocaleDateString()}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
      <Disclaimer />
    </div>
  );
}
