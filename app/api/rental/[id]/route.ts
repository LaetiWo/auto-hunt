import { NextRequest, NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/app-config";
import { createAnonymousClient } from "@/lib/appwrite";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { database } = await createAnonymousClient();

    const rental = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      "car-listing",
      params.id,
    );

    return NextResponse.json(rental);
  } catch (error: any) {
    console.error("Error fetching rental:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rental" },
      { status: 500 },
    );
  }
}
