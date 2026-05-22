"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/helper";
import { FileText, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";
import PurchaseRequestButton from "./purchase-request-button";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/api/use-current-user";
import { useQuery } from "@tanstack/react-query";

interface PropsType {
  price: number;
  shopOwnerUserId: string;
  isPending: boolean;
  vehicleId: string;
  vehicleTitle: string;
  vehicleSlug: string;
  ownerName: string;
  ownerEmail: string;
  type?: string;
}

const ShopInfo = ({
  price,
  shopOwnerUserId,
  isPending,
  vehicleId,
  vehicleTitle,
  vehicleSlug,
  ownerName,
  ownerEmail,
  type,
}: PropsType) => {
  const { data } = useCurrentUser();
  const currentUserId = data?.user?.$id;
  const isOwner = currentUserId === shopOwnerUserId;

  const { data: sellerData } = useQuery({
    queryKey: ["seller", shopOwnerUserId],
    queryFn: () =>
      fetch(`/api/profile/${shopOwnerUserId}`).then((r) => r.json()),
    enabled: !!shopOwnerUserId,
  });
  const ownerAvatarUrl = sellerData?.avatarUrl;

  return (
    <div className="w-full">
      {isPending ? (
        <div className="w-full">
          <Skeleton className="w-full h-[88px] rounded-lg mb-4" />
          <Skeleton className="w-full h-[136px] rounded-lg mb-4" />
          <Skeleton className="w-full h-[200px] rounded-lg mb-4" />
        </div>
      ) : (
        <>
          <Card className="w-full bg-white rounded-lg shadow-custom">
            <CardContent className="!p-4">
              <h2 className="font-semibold text-xs text-gray-500 uppercase mb-2">
                Prix
              </h2>
              <div>
                <p className="text-2xl">{formatCurrency(price)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-white rounded-lg shadow-custom mt-4">
            <CardContent className="!p-4">
              <Link
                href={`/profile/${shopOwnerUserId}`}
                className="flex items-center gap-2"
              >
                {/* <Avatar className="h-28 w-28 border-2 p-[1px] border-card">
                  <AvatarFallback className="bg-primary/40 font-semibold text-3xl  uppercase ">
                    {ownerName?.charAt(0) || "S"}
                    {ownerName?.charAt(1) || "H"}
                  </AvatarFallback>
                </Avatar> */}

                <Avatar className="h-28 w-28 border-2 p-[1px] border-card">
                  <AvatarImage src={ownerAvatarUrl} />
                  <AvatarFallback className="bg-primary/40 font-semibold text-3xl uppercase">
                    {ownerName?.charAt(0) || "S"}
                    {ownerName?.charAt(1) || "H"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-[3px]">
                  <p className="text-xs text-gray-500">
                    Vendu par : {ownerName}
                  </p>
                  <p className="flex items-center m-[0_6px_1px_0px] text-[10px] ">
                    Expédié en temps normal
                  </p>
                </div>
              </Link>

              {isOwner ? (
                <Link
                  href={`/my-shop/edit/${vehicleId}`}
                  className="block mt-4"
                >
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier l'offre
                  </Button>
                </Link>
              ) : (
                <>
                  <PurchaseRequestButton
                    vehicleId={vehicleId}
                    vehicleTitle={vehicleTitle}
                    vehicleSlug={vehicleSlug}
                    sellerId={shopOwnerUserId}
                    sellerEmail={ownerEmail}
                    sellerName={ownerName}
                    type={type}
                  />

                  {type === "rental" && (
                    <Link href={`/rentals/${vehicleId}`} className="block mt-2">
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Remplir le formulaire de location
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="w-full bg-white rounded-lg">
            <CardContent className="!p-4">
              <h2 className="font-bold text-lg text-center mb-2">
                Conseils de sécurité
              </h2>
              <ul
                role="list"
                className="safety-list text-sm space-y-1 font-normal px-4 text-gray-700"
              >
                <li role="listitem">Évitez d'envoyer des avances</li>
                <li role="listitem">
                  Rencontrez le vendeur dans un lieu public sûr
                </li>
                <li role="listitem">
                  Inspectez ce que vous allez acheter pour vous assurer que
                  c'est ce dont vous avez besoin
                </li>
                <li role="listitem">
                  Vérifiez tous les documents et ne payez que si vous êtes
                  satisfait
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ShopInfo;
