"use client"

import { useMemo, useState } from "react"
import {
  MessageSquareIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { buyer, gapQuestions, property, seller } from "@/lib/scenario"

type Phase = "scan" | "gaps" | "compose" | "sent"

export function ListingInterrogatorConcept() {
  const [phase, setPhase] = useState<Phase>("scan")
  const [scanning, setScanning] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(gapQuestions.filter((q) => q.defaultSelected).map((q) => q.id))
  )
  const [note, setNote] = useState(
    "Hi Miguel — we're interested in visiting, but need a few clarifications first."
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [visitIntent, setVisitIntent] = useState<"wait" | "visit" | null>(null)

  const selectedQuestions = useMemo(
    () => gapQuestions.filter((q) => selected.has(q.id)),
    [selected]
  )

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function runScan() {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setPhase("gaps")
    }, 900)
  }

  function reset() {
    setPhase("scan")
    setScanning(false)
    setSelected(
      new Set(gapQuestions.filter((q) => q.defaultSelected).map((q) => q.id))
    )
    setVisitIntent(null)
  }

  const messageBody = [
    note.trim(),
    "",
    ...selectedQuestions.map((q, i) => `${i + 1}. ${q.question}`),
    "",
    `— ${buyer.name}`,
  ].join("\n")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          AI Listing Interrogator
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          AI does not score the home. It finds what the listing fails to specify
          for Sofia, then helps her send targeted questions to {seller.name}{" "}
          before deciding on a visit.
        </p>
      </div>

      <ListingCard />

      {phase === "scan" && (
        <Card>
          <CardHeader>
            <CardTitle>Scan for missing information</CardTitle>
            <CardDescription>
              AI will compare Sofia&apos;s uncertainties against what this listing
              actually discloses.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="mb-2 font-medium">Sofia&apos;s open uncertainties</p>
              <ul className="flex flex-col gap-1 text-muted-foreground">
                {buyer.uncertainties.map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <p className="mb-2 font-medium">Listing gaps already visible</p>
              <ul className="flex flex-col gap-1 text-muted-foreground">
                {property.gaps.map((g) => (
                  <li key={g}>• {g}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={scanning} onClick={runScan}>
              {scanning ? (
                <>
                  <SearchIcon data-icon="inline-start" />
                  Scanning listing…
                </>
              ) : (
                <>
                  <SparklesIcon data-icon="inline-start" />
                  Find gaps that matter to me
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {(phase === "gaps" || phase === "compose" || phase === "sent") && (
        <Card>
          <CardHeader>
            <CardTitle>Gaps worth clarifying</CardTitle>
            <CardDescription>
              Select the questions that would change Sofia&apos;s visit decision.
              Deselect anything she can live without for now.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {gapQuestions.map((q) => (
              <label
                key={q.id}
                className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[[data-slot=checkbox][data-checked]]:border-foreground/30"
              >
                <Checkbox
                  checked={selected.has(q.id)}
                  onCheckedChange={() => toggle(q.id)}
                  disabled={phase === "sent"}
                  className="mt-0.5"
                />
                <FieldContent>
                  <div className="flex flex-wrap items-center gap-2">
                    <FieldTitle>{q.topic}</FieldTitle>
                    <PriorityBadge priority={q.priority} />
                  </div>
                  <FieldDescription>{q.whyItMatters}</FieldDescription>
                  <p className="mt-1 text-sm">&ldquo;{q.question}&rdquo;</p>
                </FieldContent>
              </label>
            ))}
          </CardContent>
          {phase === "gaps" && (
            <CardFooter className="flex flex-wrap gap-2">
              <Button
                disabled={selected.size === 0}
                onClick={() => setPhase("compose")}
              >
                <MessageSquareIcon data-icon="inline-start" />
                Draft questions to seller
              </Button>
              <Button variant="ghost" onClick={reset}>
                Rescan
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {phase === "compose" && (
        <Card>
          <CardHeader>
            <CardTitle>Message to {seller.name}</CardTitle>
            <CardDescription>
              AI assembled a short ask from the gaps you selected. Edit freely
              before sending.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="intro-note">Intro note</FieldLabel>
              <Textarea
                id="intro-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </Field>
            <Separator />
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Preview ({selectedQuestions.length} question
                {selectedQuestions.length === 1 ? "" : "s"})
              </p>
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {messageBody}
              </pre>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={() => setPreviewOpen(true)}>
              <SendIcon data-icon="inline-start" />
              Send to seller
            </Button>
            <Button variant="ghost" onClick={() => setPhase("gaps")}>
              Back to gaps
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send questions?</DialogTitle>
            <DialogDescription>
              Mock send only — no real messaging. This advances the prototype to
              the post-ask decision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              onClick={() => {
                setPreviewOpen(false)
                setPhase("sent")
              }}
            >
              Confirm send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {phase === "sent" && (
        <div className="flex flex-col gap-4">
          <Alert>
            <SendIcon />
            <AlertTitle>Questions sent to {seller.name}</AlertTitle>
            <AlertDescription>
              {selectedQuestions.length} clarification
              {selectedQuestions.length === 1 ? "" : "s"} queued. Sofia can wait
              for answers or still book a visit if she prefers to verify in person.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Decision after clarifying</CardTitle>
              <CardDescription>
                The AI&apos;s job ended at gap discovery. The visit choice is
                Sofia&apos;s.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
              <Button
                variant={visitIntent === "wait" ? "default" : "outline"}
                onClick={() => setVisitIntent("wait")}
              >
                Wait for seller replies
              </Button>
              <Button
                variant={visitIntent === "visit" ? "default" : "outline"}
                onClick={() => setVisitIntent("visit")}
              >
                Visit anyway
              </Button>
              <Button variant="ghost" onClick={reset}>
                Start over
              </Button>
            </CardFooter>
          </Card>
          {visitIntent && (
            <Alert>
              <SparklesIcon />
              <AlertTitle>
                {visitIntent === "wait"
                  ? "Holding visit decision"
                  : "Visit booked with open questions"}
              </AlertTitle>
              <AlertDescription>
                {visitIntent === "wait"
                  ? "Prototype outcome: Sofia reduces uncertainty async before committing travel time."
                  : "Prototype outcome: questions still go to Miguel, and Sofia uses the visit to verify the rest."}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}

function PriorityBadge({
  priority,
}: {
  priority: "critical" | "important" | "nice"
}) {
  const label =
    priority === "critical"
      ? "Critical for Sofia"
      : priority === "important"
        ? "Important"
        : "Nice to know"
  return (
    <Badge variant={priority === "critical" ? "default" : "secondary"}>
      {label}
    </Badge>
  )
}
