import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createSessionClient } from "@/lib/appwrite";
import { emailService } from "@/lib/email-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { database } = await createSessionClient();

    const requestDoc = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      process.env.APPWRITE_COLLECTION_REQUESTS_ID!,
      params.id,
    );

    if (requestDoc.status !== "pending") {
      return NextResponse.json(
        { error: "Demande déjà traitée" },
        { status: 400 },
      );
    }

    await database.updateDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      process.env.APPWRITE_COLLECTION_REQUESTS_ID!,
      params.id,
      { status: "approved" },
    );

    await emailService.sendRequestConfirmedEmail({
      to: requestDoc.renterEmail,
      requesterName: requestDoc.renterName,
      ownerName: requestDoc.ownerName,
      ownerEmail: requestDoc.ownerEmail,
      ownerPhone: requestDoc.ownerPhone,
      vehicleTitle: requestDoc.carTitle,
      type: "RENTAL",
      startDate: requestDoc.startDate,
      endDate: requestDoc.endDate,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/my-shop`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[REQUEST_APPROVE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve request" },
      { status: 500 },
    );
  }
}
