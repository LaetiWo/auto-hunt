import { AUTH_COOKIE_NAME } from "@/constants/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { Client, Account } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "userId et code OTP (6 chiffres) requis" },
        { status: 400 },
      );
    }

    // Step 1 — validate the OTP using a public (unauthenticated) client.
    // This call throws if the OTP is wrong or expired.
    const publicClient = new Client()
      .setEndpoint(APP_CONFIG.APPWRITE.ENDPOINT)
      .setProject(APP_CONFIG.APPWRITE.PROJECT_ID);

    const publicAccount = new Account(publicClient);
    const otpSession = await publicAccount.createSession(userId, otp);

    // Step 2 — the OTP is valid. Use the admin SDK to mark email verified,
    // delete the OTP session, and create a reliable session whose secret
    // we can safely use as a cookie.
    const { users } = await createAdminClient();

    await users.updateEmailVerification(userId, true);

    // Clean up the OTP-derived session (not needed anymore)
    try {
      await users.deleteSession(userId, otpSession.$id);
    } catch {
      // Ignore — session may already be consumed
    }

    // Create a proper server-side session via admin
    const session = await users.createSession(userId);
    const user = await users.get(userId);

    cookies().set(AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ message: "Email vérifié et connecté", user });
  } catch (error: any) {
    console.error("VERIFY OTP error:", error.message);
    return NextResponse.json(
      { error: "Code invalide ou expiré" },
      { status: 400 },
    );
  }
}
