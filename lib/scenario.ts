export const property = {
  id: "arroios-2bed-001",
  title: "Bright 2-Bedroom Apartment in Arroios",
  price: 1450,
  currency: "€",
  period: "month",
  location: "Arroios, Lisbon",
  size: 72,
  bedrooms: 2,
  bathrooms: 1,
  floor: 3,
  elevator: true,
  furnished: "Partially furnished",
  available: "September 1",
  pets: "Small pets considered",
  balcony: true,
  kitchen: "Renovated",
  windows: "Double-glazed",
  energyRating: "B",
  metroWalk: "~6 min walk to Anjos metro (Green Line)",
  description:
    "Bright two-bedroom apartment with balcony, renovated kitchen, good natural light, and easy access to public transport. Located on a lively residential street close to cafés and shops.",
  amenities: [
    "Balcony",
    "Renovated kitchen",
    "Double-glazed windows",
    "Energy rating B",
    "Elevator",
    "Partial furniture",
  ],
  /** Intentionally sparse / ambiguous listing fields */
  gaps: [
    "Nighttime noise level not described",
    "Balcony size and railing height not specified",
    "Pet policy details unclear (deposit, breed, indoor rules)",
    "Bedroom dimensions not listed",
    "Orientation / which rooms get morning vs afternoon light unspecified",
    "Building renovation year not stated",
  ],
} as const

export const buyer = {
  name: "Sofia Martins",
  profile: "Looking to rent for herself and her partner.",
  household: "Couple + small dog (Beagle mix, ~8 kg)",
  moveIn: "Around September 1",
  budgetMax: 1550,
  priorities: [
    { id: "budget", label: "Budget up to €1,550/month", weight: "must" },
    { id: "size", label: "Minimum 65 m²", weight: "must" },
    { id: "bedrooms", label: "2 bedrooms", weight: "must" },
    { id: "light", label: "Good natural light", weight: "high" },
    { id: "quiet", label: "Quiet at night", weight: "high" },
    { id: "transport", label: "< 10 min walk to public transport", weight: "high" },
    { id: "balcony", label: "Balcony strongly preferred", weight: "high" },
    { id: "pets", label: "Small dog allowed", weight: "must" },
    { id: "movein", label: "Move-in around September 1", weight: "high" },
  ],
  dealBreakers: [
    { id: "no-elevator", label: "No elevator" },
    { id: "over-budget", label: "More than €1,550/month" },
    { id: "under-2bed", label: "Less than 2 bedrooms" },
  ],
  uncertainties: [
    "Actual nighttime noise on a lively residential street",
    "Whether the balcony is suitable / safe for a small dog",
    "Exact pet conditions (deposit, restrictions)",
    "Bedroom dimensions and usable space",
  ],
} as const

export const seller = {
  name: "Miguel Costa",
  role: "Property owner",
} as const

export type FitStatus = "match" | "partial" | "unknown" | "mismatch"

export type FitCriterion = {
  id: string
  label: string
  status: FitStatus
  detail: string
  source: string
}

/** Deterministic AI fit evaluation against Sofia's preferences */
export const fitEvaluation: {
  score: number
  verdict: string
  recommendation: string
  summary: string
  criteria: FitCriterion[]
} = {
  score: 78,
  verdict: "Promising fit — worth a visit if open questions check out",
  recommendation: "consider_visit",
  summary:
    "Hard requirements look solid: budget, size, bedrooms, elevator, and timing all align. The main risk is uncertainty around nighttime quiet and pet terms — not clear deal-breakers yet, but they should be clarified before or during a visit.",
  criteria: [
    {
      id: "budget",
      label: "Budget ≤ €1,550",
      status: "match",
      detail: "€1,450/month is €100 under Sofia's ceiling.",
      source: "Listed price",
    },
    {
      id: "size",
      label: "≥ 65 m²",
      status: "match",
      detail: "72 m² meets the minimum with some headroom.",
      source: "Listed size",
    },
    {
      id: "bedrooms",
      label: "2 bedrooms",
      status: "match",
      detail: "Listing confirms 2 bedrooms.",
      source: "Listed bedrooms",
    },
    {
      id: "elevator",
      label: "Elevator (deal-breaker if absent)",
      status: "match",
      detail: "Elevator present; 3rd floor is fine.",
      source: "Listed amenities",
    },
    {
      id: "transport",
      label: "< 10 min to transport",
      status: "match",
      detail: "~6 min walk to Anjos metro is within target.",
      source: "Listing note",
    },
    {
      id: "balcony",
      label: "Balcony preferred",
      status: "partial",
      detail: "Balcony exists, but size and dog suitability are unknown.",
      source: "Listed feature + gap",
    },
    {
      id: "light",
      label: "Good natural light",
      status: "partial",
      detail: "Described as bright with good light; room orientation not specified.",
      source: "Description",
    },
    {
      id: "movein",
      label: "September 1 move-in",
      status: "match",
      detail: "Available September 1 — aligns with Sofia's timeline.",
      source: "Availability",
    },
    {
      id: "pets",
      label: "Small dog allowed",
      status: "unknown",
      detail: '"Small pets considered" — not a clear yes; conditions missing.',
      source: "Ambiguous pet policy",
    },
    {
      id: "quiet",
      label: "Quiet at night",
      status: "unknown",
      detail: "Lively residential street near cafés — nighttime noise unknown.",
      source: "Location context + gap",
    },
  ],
}

export type GapQuestion = {
  id: string
  topic: string
  whyItMatters: string
  question: string
  priority: "critical" | "important" | "nice"
  defaultSelected: boolean
}

export const gapQuestions: GapQuestion[] = [
  {
    id: "noise",
    topic: "Nighttime noise",
    whyItMatters:
      "Sofia ranks quiet nights highly, and the listing sits on a lively street near cafés.",
    question:
      "How quiet is the apartment at night (after 22:00)? Any street noise, nearby bars, or building noise we should know about?",
    priority: "critical",
    defaultSelected: true,
  },
  {
    id: "pets",
    topic: "Pet conditions",
    whyItMatters:
      "Sofia has a small dog (~8 kg). “Small pets considered” is too vague to decide on a visit.",
    question:
      "Would you accept a small dog (Beagle mix, ~8 kg)? Any pet deposit, breed restrictions, or rules about the balcony?",
    priority: "critical",
    defaultSelected: true,
  },
  {
    id: "balcony",
    topic: "Balcony & dog",
    whyItMatters:
      "Balcony is a strong preference; suitability for a dog is unclear.",
    question:
      "Could you describe the balcony size and railing height? Is it enclosed enough to be safe for a small dog?",
    priority: "important",
    defaultSelected: true,
  },
  {
    id: "bedrooms",
    topic: "Bedroom sizes",
    whyItMatters:
      "Couple needs two usable bedrooms; dimensions are missing.",
    question:
      "What are the approximate dimensions of each bedroom? Is the second bedroom suitable as a proper bedroom (not a tiny office)?",
    priority: "important",
    defaultSelected: true,
  },
  {
    id: "light",
    topic: "Light orientation",
    whyItMatters: "Natural light is a high priority; orientation isn't listed.",
    question:
      "Which direction does the apartment face, and which rooms get the most natural light during the day?",
    priority: "nice",
    defaultSelected: false,
  },
  {
    id: "furniture",
    topic: "Partial furniture",
    whyItMatters: "Knowing what's included affects move-in planning.",
    question:
      "What furniture is currently included, and what would we need to bring ourselves?",
    priority: "nice",
    defaultSelected: false,
  },
]

export type MutualFitSignal = {
  id: string
  label: string
  status: FitStatus
  note: string
}

export const mutualMatchAssessment = {
  buyerFitScore: 82,
  sellerValueNote:
    "Sofia looks like a serious, well-matched renter: budget fits, timeline matches, household is clear, and hard deal-breakers are already satisfied by this listing.",
  signals: [
    {
      id: "intent",
      label: "Clear move-in intent",
      status: "match" as FitStatus,
      note: "Targeting September 1 — same as availability.",
    },
    {
      id: "budget",
      label: "Budget alignment",
      status: "match" as FitStatus,
      note: "Ceiling €1,550 vs listed €1,450.",
    },
    {
      id: "household",
      label: "Household fit",
      status: "partial" as FitStatus,
      note: "Couple + small dog; pet acceptance still needs confirmation.",
    },
    {
      id: "musts",
      label: "Must-haves vs listing",
      status: "match" as FitStatus,
      note: "Size, bedrooms, elevator, transport all look compatible.",
    },
    {
      id: "open",
      label: "Open risks",
      status: "unknown" as FitStatus,
      note: "Noise and pet terms remain the main unknowns for both sides.",
    },
  ] satisfies MutualFitSignal[],
}
