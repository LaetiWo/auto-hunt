import "server-only";
import { APP_CONFIG } from "./app-config";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createAnonymousClient } from "./appwrite";

export const DATABASE_ID = APP_CONFIG.APPWRITE.DATABASE_ID;
export const RENTALS_COLLECTION_ID = "rentals";
export const VEHICLES_COLLECTION_ID = APP_CONFIG.APPWRITE.CAR_LISTING_ID;

export interface Rental {
  $id?: string;
  vehicleId: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  driverLicense: string;
  licenseExpiry?: string;
  startDate: string;
  endDate: string;
  dailyPrice: number;
  totalPrice: number;
  pickupLocation: string;
  returnLocation: string;
  status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";
  $createdAt?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const rentalService = {
  async create(rentalData: Omit<Rental, "$id" | "$createdAt">) {
    const { database } = await createAdminClient();

    const response = await database.createDocument(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      ID.unique(),
      rentalData,
    );

    return response;
  },

  async getAll() {
    const { database } = await createAnonymousClient();

    const response = await database.listDocuments(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      [Query.orderDesc("$createdAt")],
    );

    return response.documents;
  },

  async getById(rentalId: string) {
    const { database } = await createAnonymousClient();

    const response = await database.getDocument(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      rentalId,
    );

    return response;
  },

  async getByVehicle(vehicleId: string) {
    const { database } = await createAnonymousClient();

    const response = await database.listDocuments(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      [Query.equal("vehicleId", vehicleId), Query.orderDesc("$createdAt")],
    );

    return response.documents;
  },

  async getByClient(clientId: string) {
    const { database } = await createAnonymousClient();

    const response = await database.listDocuments(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      [Query.equal("clientId", clientId), Query.orderDesc("$createdAt")],
    );

    return response.documents;
  },

  async checkAvailability(vehicleId: string, startDate: Date, endDate: Date) {
    const { database } = await createAnonymousClient();

    const response = await database.listDocuments(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      [
        Query.equal("vehicleId", vehicleId),
        Query.notEqual("status", "cancelled"),
        Query.notEqual("status", "completed"),
      ],
    );

    const rentals = response.documents;

    for (const rental of rentals) {
      const rentalStart = new Date(rental.startDate);
      const rentalEnd = new Date(rental.endDate);

      const hasOverlap =
        (startDate >= rentalStart && startDate <= rentalEnd) ||
        (endDate >= rentalStart && endDate <= rentalEnd) ||
        (startDate <= rentalStart && endDate >= rentalEnd);

      if (hasOverlap) {
        return false;
      }
    }

    return true;
  },

  async getUnavailableDates(vehicleId: string) {
    const { database } = await createAnonymousClient();

    const response = await database.listDocuments(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      [
        Query.equal("vehicleId", vehicleId),
        Query.notEqual("status", "cancelled"),
        Query.notEqual("status", "completed"),
      ],
    );

    const rentals = response.documents;

    return rentals.map((rental) => ({
      startDate: new Date(rental.startDate),
      endDate: new Date(rental.endDate),
    }));
  },

  async updateStatus(rentalId: string, status: Rental["status"]) {
    const { database } = await createAdminClient();

    const response = await database.updateDocument(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      rentalId,
      { status },
    );

    return response;
  },

  async update(
    rentalId: string,
    updateData: Partial<Omit<Rental, "$id" | "$createdAt">>,
  ) {
    const { database } = await createAdminClient();

    const response = await database.updateDocument(
      DATABASE_ID,
      RENTALS_COLLECTION_ID,
      rentalId,
      updateData,
    );

    return response;
  },

  async delete(rentalId: string) {
    const { database } = await createAdminClient();

    await database.deleteDocument(DATABASE_ID, RENTALS_COLLECTION_ID, rentalId);
  },

  calculateTotalPrice(dailyPrice: number, startDate: Date, endDate: Date) {
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days * dailyPrice;
  },

  calculateDays(startDate: Date, endDate: Date) {
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  },
};
