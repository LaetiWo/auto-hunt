"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyOtpMutationFn, sendOtpMutationFn } from "@/lib/fetcher";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader, MailCheck, RefreshCw } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface OtpStepProps {
  userId: string;
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

const RESEND_DELAY = 60;

export default function OtpStep({ userId, email, onSuccess, onBack }: OtpStepProps) {
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(RESEND_DELAY);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: verifyOtpMutationFn,
    onSuccess: (data) => {
      // Set query data directly — no extra round-trip needed
      queryClient.setQueryData(["currentUser"], { user: data.user });
      toast({
        title: "Email vérifié",
        description: "Votre compte est activé. Bienvenue !",
        variant: "success",
      });
      onSuccess();
    },
    onError: () => {
      setError("Code invalide ou expiré. Vérifiez et réessayez.");
      setOtp("");
    },
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: sendOtpMutationFn,
    onSuccess: () => {
      setCountdown(RESEND_DELAY);
      setOtp("");
      setError("");
      toast({
        title: "Code renvoyé",
        description: `Un nouveau code a été envoyé à ${email}`,
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le code. Réessayez.",
        variant: "destructive",
      });
    },
  });

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
    if (value.length === 6) {
      verify({ userId, otp: value });
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-7 w-7 text-primary" />
      </div>

      <div className="space-y-1 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          Vérifiez votre email
        </h2>
        <p className="text-sm text-muted-foreground">
          Entrez le code à 6 chiffres envoyé à
        </p>
        <p className="text-sm font-medium text-gray-800">{email}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={handleOtpChange}
          pattern={REGEXP_ONLY_DIGITS}
          disabled={isVerifying}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-10 text-base font-semibold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {isVerifying && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="h-4 w-4 animate-spin" />
            Vérification en cours…
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <Button
          variant="ghost"
          size="sm"
          disabled={countdown > 0 || isResending}
          onClick={() => resend({ userId, email })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {isResending ? (
            <Loader className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3 w-3" />
          )}
          {countdown > 0
            ? `Renvoyer le code (${countdown}s)`
            : "Renvoyer le code"}
        </Button>

        {onBack && (
          <Button variant="outline" size="sm" className="w-full" onClick={onBack}>
            Retour
          </Button>
        )}
      </div>
    </div>
  );
}
