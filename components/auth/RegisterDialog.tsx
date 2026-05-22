"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/validation/auth.validation";
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
import useRegisterDialog from "@/hooks/use-register-dialog";
import useLoginDialog from "@/hooks/use-login-dialog";
import useOtpVerification from "@/hooks/use-otp-verification";
import { registerMutationFn } from "@/lib/fetcher";
import { useMutation } from "@tanstack/react-query";
import { Loader, Eye, EyeOff } from "lucide-react";

const RegisterDialog = () => {
  const { open, onClose } = useRegisterDialog();
  const { onOpen: onLoginOpen } = useLoginDialog();
  const { show: showOtp } = useOtpVerification();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    mutate(values, {
      onSuccess: (data) => {
        form.reset();
        onClose();
        // Open the non-dismissible OTP overlay
        showOtp(data.userId, data.email);
      },
      onError: () => {
        form.setError("root", {
          message: "L'inscription a échoué. Veuillez réessayer.",
        });
      },
    });
  };

  const handleLoginOpen = () => {
    onClose();
    onLoginOpen();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8 bg-white border border-gray-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Créer un compte</DialogTitle>
          <DialogDescription>
            Inscrivez-vous en remplissant ce formulaire
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Smith"
                      className="!h-10 placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@example.com"
                      type="email"
                      className="!h-10 placeholder:text-gray-400"
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
                  <FormLabel>Mot de passe</FormLabel>
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
                        onClick={() => setShowPassword((p) => !p)}
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

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button
              size="lg"
              disabled={isPending}
              className="w-full bg-primary hover:bg-primary/80 font-semibold"
              type="submit"
            >
              {isPending && <Loader className="w-4 h-4 animate-spin mr-2" />}
              S'inscrire
            </Button>
          </form>
        </Form>
        <div className="mt-2 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <button
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
              onClick={handleLoginOpen}
            >
              Se connecter
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
