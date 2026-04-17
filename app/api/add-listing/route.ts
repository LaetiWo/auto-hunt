import { APP_CONFIG } from "@/lib/app-config";
import { createSessionClient } from "@/lib/appwrite";
import { listingBackendSchema } from "@/validation/listing.validation";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = listingBackendSchema.parse(body);

    const { account, database } = await createSessionClient();
    const user = await account.get();

    const carListing = await database.createDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      ID.unique(),
      {
        ...validatedData,
        ownerId: user.$id,
        ownerName: user.name,
        ownerEmail: user.email,
        type: "sale",
        userId: user.$id,
        status: "available",
      },
    );

    return NextResponse.json({
      message: "Car listing created successfully",
      data: carListing,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
