import { NextRequest, NextResponse } from "next/server";
import { rentalService } from "@/lib/appwrite-rentals-server";

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, startDate, endDate } = await request.json();

    const available = await rentalService.checkAvailability(
      vehicleId,
      new Date(startDate),
      new Date(endDate),
    );

    return NextResponse.json({ available });
  } catch (error: any) {
    console.error("Error checking availability:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
