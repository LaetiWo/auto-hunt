import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/constants/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!sessionCookie) {
      return NextResponse.json(
        {
          message: "No session found",
          user: null,
          shop: null,
        },
        { status: 200 },
      );
    }

    const { account, database } = await createSessionClient();
    const user = await account.get();

    return NextResponse.json({
      message: "User fetched successfully",
      user,
    });
  } catch (error: any) {
    console.error("Current user error:", error);

    cookies().delete(AUTH_COOKIE_NAME);

    return NextResponse.json(
      {
        message: "Session expired or invalid",
        user: null,
        shop: null,
      },
      {
        status: 200,
      },
    );
  }
};
export const PATCH = async (req: NextRequest) => {
  try {
    const { account } = await createSessionClient();
    const { users } = await createAdminClient();
    const { ownerName, ownerPhone } = await req.json();

    const user = await account.get();

    if (ownerName) await account.updateName(ownerName);
    if (ownerPhone) await users.updatePhone(user.$id, ownerPhone);

    return NextResponse.json({ message: "Profil mis à jour" });
  } catch (error: any) {
    console.error("PATCH error full:", JSON.stringify(error, null, 2));
    console.error("PATCH error message:", error.message);
    console.error("PATCH error code:", error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
