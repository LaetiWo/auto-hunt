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
      <div className="flex justify-center pt-20">
        <Loader className="animate-spin" />
      </div>
    );
  return (
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-4xl mx-auto pt-5">
        <Card className="!bg-transparent shadow-none border-none">
          <CardHeader className="flex items-center justify-center bg-white rounded-[8px] p-4 mb-4">
            <CardTitle className="font-semibold text-xl">
              Modifier l'annonce
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-white rounded-[8px] p-4 px-6 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="space-y-2 pt-3">
                  <h2 className="text-sm font-medium">Photos</h2>
                  <div className="text-sm">
                    La première image sera la photo de couverture.
                  </div>
                </div>

                <div className="flex items-center justify-start mt-2">
                  <FileUploader onFileUrlsReceived={handleImageUrls}>
                    <ScrollArea className="w-96 whitespace-nowrap ml-3">
                      <div className="w-full flex space-x-4 items-center h-20">
                        {imageUrls?.map((imageUrl: string, index: number) => (
                          <div
                            key={`id-${index}`}
                            className="relative overflow-hidden w-20 h-20 rounded-[8px]"
                          >
                            <img
                              src={imageUrl}
                              alt=""
                              width={80}
                              height={80}
                              className="w-full h-full rounded-[8px] object-cover"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 p-1 bg-black rounded-full"
                            >
                              <X className="w-4 h-4 bg-primary hover:bg-primary/80" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </FileUploader>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-5">
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
                          <FormItem
                            className={field.col ? `col-span-${field.col}` : ""}
                          >
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

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 py-6 mb-4 w-full max-w-xs flex place-items-center bg-primary hover:bg-primary/80 font-semibold justify-self-center"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Enregistrer les modifications
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EditListing;
