import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { ID, Query } from "node-appwrite";
import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { emailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("[POST] data reçu:", data);

    const { account } = await createSessionClient();

    const user = await account.get();
    console.log("[POST] user:", user.$id);

    const {
      vehicleId,
      sellerId,
      message,
      sellerEmail,
      sellerName,
      vehicleTitle,
      vehicleSlug,
      type,
    } = data;
    console.log("[POST] champs:", {
      vehicleId,
      sellerId,
      sellerEmail,
      sellerName,
      vehicleTitle,
      vehicleSlug,
      type,
    });

    const { database } = await createAdminClient();

    const purchaseRequest = await database.createDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "purchase_requests",
      ID.unique(),
      {
        vehicleId,
        sellerId,
        buyerId: user.$id,
        buyerName: user.name,
        buyerEmail: user.email,
        type: type ?? "sale",
        message: message || "",
        status: "pending",
      },
    );
    console.log("[POST] document créé:", purchaseRequest.$id);

    if (type === "rental") {
      await emailService.sendRentalRequestEmail({
        to: sellerEmail,
        ownerName: sellerName,
        requesterName: user.name,
        requesterEmail: user.email,
        vehicleTitle,
        message: message || "",
        startDate: data.startDate,
        endDate: data.endDate,
        requestUrl: `${process.env.NEXT_PUBLIC_APP_URL}/detail/${vehicleSlug}/${vehicleId}`,
      });
    } else {
      await emailService.sendPurchaseInquiryEmail({
        to: sellerEmail,
        ownerName: sellerName,
        requesterName: user.name,
        requesterEmail: user.email,
        vehicleTitle,
        message: message || "",
        requestUrl: `${process.env.NEXT_PUBLIC_APP_URL}/detail/${vehicleSlug}/${vehicleId}`,
      });
    }
    return NextResponse.json(purchaseRequest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    const { account } = await createSessionClient();
    const user = await account.get();

    const { database } = await createAdminClient();

    const query =
      role === "seller"
        ? Query.equal("sellerId", user.$id)
        : Query.equal("buyerId", user.$id);

    const requests = await database.listDocuments(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "purchase_requests",
      [query],
    );

    return NextResponse.json(requests.documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
