"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth.validation";
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
import useLoginDialog from "@/hooks/use-login-dialog";
import useRegisterDialog from "@/hooks/use-register-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import { Loader, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useForgotPasswordDialog from "@/hooks/use-forgot-password-dialog";
import { useSearchParams } from "next/navigation";

const LoginDialog = () => {
  const { open, onClose } = useLoginDialog();
  const { onOpen } = useRegisterDialog();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });
        toast({
          title: "Connexion réussie",
          description: "Vous êtes connecté avec succès",
          variant: "success",
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Échec de la connexion",
          description: "La connexion a échoué, veuillez réessayer",
          variant: "destructive",
        });
      },
    });
  };
  const handleRegisterOpen = () => {
    onClose();
    onOpen();
  };

  const [showPassword, setShowPassword] = useState(false);

  const { onOpen: onForgotPasswordOpen } = useForgotPasswordDialog();

  const handleForgotPasswordOpen = () => {
    onClose();
    onForgotPasswordOpen();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8">
        <DialogHeader>
          <DialogTitle>Connectez-vous à votre compte</DialogTitle>
          <DialogDescription>
            Entrez votre email et mot de passe pour vous connecter
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      className="!h-10  placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={showPassword ? "text" : "password"}
                        className="!h-10 pr-10 placeholder:text-gray-400"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              size="lg"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/80  font-semibold"
              type="submit"
            >
              {isPending && <Loader className="h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </form>
        </Form>

        <div className="mt-2 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas de compte?{" "}
            <button
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
              onClick={handleRegisterOpen}
            >
              Inscription
            </button>
          </p>
          <span className="text-muted-foreground text-sm">·</span>
          <button
            type="button"
            className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
            onClick={handleForgotPasswordOpen}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
