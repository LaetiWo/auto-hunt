import { NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";

export async function POST(req: Request) {
  const { email } = await req.json();

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const account = new Account(client);

  try {
    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
