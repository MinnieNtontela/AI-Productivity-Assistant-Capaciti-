import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { planTasks } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content: "Prioritize your task list and get a realistic, time-blocked working schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritize your task list and get a realistic, time-blocked working schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week", "Next two weeks"];

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState(HORIZONS[0]!);
  const [hours, setHours] = useState("8");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { tasks, horizon, hours } }),
  });

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="List everything on your plate — the assistant prioritizes it and builds a schedule that fits your hours."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Planning horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HORIZONS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Available hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={80}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks, deadlines and constraints</Label>
              <Textarea
                id="tasks"
                rows={14}
                placeholder={
                  "- Finish client proposal (due Thursday)\n- Review 3 pull requests\n- Prep board slides\n- 1:1 with Ana at 14:00"
                }
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!tasks.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Build my plan
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Prioritized plan"
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          {...(mutation.data ? { content: mutation.data.text } : {})}
          emptyHint="Your prioritized task list and schedule will appear here."
        />
      </div>
    </AppShell>
  );
}
