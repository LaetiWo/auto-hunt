import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { emailService } from "@/lib/email-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { status } = body;
    console.log("[PATCH] body reçu:", body);
    console.log("[PATCH] params.id:", params.id);

    const { account } = await createSessionClient();
    const user = await account.get();
    console.log("[PATCH] user:", user.$id);

    const { database } = await createAdminClient();

    const requestDoc = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "purchase_requests",
      params.id,
    );
    console.log("[PATCH] requestDoc vehicleId:", requestDoc.vehicleId);

    const updated = await database.updateDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "purchase_requests",
      params.id,
      { status },
    );

    if (status === "accepted") {
      if (requestDoc.type !== "rental") {
        try {
          await database.updateDocument(
            APP_CONFIG.APPWRITE.DATABASE_ID,
            APP_CONFIG.APPWRITE.CAR_LISTING_ID,
            updated.vehicleId,
            { status: "sold" },
          );
          console.log("[PATCH] voiture marquée vendue");
        } catch (err: any) {
          console.error("[PATCH] Erreur update car-listing:", err.message);
        }
      }

      try {
        await emailService.sendRequestConfirmedEmail({
          to: requestDoc.buyerEmail,
          requesterName: requestDoc.buyerName,
          ownerName: requestDoc.sellerName ?? "Le propriétaire",
          ownerEmail: requestDoc.sellerEmail ?? "",
          vehicleTitle: requestDoc.vehicleTitle ?? "le véhicule",
          type: requestDoc.type === "rental" ? "RENTAL" : "PURCHASE",
          dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/my-shop`,
        });
        console.log("[PATCH] email envoyé à:", requestDoc.buyerEmail);
      } catch (err: any) {
        console.error("[PATCH] Erreur email:", err.message);
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[PATCH] Erreur globale:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
