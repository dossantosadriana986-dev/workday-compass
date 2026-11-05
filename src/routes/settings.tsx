import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, Save, Trash2, Check } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Disclaimer } from "@/components/AIResult";
import { defaultPrefs, type Prefs, useLocal } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      { name: "description", content: "Personalise AI responses with your name, role, tone and workday start time." },
      { property: "og:title", content: "Settings — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Personalise how the AI assistant writes and plans for you." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const [prefs, setPrefs] = useLocal<Prefs>("wp.prefs", defaultPrefs);
  const [form, setForm] = useState<Prefs | null>(null);
  const [saved, setSaved] = useState(false);
  const f = form ?? prefs;
  const set = (k: keyof Prefs, v: string) => setForm({ ...f, [k]: v });

  return (
    <div className="max-w-2xl">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Personalise how the AI writes and plans for you. Stored only in this browser." />
      <div className="card-surface space-y-4 p-6">
        <label className="block text-sm font-medium">Your name<input className="field mt-1.5" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Adriana" /></label>
        <label className="block text-sm font-medium">Job role<input className="field mt-1.5" value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Marketing Manager" /></label>
        <label className="block text-sm font-medium">Preferred tone
          <select className="field mt-1.5" value={f.tone} onChange={(e) => set("tone", e.target.value)}>
            {["Professional", "Friendly", "Concise", "Formal", "Persuasive"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Workday starts at<input type="time" className="field mt-1.5" value={f.workStart} onChange={(e) => set("workStart", e.target.value)} /></label>
        <button className="btn-primary" onClick={() => { setPrefs(f); setForm(null); setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? "Saved" : "Save preferences"}
        </button>
      </div>
      <div className="card-surface mt-6 space-y-3 p-6">
        <h2 className="font-semibold">Data</h2>
        <p className="text-sm text-muted-foreground">Tasks, meeting summaries, chats and preferences are saved locally in your browser.</p>
        <button className="btn-ghost" onClick={() => { if (confirm("Delete all locally saved data?")) { Object.keys(localStorage).filter((k) => k.startsWith("wp.")).forEach((k) => localStorage.removeItem(k)); location.reload(); } }}>
          <Trash2 className="h-4 w-4" /> Clear all data
        </button>
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
