import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { generateEmail } from "@/lib/ai.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content: "Generate professional workplace emails tailored by tone, audience and length.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate professional workplace emails tailored by tone, audience and length.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Persuasive", "Direct", "Apologetic", "Formal"];
const AUDIENCES = ["Client", "Manager", "Team", "Executive", "Vendor", "New prospect"];
const LENGTHS = ["Short (under 100 words)", "Medium (100-200 words)", "Detailed (200-350 words)"];

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState(TONES[0]!);
  const [audience, setAudience] = useState(AUDIENCES[0]!);
  const [length, setLength] = useState(LENGTHS[1]!);

  const mutation = useMutation({
    mutationFn: () => fn({ data: { purpose, context, tone, audience, length } }),
  });

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the goal of your email and get a ready-to-send draft with subject line options."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="purpose">What is the email about?</Label>
              <Input
                id="purpose"
                placeholder="Follow up on the Q3 proposal and request a decision"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Key details to include (optional)</Label>
              <Textarea
                id="context"
                rows={5}
                placeholder="Deadline is Friday, budget approved at $40k, cc the finance lead…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!purpose.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Generate email
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Draft email"
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          {...(mutation.data ? { content: mutation.data.text } : {})}
          emptyHint="Your generated email will appear here."
        />
      </div>
    </AppShell>
  );
}
