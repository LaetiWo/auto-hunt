"use client";

import { listingSchema } from "@/validation/listing.validation";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { addListingFields } from "@/constants/listing-fields";
import FormGenerator from "@/components/FromGenerator";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getSingleListingQueryFn,
  updateListingMutationFn,
} from "@/lib/fetcher";
import {
  CAR_BRAND_OPTIONS,
  CAR_COLOR_OPTIONS,
  CAR_MODEL_OPTIONS,
} from "@/constants/car-options";
import { toast } from "@/hooks/use-toast";

import { use } from "react";

// const EditListing = ({ params }: { params: { vehicleId: string } }) => {
//   const router = useRouter();
//   const { vehicleId } = params;

//   const { data, isPending: isLoading } = useQuery({
//     queryKey: ["listing", vehicleId],
//     queryFn: () => getSingleListingQueryFn(vehicleId),
//   });

const EditListing = ({ params }: { params: { vehicleId: string } }) => {
  const router = useRouter();
  const { vehicleId } = params;

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["listing", vehicleId],
    queryFn: () => getSingleListingQueryFn(vehicleId),
    enabled: !!vehicleId,
  });

  const listing = data?.listing;

  const { mutate, isPending } = useMutation({
    mutationFn: updateListingMutationFn,
  });

  const listingClientSchema = listingSchema.extend({
    contactPhone: z
      .string({ required_error: "Contact number is required" })
      .refine(isValidPhoneNumber, "Invalid phone number"),
  });

  type FormDataType = z.infer<typeof listingClientSchema>;
  type FormFieldName = keyof FormDataType;

  const form = useForm<FormDataType>({
    resolver: zodResolver(listingClientSchema),
    mode: "onBlur",
    defaultValues: {
      brand: "",
      model: "",
      exteriorColor: "",
      interiorColor: "",
      condition: "",
      secondCondition: [],
      mileage: "",
      transmission: "",
      fuelType: "",
      keyFeatures: [],
      vin: "",
      bodyType: "",
      drivetrain: "",
      seatingCapacity: "",
      description: "",
      price: 0,
      imageUrls: [],
      contactPhone: "",
    },
  });

  useEffect(() => {
    if (listing) {
      console.log("listing data:", {
        transmission: listing.transmission,
        fuelType: listing.fuelType,
        condition: listing.condition,
        bodyType: listing.bodyType,
        drivetrain: listing.drivetrain,
      });
      form.reset({
        brand: listing.brand || "",
        model: listing.model || "",
        exteriorColor: listing.exteriorColor || "",
        interiorColor: listing.interiorColor || "",
        condition: listing.condition || "",
        secondCondition: listing.secondCondition || [],
        mileage: listing.mileage || "",
        transmission: listing.transmission || "",
        fuelType: listing.fuelType || "",
        keyFeatures: listing.keyFeatures || [],
        vin: listing.vin || "",
        bodyType: listing.bodyType || "",
        drivetrain: listing.drivetrain || "",
        seatingCapacity: listing.seatingCapacity || "",
        description: listing.description || "",
        price: listing.price || 0,
        imageUrls: listing.imageUrls || [],
        contactPhone: listing.contactPhone || "",
      });
    }
  }, [listing, form]);

  const imageUrls = useWatch({ control: form.control, name: "imageUrls" });
  const brand = useWatch({ control: form.control, name: "brand" });

  const handleImageUrls = (urls: string[]) => {
    form.setValue("imageUrls", [...form.getValues().imageUrls, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...form.getValues().imageUrls];
    updated.splice(index, 1);
    form.setValue("imageUrls", updated);
  };

  const getLabel = (
    value: string,
    options: { value: string; label: string }[],
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  function onSubmit(values: FormDataType) {
    const { brand, model, condition, exteriorColor } = values;
    const displayTitle = [
      condition === "BRAND_NEW" ? "New" : null,
      getLabel(brand, CAR_BRAND_OPTIONS),
      getLabel(model, CAR_MODEL_OPTIONS),
      exteriorColor !== "other"
        ? getLabel(exteriorColor, CAR_COLOR_OPTIONS)
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    mutate(
      { id: vehicleId, data: { ...values, displayTitle } },
      {
        onSuccess: () => {
          toast({
            title: "Annonce modifiée avec succès",
            description: "Vos modifications sont maintenant en ligne",
            variant: "success",
          });
          router.push("/my-shop");
        },
        onError: (error) => {
          toast({
            title: "Une erreur s'est produite",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  }

  if (isLoading || !listing)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/80 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Modifier l&apos;annonce
          </h1>
          <p className="text-muted-foreground text-sm">
            Mettez à jour les informations de votre véhicule
          </p>
        </div>

        <Card className="border border-border/50 shadow-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Images Section */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground mb-1">
                      Photos du véhicule
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      La première image sera la photo de couverture.
                    </p>
                  </div>
                  <FileUploader onFileUrlsReceived={handleImageUrls}>
                    <ScrollArea className="w-full">
                      <div className="flex gap-3 pb-3">
                        {imageUrls?.map((imageUrl: string, index: number) => (
                          <div
                            key={`id-${index}`}
                            className="relative overflow-hidden w-24 h-24 flex-shrink-0 rounded-lg border border-border/50 bg-muted/30"
                          >
                            <img
                              src={imageUrl}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 p-1.5 bg-destructive hover:bg-destructive/90 rounded-full transition-colors shadow-sm"
                            >
                              <X className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </FileUploader>
                </div>

                {/* Form Fields */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Informations du véhicule
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {addListingFields.map((field, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={field.name as FormFieldName}
                        disabled={field.disabled || isPending}
                        render={({ field: formField }) => {
                          const filteredModels =
                            field.name === "model" && brand
                              ? field?.options?.filter((m) => m.key === brand)
                              : [];
                          const valueMultiSelect =
                            field.fieldType === "multiselect"
                              ? Array.isArray(formField.value)
                                ? formField.value
                                : []
                              : [];
                          return (
                            <FormItem>
                              <FormControl>
                                <FormGenerator
                                  field={{
                                    ...field,
                                    options:
                                      field.name === "model"
                                        ? filteredModels
                                        : field.options,
                                  }}
                                  register={form.register}
                                  errors={form.formState.errors}
                                  formValue={formField.value}
                                  valueMultiSelect={valueMultiSelect}
                                  onChange={formField.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="px-8 h-11 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                    disabled={isPending}
                  >
                    {isPending && (
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {isPending
                      ? "Enregistrement..."
                      : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EditListing;
