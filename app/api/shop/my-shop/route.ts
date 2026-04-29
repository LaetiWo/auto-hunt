import { APP_CONFIG } from "@/lib/app-config";
import { createSessionClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  try {
    const { account, database } = await createSessionClient();
    const user = await account.get();

    const listings = await database.listDocuments(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      [Query.equal("ownerId", user.$id)],
    );

    return NextResponse.json({
      message: "Shop fetches successfully",

      user: {
        $id: user.$id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      listings: listings.documents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
