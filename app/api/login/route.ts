import { AUTH_COOKIE_NAME } from "@/constants/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createAdminClient } from "@/lib/appwrite";
import { loginSchema } from "@/validation/auth.validation";
import { cookies } from "next/headers";
import { Client, Account } from "node-appwrite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = await loginSchema.parseAsync(body);
    const { account, users } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    const userInfo = await users.get(session.userId);

    if (!userInfo.emailVerification) {
      await users.deleteSession(session.userId, session.$id);

      // Send OTP via public client
      const publicClient = new Client()
        .setEndpoint(APP_CONFIG.APPWRITE.ENDPOINT)
        .setProject(APP_CONFIG.APPWRITE.PROJECT_ID);
      const publicAccount = new Account(publicClient);
      await publicAccount.createEmailToken(userInfo.$id, email);

      return NextResponse.json(
        {
          error: "email_not_verified",
          message: "Un code de vérification a été envoyé à votre email.",
          userId: userInfo.$id,
          email,
        },
        { status: 403 },
      );
    }

    cookies().set(AUTH_COOKIE_NAME, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    // Return user directly so the client can update the cache without a refetch
    return NextResponse.json({
      message: "User logged in successfully",
      user: userInfo,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
