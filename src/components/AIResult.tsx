import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Pencil, RefreshCw, Eye, AlertTriangle, Loader2 } from "lucide-react";

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-accent/60 px-3 py-2 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      AI-generated content may contain errors or omissions. Review and verify it before making workplace decisions.
    </p>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ai">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function ErrorNote({ error, setup }: { error: string; setup?: boolean }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <p className="font-semibold text-destructive">{setup ? "AI setup required" : "Something went wrong"}</p>
      <p className="mt-1 text-muted-foreground">{error}</p>
    </div>
  );
}

export function Thinking({ label = "Generating with AI…" }: { label?: string }) {
  return (
    <div className="space-y-3 p-1">
      <div className="flex items-center gap-2 text-sm text-primary">
        <Loader2 className="h-4 w-4 animate-spin" /> {label}
      </div>
      {[90, 75, 82, 60].map((w, i) => (
        <div key={i} className="h-3 animate-pulse rounded-full bg-accent" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export function AIResult({ text, onChange, onRegenerate, busy }: { text: string; onChange: (t: string) => void; onRegenerate: () => void; busy: boolean }) {
  const [edit, setEdit] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={() => setEdit((e) => !e)}>
          {edit ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />} {edit ? "Preview" : "Edit"}
        </button>
        <button
          className="btn-ghost"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button className="btn-ghost" onClick={onRegenerate} disabled={busy}>
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /> Regenerate
        </button>
      </div>
      {edit ? (
        <textarea className="field min-h-[420px] font-mono text-xs" value={text} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Markdown>{text}</Markdown>
      )}
    </div>
  );
}
