import React, { Fragment } from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Mail, Pencil, Phone, User, UserPlus } from "lucide-react";

type ShopInfoProps = {
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  description?: string;
  isShopOwner?: boolean;
  shopOwnerUserId: string;
  isPending?: boolean;
};

const ShopInfo = ({
  ownerName,
  ownerEmail,
  ownerPhone,
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
                {/* <div className="mt-1">
                  <span className="text-[10px] inline-block py-[2px] px-2 text-gray-500 bg-gray-100 rounded-sm font-extralight">
                    Dernière connexion il y a 10 heures
                  </span>
                </div> */}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="!bg-transparent shadow-none border-none">
        <div className="p-3 bg-white rounded-[8px]">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h5 className="font-medium text-sm uppercase">
              A propos de vous {isShopOwner ? "You" : "Shop"}
            </h5>
            {isShopOwner && (
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                aria-label="Modifier les informations"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-black font-light">{description}</p>

          {/* <div className="mt-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Nom :</span>{" "}
              {ownerName || "Non renseigné"}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Email :</span>{" "}
              {ownerEmail || "Non renseigné"}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Téléphone :</span>{" "}
              {ownerPhone || "Non renseigné"}
            </div>
          </div> */}

          <div className="mt-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/60 p-1.5 space-y-0.5">
            <div className="flex items-center gap-3 rounded-xl p-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Nom
                </p>
                <p className="truncate text-sm font-medium text-gray-800">
                  {ownerName || "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="mx-2.5 h-px bg-gray-200/70" />

            <div className="flex items-center gap-3 rounded-xl p-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Email
                </p>
                <p className="truncate text-sm font-medium text-gray-800">
                  {ownerEmail || "Non renseigné"}
                </p>
              </div>
            </div>

            <div className="mx-2.5 h-px bg-gray-200/70" />

            <div className="flex items-center gap-3 rounded-xl p-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Téléphone
                </p>
                <p className="truncate text-sm font-medium text-gray-800">
                  {ownerPhone || "Non renseigné"}
                </p>
              </div>
              {!ownerPhone && (
                <button
                  type="button"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 text-primary/60 transition-colors hover:border-primary hover:text-primary"
                  aria-label="Ajouter un numéro de téléphone"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopInfo;
