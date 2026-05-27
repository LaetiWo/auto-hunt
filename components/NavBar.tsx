"use client";
import { Bell, Loader, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

import useCurrentUser from "@/hooks/api/use-current-user";
import useLoginDialog from "@/hooks/use-login-dialog";
import useNotificationSidebar from "@/hooks/use-notification-sidebar";
import useRegisterDialog from "@/hooks/use-register-dialog";
import { toast } from "@/hooks/use-toast";
import { logoutMutationFn } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Logo from "./logo";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const NavBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { onOpen: onRegisterOpen } = useRegisterDialog();
  const { onOpen: onLoginOpen } = useLoginDialog();
  const { onOpen: onNotificationsOpen } = useNotificationSidebar();

  const { data: userData, isPending: isLoading } = useCurrentUser();
  const user = userData?.user;

  const loginRequired = searchParams.get("login-required");

  React.useEffect(() => {
    if (loginRequired === "true" && !user && !isLoading) {
      onLoginOpen();
    }
  }, [loginRequired, user, isLoading, onLoginOpen]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      // Set data immediately so buttons reappear without waiting for a refetch
      queryClient.setQueryData(["currentUser"], { user: null, shop: null });
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

  const handleLogout = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <header className="w-full sticky top-0 z-30 h-[91px] bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 md:px-6 shadow-sm">
      <div className="flex items-center justify-between h-full w-full">
        {/* Mobile Sidebar Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 hover:bg-accent/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-64 border-r border-border/50"
            >
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (Only visible on mobile) */}
        <div className="lg:hidden flex-1 px-2">
          <Logo />
        </div>

        {/* Right Section - Auth & User Menu */}
        <div className="ml-auto flex items-center gap-4">
          {isLoading || isPending ? (
            <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : !user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={onLoginOpen}
                className="text-base font-medium px-5 hover:bg-accent/50 transition-colors"
              >
                Connexion
              </Button>
              <Button
                onClick={onRegisterOpen}
                className="text-base font-medium px-5 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                Inscription
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onNotificationsOpen}
                className="text-muted-foreground hidden sm:flex hover:bg-accent/50 transition-colors hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                  >
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold uppercase">
                        {user?.name?.charAt(0) ?? "U"}
                        {user?.name?.charAt(1) ?? "S"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={12}
                >
                  <div className="px-3 py-2">
                    <p className="font-semibold text-sm leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link
                      href="/my-shop/edit-profile"
                      className="cursor-pointer gap-3 py-2 flex"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Paramètres du profil</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    className="cursor-pointer gap-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
