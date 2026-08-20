import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageSquare, Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/AiOutput";
import { chatWithAssistant } from "@/lib/ai.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — AI Workplace Assistant" },
      {
        name: "description",
        content: "Chat with an AI assistant for drafting, planning and decision support at work.",
      },
      { property: "og:title", content: "Assistant Chat" },
      {
        property: "og:description",
        content: "Chat with an AI assistant for drafting, planning and decision support at work.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to a meeting request politely",
  "Turn these bullet points into a status update",
  "What should I prioritize with 3 hours left today?",
];

function ChatPage() {
  const fn = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (next: Msg[]) => fn({ data: { messages: next } }),
    onSuccess: (res) => setMessages((m) => [...m, { role: "assistant", content: res.text }]),
    onError: (e: Error) => setError(e.message),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessageSquare}
        title="Assistant Chat"
        description="A general-purpose workplace assistant that keeps the full conversation in context."
      />

      <Card className="flex h-[62vh] min-h-[420px] flex-col overflow-hidden p-0 shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-md py-10 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">
                Ask anything about your work day. Try one of these:
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "md-output max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
                }
              >
                {m.role === "user" ? (
                  m.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </div>
          )}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t bg-card p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
              className="max-h-40 min-h-11 resize-none"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              disabled={!input.trim() || mutation.isPending}
              onClick={() => send(input)}
              aria-label="Send message"
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
      <Disclaimer />
    </AppShell>
  );
}
