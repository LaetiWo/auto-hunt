"use client";

import { useMutation } from "@tanstack/react-query";
import { addPurchaseRequestMutationFn } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import useCurrentUser from "@/hooks/api/use-current-user";
import { Loader } from "lucide-react";

const PurchaseRequestButton = ({
  vehicleId,
  vehicleTitle,
  vehicleSlug,
  sellerId,
  sellerEmail,
  sellerName,
  type,
}: {
  vehicleId: string;
  vehicleTitle: string;
  vehicleSlug: string;
  sellerId: string;
  sellerEmail: string;
  sellerName: string;
  type?: string;
}) => {
  const isRental = type === "rental";
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { data } = useCurrentUser();
  const user = data?.user;

  const { mutate, isPending } = useMutation({
    mutationFn: addPurchaseRequestMutationFn,
    onSuccess: () => {
      toast({
        title: "Demande envoyée !",
        description: "Le vendeur sera informé.",
        variant: "success",
      });
      setOpen(false);
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user || user.$id === sellerId) return null;

  return (
    <div className="mt-4">
      {!open ? (
        <Button
          className="w-full bg-primary hover:bg-primary/80"
          onClick={() => setOpen(true)}
        >
          {isRental ? "Demander la location" : "Contacter le vendeur"}
        </Button>
      ) : (
        <div className="space-y-3">
          <Textarea
            placeholder="Votre message au vendeur (optionnel)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setOpen(false);
                setMessage("");
              }}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/80"
              disabled={isPending}
              onClick={() =>
                mutate({
                  vehicleId,
                  vehicleTitle,
                  vehicleSlug,
                  sellerId,
                  sellerEmail,
                  sellerName,
                  message,
                  type,
                })
              }
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Envoyer"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequestButton;
