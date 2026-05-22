"use client";

import { ListingType } from "@/@types/api.type";
import { createSlug, formatCurrency, formatMileage } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CAR_CONDITION_OPTIONS } from "@/constants/car-options";
import {
  Cog,
  Fuel,
  Gauge,
  Heart,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface CarCardProps {
  listing: ListingType;
  layout?: "grid" | "list";
}

const CarCard: React.FC<CarCardProps> = ({ listing, layout = "grid" }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    $id,
    imageUrls = [],
    displayTitle,
    price,
    fuelType,
    condition,
    transmission,
    mileage,
    description,
    yearOfManufacture,
  } = listing;

  const slug = createSlug(displayTitle);
  const conditionOption = CAR_CONDITION_OPTIONS.find(
    (opt) => opt.value === condition,
  );
  const conditionLabel = conditionOption?.label || "Occasion";
  const isNew = condition === "new" || conditionLabel === "Neuf";

  const mainImage =
    imageUrls.length > 0 ? imageUrls[0] : "/images/car1.png";

  // Always render vertical card - ignore layout prop
  if (layout === "list") {
    return (
      <Card className="group overflow-hidden border-2 border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-500 rounded-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-80 lg:w-96 h-56 md:h-auto md:min-h-[240px] overflow-hidden bg-muted">
            <Image
              src={imageError ? "/images/car-placeholder.jpg" : mainImage}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />

            {/* Condition Badge */}
            <Badge
              className={cn(
                "absolute top-4 left-4 text-xs font-semibold shadow-lg border-0 px-3 py-1.5",
                isNew
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
              )}
            >
              {isNew && <Sparkles className="size-3 mr-1" />}
              {conditionLabel}
            </Badge>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={cn(
                "absolute top-4 right-4 size-11 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-white shadow-lg border-2 border-border hover:scale-110 active:scale-95",
                isLiked
                  ? "text-red-500 border-red-200"
                  : "text-muted-foreground hover:text-red-400 hover:border-red-200",
              )}
            >
              <Heart
                className={cn(
                  "size-5 transition-all",
                  isLiked && "fill-current",
                )}
              />
            </button>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-xl line-clamp-1 group-hover:text-primary transition-colors duration-300">
                    {displayTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                    {description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(price)}
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t-2 border-border">
                {yearOfManufacture && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-xl border-2 border-border">
                    <Calendar className="size-4 text-primary" />
                    <span className="font-medium">{yearOfManufacture}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-xl border-2 border-border">
                  <Fuel className="size-4 text-primary" />
                  <span className="capitalize font-medium">
                    {fuelType?.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-xl border-2 border-border">
                  <Gauge className="size-4 text-primary" />
                  <span className="font-medium">
                    {formatMileage(mileage)} km
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-3 py-2 rounded-xl border-2 border-border">
                  <Cog className="size-4 text-primary" />
                  <span className="capitalize font-medium">
                    {transmission?.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/detail/${slug}/${$id}`} className="mt-5">
              <Button className="w-full gap-2 h-12 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group/btn">
                Voir details
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Vertical card with minimalist design - always render this
  return (
    <Card className="group overflow-hidden border border-border/50 bg-background shadow-none hover:shadow-md transition-all duration-400 rounded-xl h-full flex flex-col w-full">
      {/* Image Container - Tall & Minimalist */}
      <div className="relative aspect-[9/10] overflow-hidden bg-muted/50">
        <Image
          src={imageError ? "/images/car-placeholder.jpg" : mainImage}
          alt={displayTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Condition Badge - Top Left */}
        <Badge
          className={cn(
            "absolute top-3 left-3 text-xs font-semibold shadow-sm border-0 px-2.5 py-1",
            isNew
              ? "bg-emerald-500/90 text-white"
              : "bg-amber-500/90 text-white",
          )}
        >
          {conditionLabel}
        </Badge>
      </div>

      {/* Content - Minimalist Layout */}
      <CardContent className="flex-1 p-4 flex flex-col gap-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {displayTitle}
          </h3>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(price)}
          </span>
        </div>

        {/* Specs - Clean Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-border/40">
          {yearOfManufacture && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3.5 text-primary/70 flex-shrink-0" />
              <span className="font-medium">{yearOfManufacture}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fuel className="size-3.5 text-primary/70 flex-shrink-0" />
            <span className="capitalize font-medium truncate">
              {fuelType?.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="size-3.5 text-primary/70 flex-shrink-0" />
            <span className="font-medium">{formatMileage(mileage)} km</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Cog className="size-3.5 text-primary/70 flex-shrink-0" />
            <span className="capitalize font-medium truncate">
              {transmission?.toLowerCase()}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/detail/${slug}/${$id}`} className="mt-auto pt-2">
          <Button className="w-full h-10 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 group/btn">
            Voir détails
            <ArrowRight className="size-3.5 ml-1.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CarCard;
