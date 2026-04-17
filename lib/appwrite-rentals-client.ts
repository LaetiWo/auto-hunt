import axios from "axios";

export const rentalService = {
  async create(rentalData: any) {
    const response = await axios.post("/api/rentals/booking", rentalData);
    return response.data;
  },

  async checkAvailability(vehicleId: string, startDate: Date, endDate: Date) {
    const response = await axios.post("/api/rentals/check-availability", {
      vehicleId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return response.data.available;
  },

  calculateTotalPrice(
    dailyPrice: number,
    startDate: Date,
    endDate: Date,
  ): number {
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days * dailyPrice;
  },

  calculateDays(startDate: Date, endDate: Date): number {
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  },
};
