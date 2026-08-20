import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { streamText, APICallError } from "ai";
import { createLovableAiGatewayProvider, MODEL_ID } from "./ai-gateway.server";

const BASE_STYLE = `You are a senior workplace productivity assistant used by professionals.
Rules:
- Be clear, concise and business-professional.
- Use markdown: short headings, bullet lists, bold for key items.
- Never invent facts that were not provided; mark unknowns as "[needs confirmation]".
- No filler, no apologies, no mention of being an AI model.`;

async function run(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured (missing API key).");
  const gateway = createLovableAiGatewayProvider(key);
  try {
    const result = streamText({
      model: gateway(MODEL_ID),
      system: `${BASE_STYLE}\n\n${system}`,
      prompt,
    });
    return { text: await result.text };
  } catch (error) {
    if (APICallError.isInstance(error)) {
      const s = error.statusCode;
      if (s === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
      if (s === 402)
        throw new Error("AI credits are exhausted. Add credits in Lovable to keep generating.");
      if (s === 403) throw new Error("AI access is blocked for this workspace.");
      throw new Error(`AI request failed (${s ?? "error"}). ${error.message}`);
    }
    throw error;
  }
}

/* ---------------- Email generator ---------------- */

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        purpose: z.string().min(1),
        audience: z.string().min(1),
        tone: z.string().min(1),
        length: z.string().min(1),
        context: z.string().default(""),
      })
      .parse(d),
  )
  .handler(({ data }) =>
    run(
      `Task: write a workplace email.
Structure the output exactly as:
**Subject:** <subject line>

<email body>

---
**Alternative subject lines**
- three options`,
      `Purpose: ${data.purpose}
Audience: ${data.audience}
Tone: ${data.tone}
Desired length: ${data.length}
Extra context / details to include: ${data.context || "none"}`,
    ),
  );

/* ---------------- Meeting notes summarizer ---------------- */

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ notes: z.string().min(1), meetingType: z.string().default("General") }).parse(d),
  )
  .handler(({ data }) =>
    run(
      `Task: summarize raw meeting notes.
Output sections in this order:
## Summary (3-5 sentences)
## Key Points (bullets)
## Decisions Made (bullets, or "None recorded")
## Action Items (markdown table: Owner | Action | Deadline)
## Risks & Open Questions (bullets)
Infer deadlines only when explicitly stated; otherwise write "TBD".`,
      `Meeting type: ${data.meetingType}\n\nRaw notes:\n${data.notes}`,
    ),
  );

/* ---------------- Task planner ---------------- */

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        tasks: z.string().min(1),
        horizon: z.string().default("Today"),
        hours: z.string().default("8"),
      })
      .parse(d),
  )
  .handler(({ data }) =>
    run(
      `Task: prioritize and schedule work.
Output sections:
## Prioritized Tasks (table: # | Task | Priority (P1-P3) | Est. effort | Rationale) using Eisenhower urgency/impact reasoning
## Suggested Schedule (table: Time block | Focus | Notes) fitting the available hours, with breaks
## Deprioritize / Delegate (bullets)
## Focus Tip (one sentence)`,
      `Planning horizon: ${data.horizon}
Available working hours: ${data.hours}
Task list and constraints:
${data.tasks}`,
    ),
  );

/* ---------------- Research assistant ---------------- */

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        topic: z.string().min(1),
        depth: z.string().default("Overview"),
        audience: z.string().default("Business stakeholders"),
      })
      .parse(d),
  )
  .handler(({ data }) =>
    run(
      `Task: produce a research brief from your own knowledge.
Output sections:
## Executive Summary
## Key Insights (5 bullets)
## Opportunities & Risks (two short lists)
## Recommended Next Steps (numbered)
## Confidence & Caveats (state knowledge cut-off limits and where verification is required)
Do not fabricate statistics, citations or URLs.`,
      `Topic: ${data.topic}\nDepth: ${data.depth}\nAudience: ${data.audience}`,
    ),
  );

/* ---------------- Chatbot ---------------- */

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        messages: z.array(
          z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) }),
        ),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");
    const gateway = createLovableAiGatewayProvider(key);
    try {
      const result = streamText({
        model: gateway(MODEL_ID),
        system: `${BASE_STYLE}\n\nYou are the general workplace assistant of an AI productivity suite. Help with drafting, planning, summarizing and decision support. Ask a clarifying question when the request is ambiguous.`,
        messages: data.messages,
      });
      return { text: await result.text };
    } catch (error) {
      if (APICallError.isInstance(error)) {
        const s = error.statusCode;
        if (s === 429) throw new Error("Rate limit reached. Please wait a moment and try again.");
        if (s === 402) throw new Error("AI credits are exhausted. Add credits in Lovable.");
        if (s === 403) throw new Error("AI access is blocked for this workspace.");
      }
      throw error;
    }
  });
