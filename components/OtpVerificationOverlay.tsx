"use client";

import useOtpVerification from "@/hooks/use-otp-verification";
import OtpStep from "./auth/OtpStep";
import { Card, CardContent } from "./ui/card";
import Logo from "./logo";

export default function OtpVerificationOverlay() {
  const { open, userId, email, hide } = useOtpVerification();

  if (!open) return null;

  return (
    // Fixed overlay — covers the entire viewport, cannot be dismissed
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-xl border border-border/60">
        <CardContent className="p-8">
          <OtpStep userId={userId} email={email} onSuccess={hide} />
        </CardContent>
      </Card>
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        Vous devez confirmer votre email pour accéder au site.
      </p>
    </div>
  );
}
