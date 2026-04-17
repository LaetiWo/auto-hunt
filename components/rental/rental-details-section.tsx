"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fuel, Gauge, Users, Settings, MapPin, Shield } from "lucide-react";

interface RentalDetailsSectionProps {
  rental: any;
}

const RentalDetailsSection = ({ rental }: RentalDetailsSectionProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Disponible</Badge>;
      case "rented":
        return <Badge className="bg-orange-500">Loué</Badge>;
      case "maintenance":
        return <Badge className="bg-gray-500">En maintenance</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rental.imageUrls && rental.imageUrls.length > 0 ? (
          rental.imageUrls.map((url: string, index: number) => (
            <div
              key={index}
              className={`${
                index === 0 ? "col-span-2 md:col-span-3 h-96" : "h-48"
              } bg-gray-200 rounded-lg overflow-hidden`}
            >
              <img
                src={url}
                alt={`${rental.displayTitle} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 md:col-span-3 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Aucune image disponible</p>
          </div>
        )}
      </div>

      {/* Titre et statut */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {rental.displayTitle}
          </h1>
          {getStatusBadge(rental.rentalStatus)}
        </div>
        <p className="text-xl text-primary font-semibold">
          {formatPrice(rental.dailyRentalPrice)} Ar / jour
        </p>
      </div>

      {/* Caractéristiques principales */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Caractéristiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Fuel className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Carburant</p>
                <p className="font-medium capitalize">{rental.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-medium capitalize">{rental.transmission}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Kilométrage</p>
                <p className="font-medium">
                  {formatPrice(rental.currentMileage || 0)} km
                </p>
              </div>
            </div>
            {rental.seatingCapacity && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Places</p>
                  <p className="font-medium">{rental.seatingCapacity}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">État</p>
                <p className="font-medium capitalize">{rental.condition}</p>
              </div>
            </div>
            {rental.depositAmount && (
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Caution</p>
                  <p className="font-medium">
                    {formatPrice(rental.depositAmount)} Ar
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {rental.description && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {rental.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Équipements */}
      {rental.keyFeatures && rental.keyFeatures.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Équipements</h2>
            <div className="flex flex-wrap gap-2">
              {rental.keyFeatures.map((feature: string, index: number) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conditions de location */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Conditions de location</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {rental.minimumRentalDays && (
              <li>
                • Minimum duration: {rental.minimumRentalDays} day
                {rental.minimumRentalDays > 1 ? "s" : ""}
              </li>
            )}
            {rental.depositAmount && (
              <li>
                • Caution requise : {formatPrice(rental.depositAmount)} Ar
                (remboursable)
              </li>
            )}
            <li>• Permis de conduire valide requis</li>
            <li>• Âge minimum : 21 ans</li>
            <li>• Pièce d’identité requise</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalDetailsSection;
