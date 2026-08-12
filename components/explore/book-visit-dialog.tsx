"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, CheckCircle2Icon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { buyer, seller, type Listing, type UserPreferences } from "@/lib/data"
import { getListingFit } from "@/lib/listing-fit"

type BookVisitDialogProps = {
  listing: Listing
  preferences: UserPreferences | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ShareKey = "household" | "budget" | "timeline" | "pet" | "musts"

const contextDefaults = {
  household: true,
  budget: true,
  timeline: true,
  pet: true,
  musts: true,
  note: "We're a quiet couple with a small dog, looking for a bright place near metro for a September move-in. Happy to visit if the pet terms work.",
}

export function BookVisitDialog({
  listing,
  preferences,
  open,
  onOpenChange,
}: BookVisitDialogProps) {
  const [sent, setSent] = useState(false)
  const [context, setContext] = useState(contextDefaults)

  const fit = preferences ? getListingFit(listing, preferences) : null
  const fitLabel = fit?.label ?? "Medium"

  const shareFields: {
    key: ShareKey
    label: string
    description: string
  }[] = [
    {
      key: "household",
      label: "Household",
      description: buyer.household,
    },
    {
      key: "budget",
      label: "Budget ceiling",
      description: `Up to €${buyer.budgetMax}/month`,
    },
    {
      key: "timeline",
      label: "Move-in timing",
      description: buyer.moveIn,
    },
    {
      key: "pet",
      label: "Pet disclosure",
      description: "Small dog (~8 kg)",
    },
    {
      key: "musts",
      label: "Key requirements",
      description: "Elevator, 2 bedrooms, size, transport",
    },
  ]

  useEffect(() => {
    if (!open) {
      setSent(false)
      setContext(contextDefaults)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {sent ? "Visit request sent" : "Request a visit"}
          </DialogTitle>
          <DialogDescription>
            {sent
              ? `${seller.name} received your shared context with this request.`
              : `Share context for ${listing.title} so the owner can qualify interest before accepting.`}
          </DialogDescription>
        </DialogHeader>

        {!sent ? (
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Include with your request</FieldLegend>
              {shareFields.map((field) => (
                <Field key={field.key} orientation="horizontal">
                  <Checkbox
                    id={`book-${field.key}-${listing.id}`}
                    checked={context[field.key]}
                    onCheckedChange={(value) =>
                      setContext((c) => ({
                        ...c,
                        [field.key]: value === true,
                      }))
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`book-${field.key}-${listing.id}`}>
                      {field.label}
                    </FieldLabel>
                    <FieldDescription>{field.description}</FieldDescription>
                  </FieldContent>
                </Field>
              ))}
            </FieldSet>

            <Field>
              <FieldLabel htmlFor={`book-note-${listing.id}`}>
                Short note to {seller.name}
              </FieldLabel>
              <Textarea
                id={`book-note-${listing.id}`}
                rows={3}
                value={context.note}
                onChange={(e) =>
                  setContext((c) => ({ ...c, note: e.target.value }))
                }
              />
              <FieldDescription>
                Sent with the visit request — not a full application.
              </FieldDescription>
            </Field>
          </FieldGroup>
        ) : (
          <div className="flex flex-col gap-4">
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Request delivered</AlertTitle>
              <AlertDescription>
                {seller.name} can accept or decline with your household context —
                not a cold inquiry.
              </AlertDescription>
            </Alert>

            <Card size="sm">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  Seller preview
                </Badge>
                <CardTitle>Visit request from {buyer.name}</CardTitle>
                <CardDescription>{listing.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">Fit · {fitLabel}</Badge>
                  {context.pet && (
                    <Badge variant="secondary">Has small dog</Badge>
                  )}
                  {context.timeline && (
                    <Badge variant="secondary">{buyer.moveIn}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">&ldquo;{context.note}&rdquo;</p>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {!sent ? (
            <>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={() => setSent(true)}>
                <CalendarIcon data-icon="inline-start" />
                Book visit
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
