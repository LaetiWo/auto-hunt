"use client";
import React, { useCallback } from "react";
import Logo from "./logo";
import { Loader, Plus, Car, Key, ShoppingBag } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import useRegisterDialog from "@/hooks/use-register-dialog";
import useLoginDialog from "@/hooks/use-login-dialog";
import useCurrentUser from "@/hooks/api/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpen: onRegisterOpen } = useRegisterDialog();
  const { onOpen: onLoginOpen } = useLoginDialog();

  const { data: userData, isPending: isLoading } = useCurrentUser();
  const user = userData?.user;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
        variant: "success",
      });
      router.push("/");
    },
    onError: () => {
      toast({
        title: "Échec de la déconnexion",
        description: "Veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const handleNavigate = (path: string) => {
    if (!user) {
      onLoginOpen();
      return;
    }
    router.push(path);
  };

  const handleLogout = useCallback(() => {
    mutate();
  }, [mutate]);

  const hideSearchPathname = ["/", "/my-shop/add-listing", "/profile-messages"];
  const hideNavPath = ["/my-shop", "/my-shop/add-listing", "/profile-messages"];

  const getInitials = (name?: string, email?: string) => {
    const source = (name?.trim() || email?.split("@")[0] || "").trim();
    if (!source) return "US";

    const words = source.split(" ").filter(Boolean);
    if (words.length === 1) {
      return (words[0].charAt(0) + (words[0].charAt(1) || "")).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <header className="w-full px-3 md:px-0 sticky top-0 align-top z-10 h-16 bg-card border-b border-border">
      <nav className="flex items-center h-full max-w-7xl mx-auto">
        <Logo />

        <div className="ml-auto flex items-center space-x-4">
          {isLoading || isPending ? (
            <Loader className="w-5 h-5 animate-spin " />
          ) : !user ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onLoginOpen}
                className="text-sm font-extralight "
              >
                Connexion
              </button>

              <Separator orientation="vertical" className="h-3 " />

              <button
                onClick={onRegisterOpen}
                className="text-sm font-extralight "
              >
                Inscription
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar role="button" className="w-9 h-9 shadow-sm">
                    <AvatarFallback className="text-sm uppercase">
                      {user?.name?.charAt(0) ?? "U"}
                      {user?.name?.charAt(1) ?? "S"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem
                    onClick={() => router.push("/my-shop")}
                    className="!cursor-pointer"
                  >
                    Mon magasin
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/my-activity")}
                    className="!cursor-pointer"
                  >
                    Mon activité
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/my-shop/rentals")}
                    className="!cursor-pointer"
                  >
                    Réservations reçues
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    className="!cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="default"
                className="bg-primary hover:bg-primary/80 "
              >
                <Plus />
                Ajouter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => handleNavigate("/my-shop/add-listing")}
                className="!cursor-pointer"
              >
                <Car className="mr-2 h-4 w-4" />
                <span>Vendre une voiture</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="!cursor-pointer">
                  <Key className="mr-2 h-4 w-4" />
                  <span>Locations</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => handleNavigate("/my-shop/add-rental")}
                    className="!cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Proposer en location</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigate("/rentals")}
                    className="!cursor-pointer"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Rechercher des locations</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
