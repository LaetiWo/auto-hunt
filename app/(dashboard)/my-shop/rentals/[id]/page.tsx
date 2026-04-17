"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookingByIdQueryFn,
  updateBookingStatusMutationFn,
} from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader,
  ArrowLeft,
  User,
  Car,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const AdminRentalDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookingId = params.id as string;

  const { data: booking, isPending } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingByIdQueryFn(bookingId),
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      updateBookingStatusMutationFn(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({
        title: "Status updated",
        description: "The booking status has been updated",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
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

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Aucune réservation trouvée
          </h1>
          <Button
            onClick={() => router.push("/my-shop/rentals")}
            className="mt-4"
          >
            Retour aux réservations
          </Button>
        </div>
      </div>
    );
  }

  const numberOfDays = calculateDays(booking.startDate, booking.endDate);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-shop/rentals")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Détails de la réservation
              </h1>
              {/* <p className="text-gray-600 mt-1">ID: {booking.$id}</p> */}
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{booking.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{booking.clientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{booking.clientPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Permis de conduire</p>
                    <p className="font-medium">{booking.driverLicense}</p>
                    {booking.licenseExpiry && (
                      <p className="text-sm text-gray-600">
                        Expire le:{" "}
                        {format(new Date(booking.licenseExpiry), "dd/MM/yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails de la location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Détails de la location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Dates</p>
                  <p className="font-medium">
                    From {format(new Date(booking.startDate), "dd/MM/yyyy")} to{" "}
                    {format(new Date(booking.endDate), "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {numberOfDays} jour(s)
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Prise en charge</p>
                    <p className="font-medium">{booking.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Retour</p>
                    <p className="font-medium">{booking.returnLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Prix */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix par jour</span>
                  <span className="font-medium">
                    {formatPrice(booking.dailyPrice)} Ar
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre de jours</span>
                  <span className="font-medium">{numberOfDays}</span>
                </div>
                <div className="pt-3 border-t flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(booking.totalPrice)} Ar
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {booking.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => updateStatus({ status: "confirmed" })}
                    disabled={isUpdating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmer la réservation
                  </Button>
                  <Button
                    onClick={() => updateStatus({ status: "cancelled" })}
                    disabled={isUpdating}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Annuler la réservation
                  </Button>
                </CardContent>
              </Card>
            )}

            {booking.status === "confirmed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => updateStatus({ status: "ongoing" })}
                    disabled={isUpdating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Marquer comme "En cours"
                  </Button>
                </CardContent>
              </Card>
            )}

            {booking.status === "ongoing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => updateStatus({ status: "completed" })}
                    disabled={isUpdating}
                    className="w-full"
                  >
                    Marquer comme "Terminée"
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminRentalDetailPage;
