import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";

export async function POST(req: Request) {
  const { userId, secret, password } = await req.json();

  try {
    const { account } = await createAdminClient();
    await account.updateRecovery(userId, secret, password);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
