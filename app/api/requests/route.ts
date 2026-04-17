import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { ID } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { emailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { account, database } = await createSessionClient();
    const user = await account.get();

    const {
      listingId,
      carTitle,
      carSlug,
      ownerEmail,
      ownerName,
      ownerPhone,
      startDate,
      endDate,
      message,
    } = data;

    const requestDoc = await database.createDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      process.env.APPWRITE_COLLECTION_REQUESTS_ID!,
      ID.unique(),
      {
        listingId,
        carTitle,
        carSlug,
        ownerEmail,
        ownerName,
        ownerPhone: ownerPhone ?? null,
        renterId: user.$id,
        renterName: user.name,
        renterEmail: user.email,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        message: message ?? "",
        status: "pending",
      },
    );

    await emailService.sendRentalRequestEmail({
      to: ownerEmail,
      ownerName,
      requesterName: user.name,
      requesterEmail: user.email,
      vehicleTitle: carTitle,
      message: message ?? "",
      startDate,
      endDate,
      requestUrl: `${process.env.NEXT_PUBLIC_APP_URL}/detail/${carSlug}/${listingId}`,
    });

    return NextResponse.json(requestDoc, { status: 201 });
  } catch (error: any) {
    console.error("[REQUEST_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 },
    );
  }
}
