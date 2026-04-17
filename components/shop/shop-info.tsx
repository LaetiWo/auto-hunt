import React, { Fragment } from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";

type ShopInfoProps = {
  ownerName: string;
  description?: string;
  isShopOwner?: boolean;
  shopOwnerUserId: string;
  isPending?: boolean;
};

const ShopInfo = ({
  ownerName,
  isShopOwner = false,
  description,
  isPending,
}: ShopInfoProps) => {
  return (
    <div className="w-full">
      <Card className="shadow-custom rounded-[8px] mb-3 border-none">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            {isPending ? (
              <Skeleton className="h-28 w-28 rounded-full border-card border-2" />
            ) : (
              <Avatar className="h-28 w-28 border-2 p-[1px] border-card">
                <AvatarFallback className="bg-primary/40 font-semibold text-3xl  uppercase ">
                  {ownerName?.charAt(0) || "S"}
                  {ownerName?.charAt(1) || "H"}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {isPending ? (
            <Fragment>
              <div className="my-3">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div>
                <Skeleton className="h-2 w-12" />
              </div>
            </Fragment>
          ) : (
            <>
              <div className="mt-3 text-center">
                <h5 className="font-bold text-base">
                  {isShopOwner ? ownerName || "Shop Owner" : "Shop Name"}
                </h5>
                <div className="mt-1">
                  <span className="text-[10px] inline-block py-[2px] px-2 text-gray-500 bg-gray-100 rounded-sm font-extralight">
                    Dernière connexion il y a 10 heures
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="!bg-transparent shadow-none border-none">
        <div className="p-3 bg-white rounded-[8px]">
          <h5 className="font-medium text-sm uppercase mb-2 ">
            A propos de vous {isShopOwner ? "You" : "Shop"}
          </h5>
          <p className="text-sm text-black font-light">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default ShopInfo;
