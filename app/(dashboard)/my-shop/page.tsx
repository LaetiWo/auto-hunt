"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyShopQueryFn } from "@/lib/fetcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CarCard from "@/components/CarCard";
import ShopInfo from "@/components/shop/shop-info";
import EmptyState from "@/components/EmptyState";
import { Car, ShoppingBag, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const MyShop = () => {
  const { data: shopData, isPending } = useQuery({
    queryKey: ["my-shop"],
    queryFn: getMyShopQueryFn,
  });

  const user = shopData?.user;
  const shop = shopData?.shop;
  const listings = shopData?.listings || [];

  const salesListings = listings.filter((l: any) => l.type === "sale");
  const rentalListings = listings.filter((l: any) => l.type === "rental");
  return (
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[305px_1fr] gap-5">
          <div className="pt-1">
            <ShopInfo
              description={shop?.description}
              isShopOwner={true}
              ownerName={user?.name}
              shopOwnerUserId={user?.$id}
              isPending={isPending}
            />
          </div>

          <div className="pt-1">
            <Tabs defaultValue="sales">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="sales" className="flex-1 gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Mes ventes ({salesListings.length})
                </TabsTrigger>
                <TabsTrigger value="rentals" className="flex-1 gap-2">
                  <Car className="w-4 h-4" />
                  Mes locations ({rentalListings.length})
                </TabsTrigger>
                <TabsTrigger value="requests" className="flex-1 gap-2">
                  <Bell className="w-4 h-4" />
                  Demandes reçues
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sales">
                {salesListings.length === 0 ? (
                  <EmptyState message="Aucune voiture en vente." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {salesListings.map((listing: any) => (
                      <CarCard
                        key={listing.$id}
                        listing={listing}
                        layout="grid"
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rentals">
                {rentalListings.length === 0 ? (
                  <EmptyState message="No cars for rent." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rentalListings.map((listing: any) => (
                      <CarCard
                        key={listing.$id}
                        listing={listing}
                        layout="grid"
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requests">
                <PurchaseRequestsReceived />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
};

const PurchaseRequestsReceived = () => {
  const queryClient = useQueryClient(); // 🆕

  const { data: requests, isPending } = useQuery({
    queryKey: ["purchase-requests-seller"],
    queryFn: () =>
      fetch("/api/purchase-requests?role=seller").then((r) => r.json()),
  });

  const { mutate: approve } = useMutation({
    mutationFn: (requestId: string) =>
      fetch(`/api/purchase-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests-seller"] });
      toast({
        title: "Demande acceptée !",
        description: "L'acheteur a été notifié par email.",
      });
    },
  });

  if (isPending) return <div>Chargement...</div>;
  if (!requests?.length)
    return <EmptyState message="Pas de demandes reçues." />;

  return (
    <div className="space-y-3">
      {requests.map((req: any) => (
        <div
          key={req.$id}
          className="bg-white rounded-lg p-4 border flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{req.buyerName}</p>
            <p className="text-sm text-gray-500">{req.buyerEmail}</p>
            <p className="text-sm mt-1">{req.message}</p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              req.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : req.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {req.status === "pending"
              ? "En attente"
              : req.status === "accepted"
                ? "Acceptée"
                : "Rejetée"}
          </span>

          {req.status === "pending" && (
            <Button size="sm" onClick={() => approve(req.$id)}>
              Accepter
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyShop;
