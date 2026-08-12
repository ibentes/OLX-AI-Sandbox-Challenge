import { type Listing, type UserPreferences } from "@/lib/data"

export type FitLevel = "high" | "medium" | "low" | "poor"

export type ListingFit = {
  score: number
  level: FitLevel
  label: string
  summary: string
  /** Uncertainties that matter for this user + listing */
  openUncertainties: string[]
  hitDealBreakers: string[]
}

function petFriendly(pets: string) {
  const lower = pets.toLowerCase()
  if (lower.includes("not allowed")) return "no"
  if (lower.includes("cats only")) return "no-dogs"
  if (lower.includes("welcome") || lower.includes("allowed")) return "yes"
  if (lower.includes("considered")) return "maybe"
  return "unknown"
}

function scoreListing(listing: Listing, prefs: UserPreferences): ListingFit {
  let score = 55
  const hitDealBreakers: string[] = []
  const openUncertainties: string[] = []

  const wants = new Set(prefs.priorityIds)
  const breaks = new Set(prefs.dealBreakerIds)

  if (breaks.has("over-budget") && listing.price > 1550) {
    hitDealBreakers.push("More than €1,550/month")
    score -= 35
  } else if (wants.has("budget")) {
    score += listing.price <= 1550 ? 10 : -12
  }

  if (breaks.has("under-2bed") && listing.bedrooms < 2) {
    hitDealBreakers.push("Less than 2 bedrooms")
    score -= 30
  } else if (wants.has("bedrooms")) {
    score += listing.bedrooms >= 2 ? 8 : -15
  }

  if (breaks.has("no-elevator") && !listing.elevator) {
    hitDealBreakers.push("No elevator")
    score -= 30
  } else if (listing.elevator) {
    score += 6
  }

  if (wants.has("size")) {
    score += listing.size >= 65 ? 8 : -10
  }

  if (wants.has("balcony")) {
    score += listing.balcony ? 6 : -8
    if (listing.balcony) {
      openUncertainties.push(
        "Whether the balcony is suitable / safe for a small dog"
      )
    }
  }

  if (wants.has("pets")) {
    const pets = petFriendly(listing.pets)
    if (pets === "yes") score += 10
    else if (pets === "maybe") {
      score += 2
      openUncertainties.push(
        "Exact pet conditions (deposit, restrictions)"
      )
    } else if (pets === "no" || pets === "no-dogs") {
      score -= 20
      openUncertainties.push("Pets appear restricted — confirm if dogs are possible")
    } else {
      openUncertainties.push("Pet policy is unclear from the listing")
    }
  }

  if (wants.has("quiet")) {
    score -= 2
    openUncertainties.push(
      listing.id === "estrela-2bed-002"
        ? "Courtyard is quieter on paper — nighttime noise still unverified"
        : "Actual nighttime noise on this street / building"
    )
  }

  if (wants.has("light")) {
    if (listing.description.toLowerCase().includes("bright") || listing.description.toLowerCase().includes("sunny")) {
      score += 5
      openUncertainties.push(
        "Natural light claimed, but room orientation isn’t specified"
      )
    } else {
      openUncertainties.push("Natural light quality is hard to judge from the listing")
      score -= 3
    }
  }

  if (wants.has("transport")) {
    const hasTransportHint = listing.highlights.some((h) =>
      /metro|tram|walk/i.test(h)
    )
    if (hasTransportHint) score += 6
    else {
      openUncertainties.push("Exact walking time to public transport not listed")
      score -= 2
    }
  }

  if (wants.has("movein")) {
    if (/september\s*1/i.test(listing.available)) score += 6
    else if (/september/i.test(listing.available)) score += 2
    else score -= 4
  }

  // Listing-specific gaps that map to Sofia’s classic uncertainties
  for (const gap of listing.gaps) {
    if (/bedroom/i.test(gap) && wants.has("bedrooms")) {
      openUncertainties.push("Bedroom dimensions and usable space")
    }
  }

  // Deduplicate uncertainties
  const uniqueUncertainties = [...new Set(openUncertainties)]

  score = Math.max(5, Math.min(96, score))

  if (hitDealBreakers.length > 0) {
    score = Math.min(score, 38)
  }

  const level: FitLevel =
    score >= 75 ? "high" : score >= 55 ? "medium" : score >= 40 ? "low" : "poor"

  const label =
    level === "high"
      ? "High"
      : level === "medium"
        ? "Medium"
        : level === "low"
          ? "Low"
          : "Poor"

  const summary =
    hitDealBreakers.length > 0
      ? `Hits deal-breaker${hitDealBreakers.length > 1 ? "s" : ""}: ${hitDealBreakers.join(", ")}.`
      : uniqueUncertainties.length > 0
        ? `Looks compatible on paper, with ${uniqueUncertainties.length} open question${uniqueUncertainties.length === 1 ? "" : "s"} still affecting confidence.`
        : "Aligns well with the preferences you’ve set."

  return {
    score,
    level,
    label,
    summary,
    openUncertainties: uniqueUncertainties,
    hitDealBreakers,
  }
}

export function getListingFit(
  listing: Listing,
  prefs: UserPreferences
): ListingFit {
  return scoreListing(listing, prefs)
}

export function rankListings(listings: Listing[], prefs: UserPreferences) {
  return [...listings]
    .map((listing) => ({ listing, fit: getListingFit(listing, prefs) }))
    .sort((a, b) => b.fit.score - a.fit.score)
}
