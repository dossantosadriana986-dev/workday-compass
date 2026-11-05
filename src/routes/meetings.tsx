import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { AIResult, Disclaimer, ErrorNote, Thinking } from "@/components/AIResult";
import { runAI } from "@/lib/ai.functions";
import { getPrefs, logActivity, useLocal } from "@/lib/store";

export type Note = { id: string; title: string; notes: string; summary: string; at: number };

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — AI Workplace Productivity Assistant" },
      { name: "description", content: "Paste meeting notes to get summaries, key decisions, action items, owners and deadlines." },
      { property: "og:title", content: "AI Meeting Notes Summarizer" },
      { property: "og:description", content: "Structured summaries, decisions and action items from raw meeting notes." },
    ],
  }),
  component: Meetings,
});

function Meetings() {
  const [saved, setSaved] = useLocal<Note[]>("wp.notes", []);
  const [draft, setDraft] = useLocal("wp.notesDraft", { title: "", notes: "" });
  const [current, setCurrent] = useState<Note | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ error: string; setup?: boolean } | null>(null);

  async function generate(notes = draft.notes, title = draft.title, id?: string) {
    setBusy(true);
    setErr(null);
    const res = await runAI({ data: { feature: "summarize", text: notes, prefs: getPrefs() } }).catch((e) => ({ ok: false as const, error: String(e.message ?? e) }));
    setBusy(false);
    if (!res.ok) return setErr(res);
    const note: Note = { id: id ?? crypto.randomUUID(), title: title.trim() || `Meeting ${new Date().toLocaleDateString()}`, notes, summary: res.text, at: Date.now() };
    setCurrent(note);
    setSaved((s) => [note, ...s.filter((n) => n.id !== note.id)]);
    if (!id) logActivity({ type: "summary", title: `Summarized: ${note.title}` });
  }

  function updateSummary(t: string) {
    if (!current) return;
    const n = { ...current, summary: t };
    setCurrent(n);
    setSaved((s) => s.map((x) => (x.id === n.id ? n : x)));
  }

  return (
    <div>
      <PageHeader icon={FileText} title="Meeting Summarizer" subtitle="Paste raw notes or a transcript — get decisions, action items, owners and deadlines." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface space-y-4 p-5">
          <input className="field" placeholder="Meeting title (optional)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <textarea
            className="field min-h-[320px]"
            placeholder={"Paste your meeting notes here…\n\ne.g. Sprint review 4 Nov — Sarah: launch moved to 18 Nov. James to fix checkout bug by Friday. Budget for ads approved at R50k…"}
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{draft.notes.length.toLocaleString()} characters</span>
            <button className="btn-primary" disabled={busy || draft.notes.trim().length < 20} onClick={() => generate()}>
              <Sparkle className="h-4 w-4" /> {busy ? "Summarizing…" : "Generate summary"}
            </button>
          </div>
          <Disclaimer />
        </div>
        <div className="card-surface min-h-[300px] p-5">
          {busy ? (
            <Thinking label="Analysing your meeting notes…" />
          ) : err ? (
            <ErrorNote {...err} />
          ) : current ? (
            <>
              <h2 className="mb-3 text-lg font-semibold">{current.title}</h2>
              <AIResult text={current.summary} onChange={updateSummary} busy={busy} onRegenerate={() => generate(current.notes, current.title, current.id)} />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-primary/40" />
              <p className="mt-3 font-medium">Your summary will appear here</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">Include names, dates and decisions in your notes for the most accurate action items.</p>
            </div>
          )}
        </div>
      </div>
      {saved.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Saved summaries</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((n) => (
              <div key={n.id} className={`card-surface flex items-start gap-3 p-4 ${current?.id === n.id ? "ring-2 ring-ring" : ""}`}>
                <button className="min-w-0 flex-1 text-left" onClick={() => { setCurrent(n); setErr(null); }}>
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(n.at).toLocaleString()}</p>
                </button>
                <button aria-label="Delete summary" className="text-muted-foreground hover:text-destructive" onClick={() => { setSaved((s) => s.filter((x) => x.id !== n.id)); if (current?.id === n.id) setCurrent(null); }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
