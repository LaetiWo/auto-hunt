"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React from "react";
import HeroFilter from "./_common/hero-filter";
import { Sparkles, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    label: "Véhicules vérifiés",
  },
  {
    icon: Clock,
    label: "Réponse rapide",
  },
  {
    icon: Sparkles,
    label: "Meilleurs prix",
  },
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const heroImages = [
    {
      src: "/images/hero-car.png",
      alt: "Voiture de luxe sportive",
    },
    {
      src: "/images/bmw.jpg",
      alt: "BMW Berline Premium",
    },
    {
      src: "/images/car1.png",
      alt: "Mercedes-Benz Classe E",
    },
    {
      src: "/images/zer.png",
      alt: "SUV Moderne",
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 600);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col min-[800px]:flex-row items-center justify-between gap-8 lg:gap-12 py-8 lg:py-16">
          {/* Left side - Search Card */}
          <div className="flex-1 w-full max-w-xl lg:max-w-lg z-10">
            <div className="space-y-6">
              {/* Badge */}
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-0 hover:bg-primary/15"
              >
                <Sparkles className="size-3.5 mr-1.5" />
                Plus de 1000 véhicules disponibles
              </Badge>

              {/* Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight text-balance">
                  Trouvez la voiture{" "}
                  <span className="text-primary">idéale</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md text-pretty">
                  Explorez notre sélection de véhicules neufs et d&apos;occasion
                  aux meilleurs prix du marché.
                </p>
              </div>

              {/* Search Card */}
              <Card className="border-border/50 shadow-xl shadow-primary/5 backdrop-blur-sm bg-card/95">
                <CardContent className="p-5 sm:p-6">
                  <HeroFilter />
                </CardContent>
              </Card>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10">
                      <feature.icon className="size-4 text-primary" />
                    </div>
                    <span className="font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Hero Image Slider */}
          <div className="flex-1 lg:flex-[1.2] relative mt-12 min-[800px]:mt-0">
            <div className="relative w-full max-w-2xl lg:max-w-none mx-auto h-[350px] sm:h-[450px] flex items-center justify-center">
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-3xl -z-10" />

              {/* Current Image */}
              <div
                className={cn(
                  "relative z-10 w-full transition-all duration-700 ease-in-out transform",
                  isTransitioning
                    ? "opacity-0 scale-95 blur-sm"
                    : "opacity-100 scale-100 blur-0",
                  "lg:translate-x-8 xl:translate-x-12",
                )}
              >
                <Image
                  src={heroImages[currentImageIndex].src}
                  alt={heroImages[currentImageIndex].alt}
                  className="object-contain w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  width={900}
                  height={500}
                  priority
                />
              </div>

              {/* Slider indicators */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 transition-all duration-300 rounded-full",
                      index === currentImageIndex
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-primary/20",
                    )}
                  />
                ))}
              </div>

              {/* Stats cards */}
              <div className="absolute bottom-4 left-0 z-20 scale-90 sm:scale-100">
                <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="size-5 sm:size-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">
                          98%
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Clients satisfaits
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute top-4 right-0 z-20 hidden sm:block scale-90 sm:scale-100">
                <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-center">
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        24h
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Temps de réponse
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
