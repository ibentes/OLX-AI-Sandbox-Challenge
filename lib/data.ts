export type PreferenceOption = {
  id: string
  label: string
  weight: "must" | "high" | "nice"
}

export type DealBreakerOption = {
  id: string
  label: string
}

export type UserPreferences = {
  priorityIds: string[]
  dealBreakerIds: string[]
}

export const preferenceOptions: PreferenceOption[] = [
  { id: "budget", label: "Budget up to €1,550/month", weight: "must" },
  { id: "size", label: "Minimum 65 m²", weight: "must" },
  { id: "bedrooms", label: "2 bedrooms", weight: "must" },
  { id: "light", label: "Good natural light", weight: "high" },
  { id: "quiet", label: "Quiet at night", weight: "high" },
  { id: "transport", label: "< 10 min walk to public transport", weight: "high" },
  { id: "balcony", label: "Balcony strongly preferred", weight: "high" },
  { id: "pets", label: "Small dog allowed", weight: "must" },
  { id: "movein", label: "Move-in around September 1", weight: "high" },
]

export const dealBreakerOptions: DealBreakerOption[] = [
  { id: "no-elevator", label: "No elevator" },
  { id: "over-budget", label: "More than €1,550/month" },
  { id: "under-2bed", label: "Less than 2 bedrooms" },
]

export const defaultDraftPreferences: UserPreferences = {
  priorityIds: preferenceOptions.map((p) => p.id),
  dealBreakerIds: dealBreakerOptions.map((d) => d.id),
}

export type Listing = {
  id: string
  title: string
  price: number
  location: string
  size: number
  bedrooms: number
  floor: number
  elevator: boolean
  furnished: string
  available: string
  pets: string
  balcony: boolean
  description: string
  highlights: string[]
  imageUrl: string
  imageAlt: string
  /** Intentionally incomplete or ambiguous for later AI flows */
  gaps: string[]
}

export const buyer = {
  name: "Sofia Martins",
  profile: "Looking to rent for herself and her partner.",
  household: "Couple + small dog (Beagle mix, ~8 kg)",
  budgetMax: 1550,
  moveIn: "Around September 1",
}

export const listings: Listing[] = [
  {
    id: "arroios-2bed-001",
    title: "Bright 2-Bedroom Apartment in Arroios",
    price: 1450,
    location: "Arroios, Lisbon",
    size: 72,
    bedrooms: 2,
    floor: 3,
    elevator: true,
    furnished: "Partially furnished",
    available: "September 1",
    pets: "Small pets considered",
    balcony: true,
    description:
      "Bright two-bedroom apartment with balcony, renovated kitchen, good natural light, and easy access to public transport. Located on a lively residential street close to cafés and shops.",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Bright living room with large windows and sofa",
    highlights: [
      "Renovated kitchen",
      "Double-glazed windows",
      "Energy rating B",
      "~6 min to Anjos metro",
    ],
    gaps: [
      "Nighttime noise level not described",
      "Balcony size and railing height not specified",
      "Exact pet conditions unclear",
      "Bedroom dimensions not listed",
    ],
  },
  {
    id: "estrela-2bed-002",
    title: "Quiet 2-Bed Near Estrela Garden",
    price: 1520,
    location: "Estrela, Lisbon",
    size: 68,
    bedrooms: 2,
    floor: 2,
    elevator: true,
    furnished: "Unfurnished",
    available: "September 15",
    pets: "Pets not allowed",
    balcony: false,
    description:
      "Calm apartment facing an interior courtyard. Two bedrooms, updated bathroom, and short walk to Estrela garden. Building has elevator.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Quiet modern bedroom with soft natural light",
    highlights: ["Courtyard view", "Updated bathroom", "Near Estrela garden"],
    gaps: ["Natural light quality unclear", "Exact metro walking time not listed"],
  },
  {
    id: "alfama-2bed-003",
    title: "Character Flat in Alfama with Views",
    price: 1390,
    location: "Alfama, Lisbon",
    size: 70,
    bedrooms: 2,
    floor: 4,
    elevator: false,
    furnished: "Partially furnished",
    available: "August 20",
    pets: "Cats only",
    balcony: true,
    description:
      "Traditional Alfama apartment with river glimpse from the balcony. Charming but on the 4th floor with no elevator. Close to trams and local shops.",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Apartment interior with character and warm light",
    highlights: ["River glimpse", "Balcony", "Near tram 28"],
    gaps: ["Noise from nightlife not addressed", "Bedroom sizes missing"],
  },
  {
    id: "campo-2bed-004",
    title: "Sunny 2-Bedroom in Campo de Ourique",
    price: 1480,
    location: "Campo de Ourique, Lisbon",
    size: 75,
    bedrooms: 2,
    floor: 1,
    elevator: true,
    furnished: "Furnished",
    available: "September 1",
    pets: "Small dogs welcome",
    balcony: true,
    description:
      "Sunny first-floor apartment near the market. Fully furnished, elevator in building, and a small balcony off the living room. Pet-friendly for small dogs.",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sunny living room with dining area near windows",
    highlights: [
      "Fully furnished",
      "Small dogs welcome",
      "Near market & cafés",
      "Elevator",
    ],
    gaps: ["Nighttime quiet not described", "Balcony dimensions not listed"],
  },
]

/** Primary listing used in later pre-visit flows */
export const featuredListingId = "arroios-2bed-001"

export const seller = {
  name: "Miguel Costa",
  role: "Property owner",
}
