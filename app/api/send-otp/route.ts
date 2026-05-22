import { APP_CONFIG } from "@/lib/app-config";
import { Client, Account } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId et email requis" },
        { status: 400 },
      );
    }

    const client = new Client()
      .setEndpoint(APP_CONFIG.APPWRITE.ENDPOINT)
      .setProject(APP_CONFIG.APPWRITE.PROJECT_ID);

    const account = new Account(client);
    await account.createEmailToken(userId, email);

    return NextResponse.json({ message: "OTP envoyé" });
  } catch (error: any) {
    console.error("SEND OTP error:", error.message);
    return NextResponse.json(
      { error: error.message || "Échec de l'envoi du code" },
      { status: 500 },
    );
  }
}
