"use client"

import { useEffect, useState } from "react"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CircleHelpIcon,
  SparklesIcon,
  XCircleIcon,
} from "lucide-react"

import { ListingCard } from "@/components/shared/listing-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { buyer, fitEvaluation, type FitStatus } from "@/lib/scenario"
import { cn } from "@/lib/utils"

type Step = "priorities" | "analyzing" | "result"

const defaultSelected = new Set<string>([
  ...buyer.priorities.map((p) => p.id),
  ...buyer.dealBreakers.map((d) => d.id),
])

export function FitCheckConcept() {
  const [step, setStep] = useState<Step>("priorities")
  const [selected, setSelected] = useState<Set<string>>(defaultSelected)
  const [progress, setProgress] = useState(0)
  const [decision, setDecision] = useState<"visit" | "skip" | null>(null)

  useEffect(() => {
    if (step !== "analyzing") return
    setProgress(0)
    const ticks = [18, 42, 67, 88, 100]
    let i = 0
    const id = setInterval(() => {
      setProgress(ticks[i] ?? 100)
      i += 1
      if (i >= ticks.length) {
        clearInterval(id)
        setTimeout(() => setStep("result"), 350)
      }
    }, 280)
    return () => clearInterval(id)
  }, [step])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function reset() {
    setStep("priorities")
    setSelected(defaultSelected)
    setProgress(0)
    setDecision(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <ConceptIntro
        title="Pre-Visit Fit Check"
        blurb="Sofia states what matters. AI evaluates the listing against those preferences and returns a clear visit recommendation."
      />

      <ListingCard compact />

      {step === "priorities" && (
        <Card>
          <CardHeader>
            <CardTitle>What matters for this decision?</CardTitle>
            <CardDescription>
              Confirm Sofia&apos;s priorities and deal-breakers. AI will score the
              Arroios listing only against what you keep selected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Priorities</FieldLegend>
                <div className="flex flex-col gap-3">
                  {buyer.priorities.map((p) => (
                    <Field key={p.id} orientation="horizontal">
                      <Checkbox
                        id={`prio-${p.id}`}
                        checked={selected.has(p.id)}
                        onCheckedChange={() => toggle(p.id)}
                      />
                      <FieldLabel htmlFor={`prio-${p.id}`}>
                        {p.label}
                        <Badge variant="outline" className="ml-2">
                          {p.weight}
                        </Badge>
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
              </FieldSet>
              <Separator />
              <FieldSet>
                <FieldLegend>Deal-breakers</FieldLegend>
                <FieldDescription>
                  Any confirmed deal-breaker should stop the visit path.
                </FieldDescription>
                <div className="flex flex-col gap-3">
                  {buyer.dealBreakers.map((d) => (
                    <Field key={d.id} orientation="horizontal">
                      <Checkbox
                        id={`db-${d.id}`}
                        checked={selected.has(d.id)}
                        onCheckedChange={() => toggle(d.id)}
                      />
                      <FieldLabel htmlFor={`db-${d.id}`}>{d.label}</FieldLabel>
                    </Field>
                  ))}
                </div>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button
              disabled={selected.size === 0}
              onClick={() => setStep("analyzing")}
            >
              <SparklesIcon data-icon="inline-start" />
              Run fit check
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "analyzing" && (
        <Card>
          <CardHeader>
            <CardTitle>AI is checking fit</CardTitle>
            <CardDescription>
              Comparing the listing facts against Sofia&apos;s selected criteria…
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={progress}>
              <ProgressLabel>Evaluating listing</ProgressLabel>
              <ProgressValue />
            </Progress>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>Checking hard requirements (budget, size, bedrooms, elevator)</li>
              <li>Scoring preferences (light, balcony, transport, timing)</li>
              <li>Flagging unknowns that affect visit confidence</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {step === "result" && (
        <div className="flex flex-col gap-4">
          <Alert>
            <SparklesIcon />
            <AlertTitle>
              Fit score {fitEvaluation.score}/100 — {fitEvaluation.verdict}
            </AlertTitle>
            <AlertDescription>{fitEvaluation.summary}</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Criterion-by-criterion</CardTitle>
              <CardDescription>
                AI verdict for each selected preference. Unknowns are called out
                instead of guessed.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {fitEvaluation.criteria
                .filter(
                  (c) =>
                    selected.has(c.id) ||
                    (c.id === "elevator" && selected.has("no-elevator"))
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <StatusIcon status={c.status} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{c.label}</span>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{c.detail}</p>
                      <p className="text-xs text-muted-foreground">
                        Source: {c.source}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button
                variant={decision === "visit" ? "default" : "outline"}
                onClick={() => setDecision("visit")}
              >
                Book a visit
              </Button>
              <Button
                variant={decision === "skip" ? "default" : "outline"}
                onClick={() => setDecision("skip")}
              >
                Not worth visiting
              </Button>
              <Button variant="ghost" onClick={reset}>
                Restart fit check
              </Button>
            </CardFooter>
          </Card>

          {decision === "visit" && (
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Visit path chosen</AlertTitle>
              <AlertDescription>
                Prototype outcome: Sofia proceeds with a visit while treating pet
                terms and nighttime noise as things to verify on-site.
              </AlertDescription>
            </Alert>
          )}
          {decision === "skip" && (
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Visit declined</AlertTitle>
              <AlertDescription>
                Prototype outcome: Sofia skips this listing until quieter / clearer
                pet-friendly options appear.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}

function ConceptIntro({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="max-w-2xl text-sm text-muted-foreground">{blurb}</p>
    </div>
  )
}

function StatusIcon({ status }: { status: FitStatus }) {
  const className = "mt-0.5 shrink-0"
  if (status === "match") return <CheckCircle2Icon className={className} />
  if (status === "mismatch") return <XCircleIcon className={className} />
  if (status === "partial") return <AlertCircleIcon className={className} />
  return <CircleHelpIcon className={className} />
}

function StatusBadge({ status }: { status: FitStatus }) {
  const label =
    status === "match"
      ? "Match"
      : status === "partial"
        ? "Partial"
        : status === "mismatch"
          ? "Mismatch"
          : "Unknown"
  return (
    <Badge
      variant={status === "mismatch" ? "destructive" : "secondary"}
      className={cn(status === "unknown" && "opacity-80")}
    >
      {label}
    </Badge>
  )
}
