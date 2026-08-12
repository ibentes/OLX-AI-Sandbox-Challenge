"use client"

import { useMemo, useState } from "react"

import { ExploreListingCard } from "@/components/explore/explore-listing-card"
import { PreferencesPanel } from "@/components/explore/preferences-panel"
import { AppHeader } from "@/components/shared/app-header"
import {
  defaultDraftPreferences,
  listings,
  type UserPreferences,
} from "@/lib/data"
import { rankListings } from "@/lib/listing-fit"

export function ExplorePage() {
  const [draft, setDraft] = useState<UserPreferences>(defaultDraftPreferences)
  const [saved, setSaved] = useState<UserPreferences | null>(null)
  const [prefsOpen, setPrefsOpen] = useState(true)

  const displayListings = useMemo(() => {
    if (!saved) {
      return listings.map((listing) => ({ listing, fit: null }))
    }
    return rankListings(listings, saved)
  }, [saved])

  return (
    <div className="flex min-h-full flex-col bg-background">
      <AppHeader current="explore" />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">Explore</h1>
          <p className="text-sm text-muted-foreground">
            {saved
              ? "Listings ranked by fit confidence based on your preferences."
              : "Browse listings below. Save preferences to score and sort them for you."}
          </p>
        </div>

        <PreferencesPanel
          draft={draft}
          saved={saved}
          open={prefsOpen}
          onOpenChange={setPrefsOpen}
          onDraftChange={setDraft}
          onSave={() => setSaved({ ...draft })}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold tracking-tight">
              {saved ? "Listings for you" : "Listings"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {displayListings.length} places in Lisbon
              {saved
                ? " · sorted by fit confidence"
                : " · not yet scoped to your preferences"}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {displayListings.map(({ listing }) => (
              <ExploreListingCard
                key={listing.id}
                listing={listing}
                preferences={saved}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
