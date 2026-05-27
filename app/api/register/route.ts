import { createAdminClient } from "@/lib/appwrite";
import { APP_CONFIG } from "@/lib/app-config";
import { signupSchema } from "@/validation/auth.validation";
import { NextResponse } from "next/server";
import { ID, Client, Account } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = await signupSchema.parse(body);
    const { account } = await createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);

    // Send OTP via email token (public client — no API key needed)
    const publicClient = new Client()
      .setEndpoint(APP_CONFIG.APPWRITE.ENDPOINT)
      .setProject(APP_CONFIG.APPWRITE.PROJECT_ID);

    const publicAccount = new Account(publicClient);
    await publicAccount.createEmailToken(user.$id, email);

    return NextResponse.json({
      message: "Compte créé. Un code de vérification a été envoyé à votre email.",
      userId: user.$id,
      email,
    });
  } catch (error: any) {
    console.error("REGISTER error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
