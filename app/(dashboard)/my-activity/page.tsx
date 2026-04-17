"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/EmptyState";
import { Car, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import {
  getMyBookingsQueryFn,
  getPurchaseRequestsQueryFn,
} from "@/lib/fetcher";

const MyActivity = () => {
  const { data: myPurchases } = useQuery({
    queryKey: ["my-purchases"],
    queryFn: () => getPurchaseRequestsQueryFn("buyer"),
  });

  const { data: myBookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => getMyBookingsQueryFn("renter"),
  });

  return (
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mon activité</h1>

        <Tabs defaultValue="purchases">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="purchases" className="flex-1 gap-2">
              <ShoppingBag className="w-4 h-4" />
              Mes demandes d'achat ({myPurchases?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex-1 gap-2">
              <Car className="w-4 h-4" />
              Mes locations ({myBookings?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases">
            {!myPurchases?.length ? (
              <EmptyState message="Aucune demande d'achat effectuée." />
            ) : (
              <div className="space-y-3">
                {myPurchases.map((req: any) => (
                  <div
                    key={req.$id}
                    className="bg-white rounded-lg p-4 border flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">Demande d'achat</p>
                      {req.message && (
                        <p className="text-sm text-gray-500 mt-1">
                          {req.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(req.$createdAt), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status === "pending"
                        ? "Pending"
                        : req.status === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rentals">
            {!myBookings?.length ? (
              <EmptyState message="Pas de location effectuée." />
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking: any) => (
                  <div
                    key={booking.$id}
                    className="bg-white rounded-lg p-4 border flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {format(new Date(booking.startDate), "dd/MM/yyyy")} →{" "}
                        {format(new Date(booking.endDate), "dd/MM/yyyy")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.pickupLocation} → {booking.returnLocation}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        {new Intl.NumberFormat("fr-MG").format(
                          booking.totalPrice,
                        )}{" "}
                        Ar
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "ongoing"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "completed"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status === "pending"
                        ? "En attente"
                        : booking.status === "confirmed"
                          ? "Confirmée"
                          : booking.status === "ongoing"
                            ? "En cours"
                            : booking.status === "completed"
                              ? "Terminée"
                              : "Annulée"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default MyActivity;
