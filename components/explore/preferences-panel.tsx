"use client"

import { ChevronDownIcon, PencilIcon, SparklesIcon } from "lucide-react"

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import {
  dealBreakerOptions,
  preferenceOptions,
  type UserPreferences,
} from "@/lib/data"
import { cn } from "@/lib/utils"

type PreferencesPanelProps = {
  draft: UserPreferences
  saved: UserPreferences | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDraftChange: (next: UserPreferences) => void
  onSave: () => void
}

export function PreferencesPanel({
  draft,
  saved,
  open,
  onOpenChange,
  onDraftChange,
  onSave,
}: PreferencesPanelProps) {
  const isFirstTime = saved === null
  const summaryLabels = saved
    ? [
        ...preferenceOptions
          .filter((p) => saved.priorityIds.includes(p.id))
          .map((p) => p.label),
        ...dealBreakerOptions
          .filter((d) => saved.dealBreakerIds.includes(d.id))
          .map((d) => `No: ${d.label}`),
      ]
    : []

  function togglePriority(id: string) {
    const has = draft.priorityIds.includes(id)
    onDraftChange({
      ...draft,
      priorityIds: has
        ? draft.priorityIds.filter((x) => x !== id)
        : [...draft.priorityIds, id],
    })
  }

  function toggleDealBreaker(id: string) {
    const has = draft.dealBreakerIds.includes(id)
    onDraftChange({
      ...draft,
      dealBreakerIds: has
        ? draft.dealBreakerIds.filter((x) => x !== id)
        : [...draft.dealBreakerIds, id],
    })
  }

  const canSave =
    draft.priorityIds.length > 0 || draft.dealBreakerIds.length > 0

  return (
    <Collapsible
      open={isFirstTime ? true : open}
      onOpenChange={(next) => {
        if (isFirstTime) return
        onOpenChange(next)
      }}
    >
      <Card className="bg-preference-surface text-preference-surface-foreground ring-foreground/5">
        {!isFirstTime && (
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="size-4 shrink-0" />
                  <CardTitle>Your search preferences</CardTitle>
                </div>
                <CardDescription>
                  AI uses these to help you evaluate listings. Edit anytime.
                </CardDescription>
              </div>
              <CollapsibleTrigger
                render={
                  <Button variant="outline" size="sm">
                    {open ? (
                      <>
                        Close
                        <ChevronDownIcon data-icon="inline-end" />
                      </>
                    ) : (
                      <>
                        <PencilIcon data-icon="inline-start" />
                        Edit preferences
                      </>
                    )}
                  </Button>
                }
              />
            </div>
            {!open && (
              <div className="flex flex-wrap gap-1.5">
                {summaryLabels.slice(0, 6).map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
                {summaryLabels.length > 6 && (
                  <Badge variant="outline">+{summaryLabels.length - 6} more</Badge>
                )}
              </div>
            )}
          </CardHeader>
        )}

        <CollapsibleContent>
          {isFirstTime && (
            <CardHeader>
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4 shrink-0" />
                <CardTitle>What matters for your search?</CardTitle>
              </div>
              <CardDescription>
                First time here — tell us your priorities and deal-breakers. AI
                will use these when you explore listings. You can change them
                later.
              </CardDescription>
            </CardHeader>
          )}

          <CardContent className={cn(!isFirstTime && "pt-0")}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Priorities</FieldLegend>
                <div className="flex flex-col gap-3">
                  {preferenceOptions.map((p) => (
                    <Field key={p.id} orientation="horizontal">
                      <Checkbox
                        id={`explore-prio-${p.id}`}
                        checked={draft.priorityIds.includes(p.id)}
                        onCheckedChange={() => togglePriority(p.id)}
                      />
                      <FieldLabel htmlFor={`explore-prio-${p.id}`}>
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
                  Listings that clearly hit a deal-breaker should be easy to skip.
                </FieldDescription>
                <div className="flex flex-col gap-3">
                  {dealBreakerOptions.map((d) => (
                    <Field key={d.id} orientation="horizontal">
                      <Checkbox
                        id={`explore-db-${d.id}`}
                        checked={draft.dealBreakerIds.includes(d.id)}
                        onCheckedChange={() => toggleDealBreaker(d.id)}
                      />
                      <FieldLabel htmlFor={`explore-db-${d.id}`}>
                        {d.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter className="border-foreground/5 bg-background/50">
            <Button
              disabled={!canSave}
              onClick={() => {
                onSave()
                onOpenChange(false)
              }}
            >
              <SparklesIcon data-icon="inline-start" />
              {isFirstTime ? "Save preferences" : "Save changes"}
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
