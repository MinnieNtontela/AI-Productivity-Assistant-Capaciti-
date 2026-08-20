import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content: "Turn raw meeting notes into key points, decisions, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into key points, decisions, owners and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

const TYPES = [
  "General",
  "Client call",
  "Stand-up",
  "Project review",
  "Interview",
  "Board / executive",
];

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState(TYPES[0]!);

  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes, meetingType } }),
  });

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste transcript or rough notes — get a summary, decisions, action items with owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label>Meeting type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Raw notes or transcript</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Sarah: we agreed to ship the beta on the 14th. Tom to send pricing by Wednesday…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!notes.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Summarize notes
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Meeting summary"
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          {...(mutation.data ? { content: mutation.data.text } : {})}
          emptyHint="Your structured summary and action items will appear here."
        />
      </div>
    </AppShell>
  );
}
