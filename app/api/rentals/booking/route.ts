import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { account } = await createSessionClient();
    const user = await account.get();

    const { database } = await createAdminClient();

    const vehicle = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      data.vehicleId,
    );

    const { ID } = await import("node-appwrite");

    const booking = await database.createDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "rentals",
      ID.unique(),
      {
        ...data,
        renterId: user.$id,
        ownerId: vehicle.ownerId,
      },
    );

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    if (role) {
      const { account } = await createSessionClient();
      const user = await account.get();
      const { database } = await createAdminClient();

      const query =
        role === "renter"
          ? Query.equal("renterId", user.$id)
          : Query.equal("ownerId", user.$id);
      const bookings = await database.listDocuments(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        "rentals",
        [query],
      );

      return NextResponse.json(bookings.documents);
    }

    const { database } = await createAdminClient();
    const bookings = await database.listDocuments(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "rentals",
    );

    return NextResponse.json(bookings.documents);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
