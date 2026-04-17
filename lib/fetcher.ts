import {
  AllCarListingPayLoadType,
  ListingType,
  LoginType,
  RegisterType,
} from "@/@types/api.type";
import axios from "axios";

export const registerMutationFn = async (data: RegisterType) =>
  await axios.post("/api/register", data);

export const loginMutationFn = async (data: LoginType) =>
  await axios.post("/api/login", data);

export const logoutMutationFn = async () => await axios.post("/api/logout");

export const getCurrentUserQueryFn = async () => {
  const response = await axios.get("/api/current-user");
  return response.data;
};

export const addListingMutationFn = async (data: ListingType) =>
  await axios.post("/api/add-listing", data);

export const addRentalMutationFn = async (data: any) =>
  await axios.post("/api/rental", data);

export const getAllRentalsQueryFn = async () => {
  const response = await axios.get("/api/rental");
  return response.data;
};

export const getSingleRentalQueryFn = async (rentalId: string) => {
  const response = await axios.get(`/api/rental/${rentalId}`);
  return response.data;
};

export const getAllBookingsQueryFn = async () => {
  const response = await axios.get("/api/rentals/booking");
  return response.data;
};

export const getBookingByIdQueryFn = async (bookingId: string) => {
  const response = await axios.get(`/api/rentals/booking/${bookingId}`);
  return response.data;
};

export const updateBookingStatusMutationFn = async (
  bookingId: string,
  status: string,
) => {
  const response = await axios.patch(`/api/rentals/booking/${bookingId}`, {
    status,
  });
  return response.data;
};

export const addPurchaseRequestMutationFn = async (data: {
  vehicleId: string;
  sellerId: string;
  message?: string;
  vehicleTitle: string;
  vehicleSlug: string;
  sellerEmail: string;
  sellerName: string;
  type?: string;
}) => {
  const response = await fetch("/api/purchase-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create purchase request");
  return response.json();
};

export const getPurchaseRequestsQueryFn = async (role: "buyer" | "seller") => {
  const response = await fetch(`/api/purchase-requests?role=${role}`);
  if (!response.ok) throw new Error("Failed to fetch purchase requests");
  return response.json();
};

export const updatePurchaseRequestMutationFn = async ({
  id,
  status,
}: {
  id: string;
  status: "accepted" | "rejected";
}) => {
  const response = await fetch(`/api/purchase-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update purchase request");
  return response.json();
};

export const getMyBookingsQueryFn = async (role: "renter" | "owner") => {
  const response = await fetch(`/api/rentals/booking?role=${role}`);
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

export const getAllCarListingQueryFn = async ({
  brand,
  model,
  color,
  condition,
  keyword,
  price,
  year_min,
  year_max,
  fuelType,
}: AllCarListingPayLoadType) => {
  const baseUrl = `/api/listing`;

  const queryParams = new URLSearchParams();
  if (brand && brand.length !== 0) queryParams.append("brand", brand.join(","));
  if (model && model.length !== 0) queryParams.append("model", model.join(","));
  if (color && color.length !== 0) queryParams.append("color", color.join(","));
  if (fuelType && fuelType.length !== 0)
    queryParams.append("fuelType", fuelType.join(","));
  if (condition && condition.length !== 0)
    queryParams.append("condition", condition.join(","));
  if (price) queryParams.append("price", price);
  if (keyword) queryParams.append("keyword", keyword);
  if (year_min) queryParams.append("year_min", year_min?.toString());
  if (year_max) queryParams.append("year_max", year_max?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await axios.get(url);
  return response.data;
};

export const getMyShopQueryFn = async () => {
  const response = await axios.get("/api/shop/my-shop");
  return response.data;
};

export const getSingleListingQueryFn = async (listingId: string) => {
  const response = await axios.get(`/api/listing/${listingId}`);
  return response.data;
};

export const updateListingMutationFn = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  const response = await axios.patch(`/api/listing/${id}`, data);
  return response.data;
};
