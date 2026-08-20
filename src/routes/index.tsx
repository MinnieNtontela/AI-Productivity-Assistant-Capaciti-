import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/AiOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Automate Daily Work" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan tasks and research topics with an AI assistant built for professionals.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan tasks and research topics with an AI assistant built for professionals.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Write polished emails tuned to tone, audience and length.",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    text: "Turn messy notes into key points, decisions and action items.",
  },
  {
    to: "/planner",
    icon: ListChecks,
    title: "AI Task Planner",
    text: "Prioritize your workload and get a realistic time-blocked schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    text: "Get structured briefs with insights, risks and next steps.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "Assistant Chat",
    text: "Ask anything work-related in an ongoing conversation.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <section className="surface-gradient mb-10 rounded-2xl border p-6 shadow-card sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" /> Powered by Lovable AI
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          Automate your daily work with an AI teammate
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Five focused assistants for the work that eats your day: writing, summarizing, planning
          and researching — each using structured prompts for professional, ready-to-use output.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/email">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/chat">Open assistant chat</Link>
          </Button>
        </div>
      </section>

      <h2 className="mb-4 text-lg font-semibold">Workspaces</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ to, icon: Icon, title, text }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-card">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Disclaimer />
    </AppShell>
  );
}
