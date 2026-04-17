"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useLoginDialog from "@/hooks/use-login-dialog";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { onOpen } = useLoginDialog();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const handleReset = async () => {
    if (!userId || !secret) return setError("Lien invalide ou expiré.");
    if (!password || password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, secret, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur.");
      }

      router.push("/");

      setTimeout(() => {
        onOpen();
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 shadow rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Réinitialiser le mot de passe
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="password"
          placeholder="Nouveau mot de passe (min. 8 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleReset();
          }}
          className="border p-2 w-full rounded mb-4"
          disabled={loading}
        />
        <button
          onClick={handleReset}
          disabled={loading || !password}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Chargement..." : "Valider"}
        </button>
      </div>
    </div>
  );
}
