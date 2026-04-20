import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Building, Compass, Heart, MapPin, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Listing } from "@/types/listing";
import { formatArea, formatVnd } from "@/lib/format";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PropertyCard({ listing }: { listing: Listing }) {
  const [liked, setLiked] = useState(false);
  const cover = listing.img[0];

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <Link to={`/property/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {cover ? (
            <img
              src={cover}
              alt={listing.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="bg-background/90 text-foreground hover:bg-background">
              {listing.propertyType}
            </Badge>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setLiked((v) => !v);
            }}
            aria-label="Wishlist"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-destructive"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-destructive text-destructive")} />
          </button>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link to={`/property/${listing.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug hover:text-primary">
            {listing.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {listing.district}, {listing.city}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-primary">
            {formatVnd(listing.price, listing.mode)}
          </span>
          <span className="text-xs text-muted-foreground">{formatArea(listing.area)}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {listing.bedrooms != null && (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Bed className="h-3 w-3" /> {listing.bedrooms} PN
            </Badge>
          )}
          {listing.floors != null && (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Building className="h-3 w-3" /> {listing.floors} tầng
            </Badge>
          )}
          {listing.houseDirection && (
            <Badge variant="secondary" className="gap-1 font-normal">
              <Compass className="h-3 w-3" /> {listing.houseDirection}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1 font-normal">
            <Maximize2 className="h-3 w-3" /> {formatArea(listing.area)}
          </Badge>
        </div>

        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to={`/property/${listing.id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </article>
  );
}
