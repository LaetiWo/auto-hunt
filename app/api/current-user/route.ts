import { createSessionClient } from "@/lib/appwrite";
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
