"use client"

import { useEffect, useState } from "react"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleHelpIcon,
  HomeIcon,
  SparklesIcon,
  UserIcon,
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
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  buyer,
  mutualMatchAssessment,
  property,
  seller,
  type FitStatus,
} from "@/lib/scenario"

type Step = "context" | "assessing" | "review" | "submitted" | "seller"

const contextDefaults = {
  household: true,
  budget: true,
  timeline: true,
  pet: true,
  musts: true,
  note: "We're a quiet couple with a small dog, looking for a bright place near metro for a September move-in. Happy to visit if the pet terms work.",
}

export function MutualMatchConcept() {
  const [step, setStep] = useState<Step>("context")
  const [context, setContext] = useState(contextDefaults)
  const [progress, setProgress] = useState(0)
  const [sellerDecision, setSellerDecision] = useState<
    "accept" | "decline" | null
  >(null)

  useEffect(() => {
    if (step !== "assessing") return
    setProgress(0)
    const ticks = [20, 45, 70, 100]
    let i = 0
    const id = setInterval(() => {
      setProgress(ticks[i] ?? 100)
      i += 1
      if (i >= ticks.length) {
        clearInterval(id)
        setTimeout(() => setStep("review"), 300)
      }
    }, 260)
    return () => clearInterval(id)
  }, [step])

  function reset() {
    setStep("context")
    setContext(contextDefaults)
    setProgress(0)
    setSellerDecision(null)
  }

  const sharedItems = [
    context.household && `Household: ${buyer.household}`,
    context.budget && `Budget ceiling: €${buyer.budgetMax}/month`,
    context.timeline && `Target move-in: ${buyer.moveIn}`,
    context.pet && "Has small dog (~8 kg) — needs pet confirmation",
    context.musts &&
      "Must-haves: elevator, 2 bedrooms, ≥65 m², near transport",
  ].filter(Boolean) as string[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Mutual Match Request
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A visit request becomes a lightweight two-sided qualification. Sofia
          shares context, AI assesses buyer↔property fit, and {seller.name} sees
          useful signal before accepting.
        </p>
      </div>

      <ListingCard compact />

      {step === "context" && (
        <Card>
          <CardHeader>
            <CardTitle>Share context for a mutual match</CardTitle>
            <CardDescription>
              Choose what {seller.name} should see with the visit request. This is
              not a full application — just enough to qualify interest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Include in request</FieldLegend>
                <ShareToggle
                  id="household"
                  label="Household"
                  description={buyer.household}
                  checked={context.household}
                  onChange={(v) => setContext((c) => ({ ...c, household: v }))}
                />
                <ShareToggle
                  id="budget"
                  label="Budget ceiling"
                  description={`Up to €${buyer.budgetMax}/month`}
                  checked={context.budget}
                  onChange={(v) => setContext((c) => ({ ...c, budget: v }))}
                />
                <ShareToggle
                  id="timeline"
                  label="Move-in timing"
                  description={buyer.moveIn}
                  checked={context.timeline}
                  onChange={(v) => setContext((c) => ({ ...c, timeline: v }))}
                />
                <ShareToggle
                  id="pet"
                  label="Pet disclosure"
                  description="Small dog (~8 kg)"
                  checked={context.pet}
                  onChange={(v) => setContext((c) => ({ ...c, pet: v }))}
                />
                <ShareToggle
                  id="musts"
                  label="Key requirements"
                  description="Elevator, 2 bedrooms, size, transport"
                  checked={context.musts}
                  onChange={(v) => setContext((c) => ({ ...c, musts: v }))}
                />
              </FieldSet>
              <Field>
                <FieldLabel htmlFor="buyer-note">Short note to seller</FieldLabel>
                <Textarea
                  id="buyer-note"
                  rows={3}
                  value={context.note}
                  onChange={(e) =>
                    setContext((c) => ({ ...c, note: e.target.value }))
                  }
                />
                <FieldDescription>
                  Visible to {seller.name} with the match request.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setStep("assessing")}>
              <SparklesIcon data-icon="inline-start" />
              Assess mutual fit
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "assessing" && (
        <Card>
          <CardHeader>
            <CardTitle>AI assessing mutual fit</CardTitle>
            <CardDescription>
              Checking Sofia ↔ {property.title} compatibility before the request
              is shown to the seller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress}>
              <ProgressLabel>Buyer / property match</ProgressLabel>
              <ProgressValue />
            </Progress>
          </CardContent>
        </Card>
      )}

      {(step === "review" || step === "submitted" || step === "seller") && (
        <div className="flex flex-col gap-4">
          <Alert>
            <SparklesIcon />
            <AlertTitle>
              Mutual fit {mutualMatchAssessment.buyerFitScore}/100
            </AlertTitle>
            <AlertDescription>
              {mutualMatchAssessment.sellerValueNote}
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon />
                  <CardTitle>Sofia&apos;s side</CardTitle>
                </div>
                <CardDescription>
                  What she would share with this visit request.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {sharedItems.map((item) => (
                  <div key={item} className="rounded-md border px-3 py-2">
                    {item}
                  </div>
                ))}
                <div className="rounded-md border bg-muted/40 px-3 py-2 text-muted-foreground">
                  &ldquo;{context.note}&rdquo;
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HomeIcon />
                  <CardTitle>AI fit signals</CardTitle>
                </div>
                <CardDescription>
                  Shared assessment both sides can trust as a starting point.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {mutualMatchAssessment.signals.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start gap-2 rounded-md border p-3"
                  >
                    <SignalIcon status={s.status} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{s.label}</span>
                        <Badge variant="secondary">{statusLabel(s.status)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{s.note}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {step === "review" && (
            <Card>
              <CardHeader>
                <CardTitle>Send mutual match request?</CardTitle>
                <CardDescription>
                  This is the visit ask — packaged with context so Miguel can
                  accept qualified interest, not a cold inquiry.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2">
                <Button onClick={() => setStep("submitted")}>
                  Request visit with match context
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button variant="ghost" onClick={reset}>
                  Edit context
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {step === "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle>Request sent</CardTitle>
            <CardDescription>
              Prototype next step: peek at the lightweight seller view Miguel
              would see — not a full seller product.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={() => setStep("seller")}>
              View as {seller.name}
            </Button>
            <Button variant="ghost" onClick={reset}>
              Start over
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "seller" && (
        <Card className="border-dashed">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Seller preview · {seller.name}
            </Badge>
            <CardTitle>Visit request from {buyer.name}</CardTitle>
            <CardDescription>
              AI mutual-fit summary for {property.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Fit {mutualMatchAssessment.buyerFitScore}/100</Badge>
              <Badge variant="secondary">September 1 target</Badge>
              {context.pet && <Badge variant="secondary">Has small dog</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              {mutualMatchAssessment.sellerValueNote}
            </p>
            <Separator />
            <div className="flex flex-col gap-2 text-sm">
              {sharedItems.map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
            <blockquote className="border-l-2 pl-3 text-sm text-muted-foreground">
              {context.note}
            </blockquote>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              variant={sellerDecision === "accept" ? "default" : "outline"}
              onClick={() => setSellerDecision("accept")}
            >
              <CheckCircle2Icon data-icon="inline-start" />
              Accept visit
            </Button>
            <Button
              variant={sellerDecision === "decline" ? "default" : "outline"}
              onClick={() => setSellerDecision("decline")}
            >
              Decline
            </Button>
            <Button variant="ghost" onClick={reset}>
              Reset prototype
            </Button>
          </CardFooter>
          {sellerDecision && (
            <CardContent>
              <Alert>
                <CheckCircle2Icon />
                <AlertTitle>
                  {sellerDecision === "accept"
                    ? "Visit accepted"
                    : "Visit declined"}
                </AlertTitle>
                <AlertDescription>
                  {sellerDecision === "accept"
                    ? "Prototype outcome: Miguel accepts a qualified visit with pet terms still to confirm in person."
                    : "Prototype outcome: Miguel declines — e.g. if pets are a hard no — saving both sides a wasted visit."}
                </AlertDescription>
              </Alert>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

function ShareToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
      />
      <div className="flex flex-col gap-0.5">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </div>
    </Field>
  )
}

function SignalIcon({ status }: { status: FitStatus }) {
  if (status === "match") return <CheckCircle2Icon className="mt-0.5 shrink-0" />
  return <CircleHelpIcon className="mt-0.5 shrink-0" />
}

function statusLabel(status: FitStatus) {
  if (status === "match") return "Aligned"
  if (status === "partial") return "Partial"
  if (status === "mismatch") return "Risk"
  return "Open"
}
