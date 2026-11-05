import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Plus, Sparkle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { AIResult, Disclaimer, ErrorNote, Thinking } from "@/components/AIResult";
import { runAI } from "@/lib/ai.functions";
import { getPrefs, logActivity, useLocal } from "@/lib/store";

export type Task = { id: string; title: string; priority: "High" | "Medium" | "Low"; deadline: string; hours: string; done: boolean };

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Task Planner — AI Workplace Productivity Assistant" },
      { name: "description", content: "Add tasks, priorities and deadlines and get an AI-prioritised daily or weekly schedule." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Practical daily and weekly schedules generated from your tasks." },
    ],
  }),
  component: Planner,
});

const prClass = { High: "bg-destructive/10 text-destructive", Medium: "bg-accent text-accent-foreground", Low: "bg-muted text-muted-foreground" };

function Planner() {
  const [tasks, setTasks] = useLocal<Task[]>("wp.tasks", []);
  const [plan, setPlan] = useLocal("wp.plan", "");
  const [horizon, setHorizon] = useState<"daily" | "weekly">("daily");
  const [form, setForm] = useState({ title: "", priority: "Medium" as Task["priority"], deadline: "", hours: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ error: string; setup?: boolean } | null>(null);

  const open = tasks.filter((t) => !t.done);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks((t) => [...t, { ...form, title: form.title.trim(), id: crypto.randomUUID(), done: false }]);
    setForm({ title: "", priority: "Medium", deadline: "", hours: "" });
  }

  async function generate() {
    setBusy(true);
    setErr(null);
    const prefs = getPrefs();
    const list = open.map((t, i) => `${i + 1}. ${t.title} | priority: ${t.priority} | deadline: ${t.deadline || "none"} | estimated effort: ${t.hours ? t.hours + "h" : "unknown"}`).join("\n");
    const text = `Create a ${horizon} plan. Workday starts at ${prefs.workStart}.\nTasks:\n${list}`;
    const res = await runAI({ data: { feature: "plan", text, prefs } }).catch((e) => ({ ok: false as const, error: String(e.message ?? e) }));
    setBusy(false);
    if (!res.ok) return setErr(res);
    setPlan(res.text);
    logActivity({ type: "plan", title: `Generated ${horizon} plan for ${open.length} tasks` });
  }

  return (
    <div>
      <PageHeader icon={CalendarCheck} title="Task Planner" subtitle="Add your tasks and let AI build a prioritised, realistic schedule." />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <form onSubmit={add} className="card-surface space-y-3 p-5">
            <input className="field" placeholder="Task, e.g. Prepare Q4 budget deck" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-3 gap-2">
              <select className="field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <input className="field" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} aria-label="Deadline" />
              <input className="field" type="number" min="0" step="0.5" placeholder="Hours" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
            </div>
            <button className="btn-primary w-full" type="submit"><Plus className="h-4 w-4" /> Add task</button>
          </form>
          <div className="card-surface divide-y divide-border">
            {tasks.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No tasks yet. Add a few above, then generate your plan.</p>
            ) : (
              tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3">
                  <input type="checkbox" className="h-4 w-4 accent-primary" checked={t.done} onChange={() => setTasks((l) => l.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.deadline ? `Due ${new Date(t.deadline).toLocaleDateString()}` : "No deadline"}{t.hours ? ` · ${t.hours}h` : ""}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${prClass[t.priority]}`}>{t.priority}</span>
                  <button aria-label="Delete task" className="text-muted-foreground hover:text-destructive" onClick={() => setTasks((l) => l.filter((x) => x.id !== t.id))}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="card-surface space-y-4 p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-lg bg-accent p-1">
              {(["daily", "weekly"] as const).map((h) => (
                <button key={h} onClick={() => setHorizon(h)} className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize ${horizon === h ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>{h}</button>
              ))}
            </div>
            <button className="btn-primary" disabled={busy || open.length === 0} onClick={generate}><Sparkle className="h-4 w-4" /> {busy ? "Planning…" : `Generate ${horizon} plan`}</button>
          </div>
          {busy ? <Thinking label="Prioritising and scheduling your tasks…" /> : err ? <ErrorNote {...err} /> : plan ? (
            <AIResult text={plan} onChange={setPlan} onRegenerate={generate} busy={busy} />
          ) : (
            <div className="py-14 text-center">
              <CalendarCheck className="mx-auto h-10 w-10 text-primary/40" />
              <p className="mt-3 font-medium">No plan yet</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">Add tasks with priorities and deadlines, choose daily or weekly, and generate.</p>
            </div>
          )}
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
