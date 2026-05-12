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
    const { ownerName, ownerPhone, avatarUrl, description } = await req.json();

    const user = await account.get();

    if (ownerName) {
      try {
        await account.updateName(ownerName);
        console.log("updateName OK");
      } catch (e: any) {
        console.error("updateName failed:", e.message);
      }
    }

    if (ownerPhone) {
      try {
        await users.updatePhone(user.$id, ownerPhone);
        console.log("updatePhone OK");
      } catch (e: any) {
        // Bug Appwrite — le numéro est quand même mis à jour malgré l'erreur 409
        if (e.code !== 409) {
          console.error(" updatePhone failed:", e.message);
          throw e; // re-throw seulement si ce n'est pas un 409
        }
        console.log("updatePhone OK (409 ignored)");
      }
    }

    if (avatarUrl !== undefined || description !== undefined) {
      try {
        await account.updatePrefs({
          ...user.prefs,
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(description !== undefined && { description }),
        });
        console.log("updatePrefs OK");
      } catch (e: any) {
        console.error(" updatePrefs failed:", e.message);
      }
    }

    return NextResponse.json({ message: "Profil mis à jour" });
  } catch (error: any) {
    console.error("PATCH error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
