"use client"

import { useState } from "react"
import Image from "next/image"
import { CalendarIcon, CircleHelpIcon, SparklesIcon } from "lucide-react"

import { BookVisitDialog } from "@/components/explore/book-visit-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { type Listing, type UserPreferences } from "@/lib/data"
import { cn } from "@/lib/utils"
import { getListingFit, type FitLevel } from "@/lib/listing-fit"

type ExploreListingCardProps = {
  listing: Listing
  preferences: UserPreferences | null
}

export function ExploreListingCard({
  listing,
  preferences,
}: ExploreListingCardProps) {
  const [bookOpen, setBookOpen] = useState(false)
  const scoped = preferences !== null
  const fit = scoped ? getListingFit(listing, preferences) : null

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="flex flex-row items-start gap-0">
          <div className="relative size-40 shrink-0 overflow-hidden bg-muted sm:size-44 md:size-48">
            <Image
              src={listing.imageUrl}
              alt={listing.imageAlt}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3 py-4">
            <CardHeader className="px-4 py-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-1">
                  <CardTitle>{listing.title}</CardTitle>
                  <CardDescription>{listing.location}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant="secondary">
                    €{listing.price.toLocaleString()}/month
                  </Badge>
                  {fit && <ConfidenceBadge level={fit.level} label={fit.label} />}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 px-4">
              {fit && (
                <div
                  className={cn(
                    "rounded-lg border p-3",
                    fitSurfaceClass(fit.level)
                  )}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <SparklesIcon className="size-3.5 shrink-0" />
                      Fit confidence
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                      {fit.label}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">{fit.summary}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{listing.size} m²</Badge>
                <Badge variant="outline">{listing.bedrooms} bed</Badge>
                <Badge variant="outline">Floor {listing.floor}</Badge>
                <Badge variant="outline">
                  {listing.elevator ? "Elevator" : "No elevator"}
                </Badge>
                {listing.balcony && <Badge variant="outline">Balcony</Badge>}
                <Badge variant="outline">{listing.pets}</Badge>
                <Badge variant="outline">From {listing.available}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {listing.highlights.map((h) => (
                  <Badge key={h} variant="secondary">
                    {h}
                  </Badge>
                ))}
              </div>

              {scoped && fit && fit.openUncertainties.length > 0 && (
                <>
                  <Separator />
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    <div className="mb-2 flex items-center gap-1.5 font-medium">
                      <CircleHelpIcon className="size-3.5 shrink-0" />
                      Your open uncertainties
                    </div>
                    <ul className="flex flex-col gap-1 text-muted-foreground">
                      {fit.openUncertainties.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  {listing.gaps.length > 0 && (
                    <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                      <p className="mb-2 font-medium">
                        Listing gaps already visible
                      </p>
                      <ul className="flex flex-col gap-1 text-muted-foreground">
                        {listing.gaps.map((gap) => (
                          <li key={gap}>• {gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              <div className="pt-1">
                <Button onClick={() => setBookOpen(true)}>
                  <CalendarIcon data-icon="inline-start" />
                  Book a visit
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>

      <BookVisitDialog
        listing={listing}
        preferences={preferences}
        open={bookOpen}
        onOpenChange={setBookOpen}
      />
    </>
  )
}

function fitSurfaceClass(level: FitLevel) {
  if (level === "high") {
    return "border-fit-high-foreground/20 bg-fit-high text-fit-high-foreground"
  }
  if (level === "medium") {
    return "border-fit-medium-foreground/20 bg-fit-medium text-fit-medium-foreground"
  }
  return "border-fit-low-foreground/20 bg-fit-low text-fit-low-foreground"
}

function ConfidenceBadge({
  level,
  label,
}: {
  level: FitLevel
  label: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        level === "high" && "bg-fit-high text-fit-high-foreground",
        level === "medium" && "bg-fit-medium text-fit-medium-foreground",
        (level === "low" || level === "poor") &&
          "bg-fit-low text-fit-low-foreground"
      )}
    >
      Fit · {label}
    </Badge>
  )
}
