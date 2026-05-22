"use client";

import { rentalSchema } from "@/validation/rental.validation";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { addRentalFields } from "@/constants/rental-fields";
import FormGenerator from "@/components/FromGenerator";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader, X } from "lucide-react";
import useCurrentUser from "@/hooks/api/use-current-user";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { addRentalMutationFn } from "@/lib/fetcher";
import {
  CAR_BRAND_OPTIONS,
  CAR_COLOR_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_MODEL_OPTIONS,
} from "@/constants/car-options";
import { toast } from "@/hooks/use-toast";

const AddRental = () => {
  const router = useRouter();
  const { data } = useCurrentUser();
  const shop = data?.shop;
  const user = data?.user;

  const { mutate, isPending } = useMutation({
    mutationFn: addRentalMutationFn,
  });

  const rentalClientSchema = rentalSchema.extend({
    contactPhone: z
      .string({
        required_error: "Contact number is required",
      })
      .refine(isValidPhoneNumber, "Invalid phone number"),
  });

  type FormDataType = z.infer<typeof rentalClientSchema>;
  type FormFieldName = keyof FormDataType;

  const form = useForm<FormDataType>({
    resolver: zodResolver(rentalClientSchema),
    mode: "onBlur",
    defaultValues: {
      brand: "",
      model: "",
      exteriorColor: "",
      interiorColor: "",
      condition: "",
      currentMileage: undefined,
      transmission: "",
      fuelType: "",
      keyFeatures: [],
      bodyType: "",
      drivetrain: "",
      seatingCapacity: undefined,
      description: "",
      dailyRentalPrice: 0,
      minimumRentalDays: 1,
      depositAmount: 0,
      rentalStatus: "available",
      imageUrls: [],
    },
  });

  console.log("FORM ERRORS", form.formState.errors);

  const imageUrls = useWatch({
    control: form.control,
    name: "imageUrls",
  });

  const brand = useWatch({
    control: form.control,
    name: "brand",
  });

  const handleImageUrls = (imageUrls: string[]) => {
    form.setValue("imageUrls", [...form.getValues().imageUrls, ...imageUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImageUrls = [...form.getValues().imageUrls];
    updatedImageUrls.splice(index, 1);
    form.setValue("imageUrls", updatedImageUrls);
  };

  const getLabel = (
    value: string,
    options: { value: string; label: string }[],
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  function onSubmit(values: FormDataType) {
    console.log("SUBMIT VALUES:", values);

    const { brand, model, condition, exteriorColor } = values;
    const displayTitle = [
      condition === "BRAND_NEW" ? "New" : null,
      getLabel(brand, CAR_BRAND_OPTIONS),
      getLabel(model, CAR_MODEL_OPTIONS),
      exteriorColor !== "other"
        ? getLabel(exteriorColor, CAR_COLOR_OPTIONS)
        : null,
      "- Location",
    ]
      .filter(Boolean)
      .join(" ");

    const payload: any = {
      brand: values.brand,
      model: values.model,
      exteriorColor: values.exteriorColor,
      interiorColor: values.interiorColor,
      condition: values.condition,
      currentMileage: values.currentMileage,
      transmission: values.transmission,
      fuelType: values.fuelType,
      keyFeatures: values.keyFeatures,
      bodyType: values.bodyType,
      drivetrain: values.drivetrain,
      seatingCapacity: values.seatingCapacity
        ? String(values.seatingCapacity)
        : "",
      description: values.description,
      imageUrls: values.imageUrls,
      displayTitle,
      shopId: shop?.$id,
      userId: user?.$id,
      availableForRental: true,
      price: values.dailyRentalPrice || 0,
      dailyRentalPrice: values.dailyRentalPrice,
      rentalStatus: values.rentalStatus,
      contactPhone: values.contactPhone,
    };

    delete payload.minimumRentalDays;
    delete payload.depositAmount;

    mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Location ajoutée avec succès",
          description: "Votre véhicule est maintenant disponible à la location",
          variant: "success",
        });
        router.push("/my-shop");
      },
      onError: (error) => {
        toast({
          title: "Une erreur est survenue",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/80 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Ajouter un véhicule à louer
          </h1>
          <p className="text-muted-foreground text-sm">
            Remplissez les détails de votre véhicule à mettre en location
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
                      Ajoutez au moins 3 photos. La première sera la couverture.
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
                    {addRentalFields.map((field, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={field.name as FormFieldName}
                        disabled={field.disabled || isPending}
                        render={({ field: formField }) => {
                          const filteredModels =
                            field.name === "model" && brand
                              ? field?.options?.filter(
                                  (model) => model.key === brand,
                                )
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
                    {isPending ? "Publication..." : "Publier la location"}
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

export default AddRental;
