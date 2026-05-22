"use client";

import React from "react";
import { X, Bell, Info, CheckCircle, AlertCircle } from "lucide-react";
import useNotificationSidebar from "@/hooks/use-notification-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";

const NotificationSidebar = () => {
  const { isOpen, onClose } = useNotificationSidebar();

  // Placeholder notifications
  const notifications = [
    {
      id: "1",
      title: "Nouvelle demande de location",
      message: "Un utilisateur souhaite louer votre Mercedes Classe G.",
      time: "Il y a 2h",
      type: "info",
      read: false,
    },
    {
      id: "2",
      title: "Paiement reçu",
      message: "Le paiement pour la location #1234 a été validé.",
      time: "Il y a 5h",
      type: "success",
      read: true,
    },
    {
      id: "3",
      title: "Rappel d'annonce",
      message: "Votre annonce pour la Toyota Camry expire bientôt.",
      time: "Hier",
      type: "warning",
      read: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-screen w-80 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/5">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">Notifications</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
              <Bell className="h-10 w-10 opacity-20" />
              <p className="text-sm">Aucune notification pour le moment.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-3 rounded-xl border border-border transition-colors hover:bg-accent/50 cursor-pointer relative group",
                  !notification.read && "bg-primary/5 border-primary/20"
                )}
              >
                {!notification.read && (
                  <div className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full" />
                )}
                <div className="flex gap-3">
                  <div className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border shadow-sm",
                    notification.type === "info" && "text-blue-500",
                    notification.type === "success" && "text-emerald-500",
                    notification.type === "warning" && "text-amber-500"
                  )}>
                    {notification.type === "info" && <Info className="h-4 w-4" />}
                    {notification.type === "success" && <CheckCircle className="h-4 w-4" />}
                    {notification.type === "warning" && <AlertCircle className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold leading-none">{notification.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground font-medium pt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full text-xs font-medium rounded-xl h-10">
            Tout marquer comme lu
          </Button>
        </div>
      </aside>
    </>
  );
};

export default NotificationSidebar;
