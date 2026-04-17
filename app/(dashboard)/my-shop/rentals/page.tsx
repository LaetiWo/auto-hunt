"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllBookingsQueryFn } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader, Calendar, Car, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminRentalsPage = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bookings, isPending } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAllBookingsQueryFn,
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      ongoing: "bg-green-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };

    const labels = {
      pending: "En attente",
      confirmed: "Confirmée",
      ongoing: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const filteredBookings = bookings?.filter((booking: any) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gérer les réservations
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredBookings?.length || 0} réservation(s)
            </p>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="ongoing">En cours</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des réservations */}
        {!filteredBookings || filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                Aucune réservation pour le moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => (
              <Card
                key={booking.$id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/my-shop/rentals/${booking.$id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Info client */}
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-semibold">{booking.clientName}</p>
                          <p className="text-sm text-gray-600">
                            {booking.clientEmail} • {booking.clientPhone}
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <p className="text-sm">
                          Du {format(new Date(booking.startDate), "dd/MM/yyyy")}{" "}
                          au {format(new Date(booking.endDate), "dd/MM/yyyy")}
                        </p>
                      </div>

                      {/* Lieux */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <p className="text-sm text-gray-600">
                          {booking.pickupLocation} → {booking.returnLocation}
                        </p>
                      </div>
                    </div>

                    {/* Statut et prix */}
                    <div className="text-right space-y-2">
                      {getStatusBadge(booking.status)}
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(booking.totalPrice)} Ar
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(booking.dailyPrice)} Ar/jour
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminRentalsPage;
