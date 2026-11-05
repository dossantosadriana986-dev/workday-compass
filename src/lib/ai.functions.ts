import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };
type Input = {
  feature: "summarize" | "plan" | "chat";
  text: string;
  history?: Msg[];
  prefs?: { name?: string; role?: string; tone?: string };
};

const PROMPTS: Record<Input["feature"], string> = {
  summarize: `You are an expert executive assistant. Analyse the meeting notes provided and produce a precise, contextual summary in Markdown using EXACTLY these sections:
## Summary
(3-5 sentences capturing purpose, context and outcome — reference real names, numbers and topics from the notes)
## Key Decisions
(bulleted; only decisions actually made)
## Action Items
(a Markdown table with columns: Action | Owner | Deadline | Priority. Use "Unassigned" / "Not specified" when the notes don't say — never invent people or dates)
## Open Questions & Risks
(bulleted)
## Suggested Next Steps
(2-4 bullets)
Do not add generic filler. If the notes are too short or unclear, say what is missing.`,
  plan: `You are a senior productivity coach and planner. Using the tasks, priorities, deadlines and the requested horizon supplied, build a realistic schedule in Markdown:
## Prioritisation
(Table: Task | Priority | Deadline | Urgency/Importance quadrant | Rationale)
## Schedule
(For a daily plan: time blocks from the start of the workday with focus blocks and short breaks. For a weekly plan: a section per day with time blocks. Place high-priority and near-deadline tasks first, batch similar work, include buffer time, and respect deadlines relative to today's date.)
## Risks & Conflicts
(flag overloaded days, impossible deadlines, dependencies)
## Tips
(2-3 specific tips for THIS workload)
Be concrete; reference each task by name. Never drop a task.`,
  chat: `You are a professional AI workplace assistant. You answer workplace questions, draft professional emails, improve writing, and help solve work problems. Be specific to the user's situation, ask a brief clarifying question only when essential, and format with Markdown (headings, bullets, or a ready-to-send email block with Subject line). Keep a warm, professional tone.`,
};

function extractText(res: unknown): string {
  const r = res as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (typeof r.output_text === "string" && r.output_text) return r.output_text;
  return (r.output ?? [])
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text" && c.text)
    .map((c) => c.text)
    .join("\n");
}

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((d: Input) => {
    if (!d || !["summarize", "plan", "chat"].includes(d.feature)) throw new Error("Invalid feature");
    if (typeof d.text !== "string" || !d.text.trim()) throw new Error("Please provide some input.");
    if (d.text.length > 40000) throw new Error("Input is too long (max 40,000 characters).");
    return d;
  })
  .handler(async ({ data }): Promise<{ ok: true; text: string } | { ok: false; error: string; setup?: boolean }> => {
    if (!process.env["LOVABLE_API_KEY"]) {
      return { ok: false, setup: true, error: "AI is not configured. Connect the Lovable AI gateway (LOVABLE_API_KEY) to enable AI features." };
    }
    const { generateResponse, GatewayError, PaymentRequiredError, RateLimitError } = await import("@lovable.dev/ai-gateway");
    const p = data.prefs ?? {};
    const ctx = `Today's date: ${new Date().toDateString()}.${p.name ? ` User name: ${p.name}.` : ""}${p.role ? ` User role: ${p.role}.` : ""}${p.tone ? ` Preferred tone: ${p.tone}.` : ""}`;
    const history = (data.history ?? []).slice(-20).map((m) => ({ role: m.role, content: m.content }));
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions: `${PROMPTS[data.feature]}\n\n${ctx}`,
        input: [...history, { role: "user" as const, content: data.text }],
      });
      const text = extractText(res).trim();
      if (!text) return { ok: false, error: "The AI returned an empty response. Please try again." };
      return { ok: true, text };
    } catch (e) {
      if (e instanceof PaymentRequiredError) return { ok: false, error: "AI credits are exhausted. Please top up your workspace credits." };
      if (e instanceof RateLimitError) return { ok: false, error: "Too many requests right now. Please wait a moment and try again." };
      if (e instanceof GatewayError) return { ok: false, error: `AI request failed: ${e.message}` };
      console.error(e);
      return { ok: false, error: "Unexpected error contacting the AI service." };
    }
  });
