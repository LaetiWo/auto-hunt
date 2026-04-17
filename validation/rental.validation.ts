import {
  CAR_BODY_TYPE_OPTIONS,
  CAR_BRAND_OPTIONS,
  CAR_COLOR_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUELTYPE_OPTIONS,
  CAR_KEY_FEATURES_OPTIONS,
  CAR_MODEL_OPTIONS,
  CAR_TRANSMISSION_OPTIONS,
} from "@/constants/car-options";
import { z } from "zod";
import { CAR_DRIVETRAIN_OPTIONS } from "../constants/car-options";

const createEnum = (options: { value: string }[], fieldName: string) => {
  const values = options.map((item) => item.value);
  if (values.length === 0) {
    throw new Error(`No options found for ${fieldName}`);
  }
  return z.enum(values as [string, ...string[]], {
    errorMap: (issue, ctx) => {
      if (issue.code === "invalid_enum_value") {
        return { message: `Please select a valid ${fieldName}` };
      }
      return { message: ctx.defaultError };
    },
  });
};

const CarBrandEnum = createEnum(CAR_BRAND_OPTIONS, "brand");
const CarModelEnum = createEnum(CAR_MODEL_OPTIONS, "model");
const CarColorEnum = createEnum(CAR_COLOR_OPTIONS, "exteriorColor");
const CarConditionEnum = createEnum(CAR_CONDITION_OPTIONS, "condition");
const CarTransmissionEnum = createEnum(
  CAR_TRANSMISSION_OPTIONS,
  "transmission",
);
const CarFuelTypeEnum = createEnum(CAR_FUELTYPE_OPTIONS, "fuelType");
const CarKeyFeaturesEnum = createEnum(CAR_KEY_FEATURES_OPTIONS, "keyFeatures");
const CarBodyTypeEnum = createEnum(CAR_BODY_TYPE_OPTIONS, "bodyType");
const CarDriveTrainEnum = createEnum(CAR_DRIVETRAIN_OPTIONS, "drivetrain");

export const rentalSchema = z.object({
  brand: CarBrandEnum,
  model: CarModelEnum,
  exteriorColor: CarColorEnum,
  interiorColor: CarColorEnum.optional(),
  condition: CarConditionEnum,
  currentMileage: z.number().min(0, "Invalid mileage").optional(),
  transmission: CarTransmissionEnum,
  fuelType: CarFuelTypeEnum,
  keyFeatures: z.array(CarKeyFeaturesEnum).optional(),
  bodyType: CarBodyTypeEnum,
  drivetrain: CarDriveTrainEnum,
  seatingCapacity: z
    .number()
    .int()
    .min(1, "Invalid seating capacity")
    .optional(),
  description: z.string().optional(),
  dailyRentalPrice: z.number().min(1, "Le prix journalier est requis"),
  minimumRentalDays: z.number().min(1).optional(),
  depositAmount: z.number().min(0).optional(),
  rentalStatus: z
    .enum(["available", "rented", "maintenance"])
    .default("available"),
  imageUrls: z.array(z.string()).min(3, "At least 3 images required"),
});

export const rentalBackendSchema = rentalSchema.extend({
  displayTitle: z
    .string({
      required_error: "Display Title is required",
    })
    .min(1, "Display Title is required"),
  contactPhone: z
    .string({
      required_error: "Le téléphone de contact est requis",
    })
    .min(1, "Le téléphone de contact est requis"),
});
