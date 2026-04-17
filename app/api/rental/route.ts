import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { ID } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { account, database } = await createSessionClient();
    const user = await account.get();

    const rental = await database.createDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "car-listing",
      ID.unique(),
      {
        ...data,

        ownerId: user.$id,
        ownerName: user.name,
        ownerEmail: user.email,
        type: "rental",
        availableForRental: true,
        status: "available",
        $createdAt: new Date().toISOString(),
      },
    );

    return NextResponse.json(rental, { status: 201 });
  } catch (error: any) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create rental" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { database } = await createSessionClient();

    const { Query } = await import("node-appwrite");

    const rentals = await database.listDocuments(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "car-listing",
      [Query.equal("availableForRental", true)],
    );

    return NextResponse.json(rentals.documents);
  } catch (error: any) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rentals" },
      { status: 500 },
    );
  }
}
