"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useForgotPasswordDialog from "@/hooks/use-forgot-password-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

const ForgotPasswordDialog = () => {
  const { open, onClose } = useForgotPasswordDialog();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof forgotPasswordSchema>) => {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Erreur");
      return res.json();
    },
  });

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    mutate(values, {
      onSuccess: () => {
        toast({
          title: "Email envoyé",
          description: "Un lien de réinitialisation a été envoyé à votre email",
          variant: "success",
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8">
        <DialogHeader>
          <DialogTitle>Mot de passe oublié</DialogTitle>
          <DialogDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      className="!h-10 placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              size="lg"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/80 font-semibold"
              type="submit"
            >
              {isPending && <Loader className="h-4 w-4 animate-spin" />}
              Envoyer le lien
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
