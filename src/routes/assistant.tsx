import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Briefcase, Copy, RefreshCw, Trash2, Check } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Disclaimer, ErrorNote, Markdown, Thinking } from "@/components/AIResult";
import { runAI } from "@/lib/ai.functions";
import { getPrefs, logActivity, useLocal } from "@/lib/store";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — AI Workplace Productivity Assistant" },
      { name: "description", content: "Chat with an AI workplace assistant to draft emails, improve writing and solve work problems." },
      { property: "og:title", content: "AI Workplace Chatbot" },
      { property: "og:description", content: "Draft emails, improve writing and get answers to workplace questions." },
    ],
  }),
  component: Assistant,
});

const starters = [
  "Draft a polite email asking my manager for a deadline extension on the Q4 report",
  "Improve this sentence: 'we was not able to finish the thing because of reasons'",
  "How do I handle a colleague who keeps interrupting me in meetings?",
  "Give me an agenda for a 30-minute project kickoff",
];

function Assistant() {
  const [msgs, setMsgs] = useLocal<Msg[]>("wp.chat", []);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ error: string; setup?: boolean } | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, busy]);

  async function send(text: string, history: Msg[]) {
    if (!text.trim() || busy) return;
    setErr(null);
    setMsgs([...history, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    const res = await runAI({ data: { feature: "chat", text, history, prefs: getPrefs() } }).catch((e) => ({ ok: false as const, error: String(e.message ?? e) }));
    setBusy(false);
    if (!res.ok) return setErr(res);
    setMsgs([...history, { role: "user", content: text }, { role: "assistant", content: res.text }]);
    if (history.length === 0) logActivity({ type: "chat", title: `Asked: ${text.slice(0, 60)}` });
  }

  function regenerate() {
    const lastUser = [...msgs].map((m, i) => ({ m, i })).reverse().find((x) => x.m.role === "user");
    if (lastUser) send(lastUser.m.content, msgs.slice(0, lastUser.i));
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col md:h-[calc(100vh-5rem)]">
      <div className="flex items-start justify-between gap-3">
        <PageHeader icon={MessageSquare} title="AI Assistant" subtitle="Ask workplace questions, draft emails, and polish your writing." />
        {msgs.length > 0 && <button className="btn-ghost shrink-0" onClick={() => { setMsgs([]); setErr(null); }}><Trash2 className="h-4 w-4" /> Clear</button>}
      </div>
      <div className="card-surface flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {msgs.length === 0 && !busy && (
            <div className="py-8 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-primary/40" />
              <p className="mt-3 font-medium">How can I help with your work today?</p>
              <div className="mx-auto mt-5 grid max-w-2xl gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => send(s, [])} className="rounded-xl border border-border bg-muted/50 p-3 text-left text-sm hover:bg-accent">{s}</button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-primary-foreground" style={{ backgroundImage: "var(--gradient-primary)" }}>{m.content}</div>
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"><Briefcase className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <Markdown>{m.content}</Markdown>
                  <div className="mt-2 flex gap-2">
                    <button className="btn-ghost" onClick={async () => { await navigator.clipboard.writeText(m.content); setCopied(i); setTimeout(() => setCopied(null), 1500); }}>
                      {copied === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied === i ? "Copied" : "Copy"}
                    </button>
                    {i === msgs.length - 1 && <button className="btn-ghost" onClick={regenerate} disabled={busy}><RefreshCw className="h-3.5 w-3.5" /> Regenerate</button>}
                  </div>
                </div>
              </div>
            ),
          )}
          {busy && <Thinking label="Thinking…" />}
          {err && <ErrorNote {...err} />}
          <div ref={end} />
        </div>
        <form className="flex items-end gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); send(input, msgs); }}>
          <textarea
            className="field max-h-40 min-h-[44px] resize-none"
            rows={1}
            placeholder="Ask anything about work… (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input, msgs); } }}
          />
          <button className="btn-primary h-11 w-11 shrink-0 !p-0" disabled={busy || !input.trim()} aria-label="Send"><Send className="h-4 w-4" /></button>
        </form>
      </div>
      <div className="mt-3"><Disclaimer /></div>
    </div>
  );
}
