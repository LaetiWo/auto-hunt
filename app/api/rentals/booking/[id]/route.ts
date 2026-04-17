import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { APP_CONFIG } from "@/lib/app-config";
import { emailService } from "@/lib/email-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { database } = await createAdminClient();

    const booking = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "rentals",
      params.id,
    );

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { status } = await request.json();
    const { database } = await createAdminClient();

    const booking = await database.updateDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "rentals",
      params.id,
      { status },
    );

    if (booking.vehicleId) {
      let vehicleStatus = "available";

      if (status === "confirmed" || status === "ongoing") {
        vehicleStatus = "rented";
      } else if (status === "completed" || status === "cancelled") {
        vehicleStatus = "available";
      }

      await database.updateDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        "car-listing",
        booking.vehicleId,
        { rentalStatus: vehicleStatus },
      );
    }

    if (status === "confirmed") {
      try {
        await emailService.sendBookingConfirmation(booking);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
