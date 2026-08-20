import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { researchTopic } from "@/lib/ai.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content: "Get structured research briefs with insights, risks, and recommended next steps.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Get structured research briefs with insights, risks, and recommended next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Overview", "Standard brief", "Deep dive"];

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState(DEPTHS[1]!);
  const [audience, setAudience] = useState("Business stakeholders");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { topic, depth, audience } }),
  });

  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask about a market, tool, competitor or concept and receive a structured brief you can share."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Research question or topic</Label>
              <Textarea
                id="topic"
                rows={7}
                placeholder="How are mid-size logistics firms adopting AI for route planning?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPTHS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aud">Audience</Label>
                <Input id="aud" value={audience} onChange={(e) => setAudience(e.target.value)} />
              </div>
            </div>
            <Button
              className="w-full"
              disabled={!topic.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Research topic
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Research brief"
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          {...(mutation.data ? { content: mutation.data.text } : {})}
          emptyHint="Your research brief will appear here. Always verify facts and figures independently."
        />
      </div>
    </AppShell>
  );
}
