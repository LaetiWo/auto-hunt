import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useRequestRental() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      listingId: string;
      carTitle: string;
      carSlug: string;
      ownerEmail: string;
      ownerName: string;
      ownerPhone?: string;
      startDate?: string;
      endDate?: string;
      message?: string;
    }) => {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur lors de la demande");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée !",
        description: "Le propriétaire a été notifié par email.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande.",
        variant: "destructive",
      });
    },
  });
}

export function useApproveRental() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Erreur lors de l'approbation");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Approuvée !",
        description: "Le locataire a été notifié par email.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver.",
        variant: "destructive",
      });
    },
  });
}
