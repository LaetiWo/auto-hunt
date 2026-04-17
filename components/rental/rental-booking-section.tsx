"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { rentalService } from "@/lib/appwrite-rentals-client";
import { useMutation } from "@tanstack/react-query";

interface RentalBookingSectionProps {
  rental: any;
}

const RentalBookingSection = ({ rental }: RentalBookingSectionProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const numberOfDays =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const totalPrice = numberOfDays * (rental.dailyRentalPrice || 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const [licenseExpiry, setLicenseExpiry] = useState("");

  useEffect(() => {
    const checkAvailability = async () => {
      if (startDate && endDate) {
        setIsCheckingAvailability(true);
        try {
          const available = await rentalService.checkAvailability(
            rental.$id,
            startDate,
            endDate,
          );
          setIsAvailable(available);
        } catch (error) {
          console.error("Error checking availability:", error);
          setIsAvailable(false);
        } finally {
          setIsCheckingAvailability(false);
        }
      } else {
        setIsAvailable(null);
      }
    };

    checkAvailability();
  }, [startDate, endDate, rental.$id]);

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Please select dates");
      }

      const bookingData = {
        vehicleId: rental.$id,
        clientName,
        clientEmail,
        clientPhone,
        driverLicense,
        licenseExpiry,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dailyPrice: rental.dailyRentalPrice,
        totalPrice,
        pickupLocation,
        returnLocation,
        status: "pending" as const,
      };

      return await rentalService.create(bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Réservation envoyée !",
        description: "Your booking request has been sent successfully",
        variant: "success",
      });

      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setDriverLicense("");
      setLicenseExpiry("");
      setPickupLocation("");
      setReturnLocation("");
      setStartDate(undefined);
      setEndDate(undefined);
      setBirthDate("");
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const realAge =
        monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())
          ? age - 1
          : age;

      if (realAge < 21) {
        toast({
          title: "Insufficient age",
          description: "You must be at least 21 years old to rent a vehicle",
          variant: "destructive",
        });
        return;
      }
    }

    if (!isAvailable) {
      toast({
        title: "Not available",
        description: "The vehicle is not available for those dates",
        variant: "destructive",
      });
      return;
    }

    if (rental.minimumRentalDays && numberOfDays < rental.minimumRentalDays) {
      toast({
        title: "Minimum duration",
        description: `The minimum rental period is ${rental.minimumRentalDays} days`,
        variant: "destructive",
      });
      return;
    }

    createBooking();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Réserver ce véhicule</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date de début</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date: Date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date de fin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date: Date) =>
                    date < new Date() || (startDate ? date < startDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {isCheckingAvailability && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader className="w-4 h-4 animate-spin" />
              Vérification de la disponibilité...
            </div>
          )}

          {isAvailable === false && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              Ce véhicule n’est pas disponible à ces dates
            </div>
          )}

          {isAvailable === true && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              Disponible pour ces dates
            </div>
          )}

          {numberOfDays > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {formatPrice(rental.dailyRentalPrice)} Ar × {numberOfDays}{" "}
                  jour{numberOfDays > 1 ? "s" : ""}
                </span>
                <span className="font-medium">
                  {formatPrice(totalPrice)} Ar
                </span>
              </div>
              {rental.depositAmount && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Caution (remboursable)</span>
                  <span>{formatPrice(rental.depositAmount)} Ar</span>
                </div>
              )}
              <div className="pt-2 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(totalPrice + (rental.depositAmount || 0))} Ar
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom complet *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Téléphone *</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverLicense">N° Permis de conduire *</Label>
              <Input
                id="driverLicense"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">
                Date d'expiration du permis *
              </Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Lieu de prise en charge *</Label>
              <Input
                id="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Ex: Aéroport Ivato"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnLocation">Lieu de retour *</Label>
              <Input
                id="returnLocation"
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                placeholder="Ex: Aéroport Ivato"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80"
            disabled={
              isPending ||
              isCheckingAvailability ||
              !isAvailable ||
              numberOfDays === 0
            }
          >
            {isPending && <Loader className="w-4 h-4 animate-spin mr-2" />}
            {isPending ? "Sending..." : "Book now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentalBookingSection;
