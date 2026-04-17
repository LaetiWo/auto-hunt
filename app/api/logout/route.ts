import { AUTH_COOKIE_NAME } from "@/constants/server";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    cookieStore.delete(AUTH_COOKIE_NAME);

    if (sessionCookie) {
      try {
        const { account } = await createSessionClient();
        await account.deleteSession("current");
      } catch (error) {
        console.log("Session already deleted or invalid");
      }
    }

    return NextResponse.json({
      message: "Logout successfully",
    });
  } catch (error: any) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        message: "Logout successfully",
      },
      {
        status: 200,
      }
    );
  }
};
