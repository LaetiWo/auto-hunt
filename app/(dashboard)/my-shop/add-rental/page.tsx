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
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-4xl mx-auto pt-5">
        <Card className="!bg-transparent shadow-none border-none">
          <CardHeader className="flex items-center justify-center bg-white rounded-[8px] p-4 mb-4">
            <CardTitle className="font-semibold text-xl">
              Ajouter un véhicule à louer
            </CardTitle>
          </CardHeader>

          <CardContent className="bg-white rounded-[8px] p-4 px-6 pb-8">
            <div className="w-full mx-auto">
              <div className="flex items-center">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full"
                  >
                    <div className="space-y-2 pt-3">
                      <h2 className="text-sm font-medium ">
                        Ajouter des photos
                      </h2>
                      <div className="text-sm ">
                        <div>Ajoutez au moins 3 photos du véhicule</div>
                        La première image sera la photo de couverture.
                      </div>
                    </div>
                    <div className="flex items-center justify-start mt-2">
                      <FileUploader onFileUrlsReceived={handleImageUrls}>
                        <ScrollArea className="w-96 whitespace-nowrap ml-3">
                          <div className="w-full flex max-w space-x-4 items-center h-20">
                            {imageUrls?.map(
                              (imageUrl: string, index: number) => (
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
                                    <X className="w-4 h-4 bg-primary hover:bg-primary/80 " />
                                  </button>
                                </div>
                              ),
                            )}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </FileUploader>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-5">
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
                              <FormItem
                                className={`${
                                  field.col ? `col-span-${field.col}` : ""
                                }`}
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
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="mt-6 py-6 mb-4 w-full max-w-xs flex place-items-center bg-primary
                       hover:bg-primary/80  font-semibold justify-self-center"
                      disabled={isPending}
                    >
                      {isPending && <Loader className="w-4 h-4 animate-spin" />}
                      Publier la location
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AddRental;
