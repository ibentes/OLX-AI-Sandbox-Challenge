import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { property, seller } from "@/lib/scenario"

export function ListingCard({ compact = false }: { compact?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <CardTitle>{property.title}</CardTitle>
            <CardDescription>
              {property.location} · Listed by {seller.name}
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {property.currency}
            {property.price.toLocaleString()}/{property.period}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{property.size} m²</Badge>
          <Badge variant="outline">{property.bedrooms} bed</Badge>
          <Badge variant="outline">Floor {property.floor}</Badge>
          <Badge variant="outline">Elevator</Badge>
          <Badge variant="outline">{property.furnished}</Badge>
          <Badge variant="outline">From {property.available}</Badge>
          <Badge variant="outline">{property.pets}</Badge>
        </div>
        {!compact && (
          <>
            <p className="text-sm text-muted-foreground">{property.description}</p>
            <Separator />
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <Fact label="Kitchen" value={property.kitchen} />
              <Fact label="Windows" value={property.windows} />
              <Fact label="Energy" value={property.energyRating} />
              <Fact label="Metro" value={property.metroWalk} />
              <Fact label="Balcony" value="Yes (size not specified)" />
              <Fact label="Bedrooms" value="2 (dimensions not listed)" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  )
}
