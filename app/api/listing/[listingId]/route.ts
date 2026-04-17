import { APP_CONFIG } from "@/lib/app-config";
import { createAnonymousClient, createSessionClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Databases } from "node-appwrite";

export const GET = async (
  req: NextRequest,
  { params }: { params: { listingId: string } },
) => {
  try {
    const { listingId } = params;
    const { database } = await createAnonymousClient();

    const listing = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      listingId,
    );
    return NextResponse.json(
      {
        message: "Listing fetched successfully",
        listing,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { listingId: string } },
) => {
  try {
    const { listingId } = params;
    const body = await req.json();

    // Utilise le client authentifié pour vérifier que c'est bien le propriétaire
    const { database, account } = await createSessionClient();

    const user = await account.get();

    // Vérifie que le listing appartient bien à l'utilisateur connecté
    const existing = await database.getDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      listingId,
    );

    if (existing.userId !== user.$id) {
      return NextResponse.json(
        { error: "Unauthorized: you don't own this listing" },
        { status: 403 },
      );
    }

    // Champs autorisés à modifier
    const {
      brand,
      model,
      exteriorColor,
      interiorColor,
      condition,
      secondCondition,
      mileage,
      transmission,
      fuelType,
      keyFeatures,
      vin,
      bodyType,
      drivetrain,
      seatingCapacity,
      description,
      price,
      imageUrls,
      contactPhone,
      displayTitle,
    } = body;

    const updatedListing = await database.updateDocument(
      APP_CONFIG.APPWRITE.DATABASE_ID,
      APP_CONFIG.APPWRITE.CAR_LISTING_ID,
      listingId,
      {
        brand,
        model,
        exteriorColor,
        interiorColor,
        condition,
        secondCondition,
        mileage,
        transmission,
        fuelType,
        keyFeatures,
        vin,
        bodyType,
        drivetrain,
        seatingCapacity,
        description,
        price,
        imageUrls,
        contactPhone,
        displayTitle,
      },
    );

    return NextResponse.json(
      { message: "Listing updated successfully", listing: updatedListing },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
