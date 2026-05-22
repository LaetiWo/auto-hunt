"use client";
import {
  Activity,
  Car,
  Home,
  Key,
  PlusCircle,
  Search,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import useCurrentUser from "@/hooks/api/use-current-user";
import useLoginDialog from "@/hooks/use-login-dialog";
import { cn } from "@/lib/utils";

import Logo from "./logo";
import { Separator } from "./ui/separator";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData } = useCurrentUser();
  const { onOpen: onLoginOpen } = useLoginDialog();
  const user = userData?.user;

  const handleProtectedAction = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      onLoginOpen();
    }
  };

  const sections = [
    {
      title: "Vente",
      routes: [
        {
          label: "Recherche pour achat",
          icon: Search,
          href: "/search",
          active: pathname === "/search",
        },
        {
          label: "Vendre",
          icon: PlusCircle,
          href: "/my-shop/add-listing",
          active: pathname === "/my-shop/add-listing",
          protected: true,
        },
      ],
    },
    {
      title: "Location",
      routes: [
        {
          label: "Recherche location",
          icon: Search,
          href: "/rentals",
          active: pathname === "/rentals",
        },
        {
          label: "Proposition location",
          icon: Key,
          href: "/my-shop/add-rental",
          active: pathname === "/my-shop/add-rental",
          protected: true,
        },
      ],
    },
  ];

  const adminRoutes = [
    {
      label: "Mon Magasin",
      icon: Store,
      href: "/my-shop",
      active:
        pathname === "/my-shop" ||
        (pathname.startsWith("/my-shop") &&
          !pathname.includes("add-") &&
          !pathname.includes("edit-profile")),
    },
    {
      label: "Mon Activité",
      icon: Activity,
      href: "/my-activity",
      active: pathname.startsWith("/my-activity"),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 left-0 bg-background border-r border-border/50 shrink-0 z-20">
      <div className="px-6 py-2 border-b border-border/30">
        <Logo />
      </div>

      <div className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {/* Main Section */}
        <div className="space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center px-3 py-2.5 w-full font-medium cursor-pointer rounded-md transition-all duration-200",
              "hover:bg-accent/50",
              pathname === "/"
                ? "bg-accent text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">Accueil</span>
          </Link>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-75">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={(e) =>
                    route.protected && handleProtectedAction(e, route.href)
                  }
                  className={cn(
                    "flex items-center px-3 py-2.5 w-full font-medium cursor-pointer rounded-md transition-all duration-200",
                    "hover:bg-accent/50",
                    route.active
                      ? "bg-accent text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <route.icon className={cn("h-5 w-5 mr-3 flex-shrink-0")} />
                  <span className="text-sm flex-1">{route.label}</span>
                  {route.active && (
                    <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {user && (
          <>
            <Separator className="opacity-40" />
            <div className="space-y-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest opacity-75">
                Dashboard
              </p>
              <div className="space-y-1">
                {adminRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 w-full font-medium cursor-pointer rounded-md transition-all duration-200",
                      "hover:bg-accent/50",
                      route.active
                        ? "bg-accent text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <route.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="text-sm flex-1">{route.label}</span>
                    {route.active && (
                      <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
