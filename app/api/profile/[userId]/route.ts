import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { users } = await createAdminClient();
    const user = await users.get(params.userId);

    return NextResponse.json({
      avatarUrl: user.prefs?.avatarUrl ?? null,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
