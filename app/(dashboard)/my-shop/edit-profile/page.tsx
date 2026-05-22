"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Mail, Phone, Save, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCurrentUser from "@/hooks/api/use-current-user";
import { useQueryClient } from "@tanstack/react-query";

const editProfileSchema = z.object({
  ownerName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  ownerEmail: z.string().email("Email invalide"),
  ownerPhone: z.string().min(8, "Numéro invalide").optional().or(z.literal("")),
  description: z.string().max(500, "Max 500 caractères").optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const FieldRow = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending } = useCurrentUser();
  const user = data?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ownerName: user.name ?? "",
        ownerEmail: user.email ?? "",
        ownerPhone: user.phone ?? "",
        description: user.prefs?.description ?? "",
      });
      if (user.prefs?.avatarUrl) {
        setAvatarPreview(user.prefs.avatarUrl);
      }
    }
  }, [user, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;
    const formData = new FormData();
    formData.append("files", avatarFile);
    const res = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.files?.[0]?.url ?? null;
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      setIsUploading(true);
      let avatarUrl: string | undefined = undefined;

      if (avatarFile) {
        const uploaded = await uploadAvatar();
        if (uploaded) avatarUrl = uploaded;
      }

      await fetch("/api/current-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: values.ownerName,
          ownerPhone: values.ownerPhone,
          description: values.description,
          ...(avatarUrl !== undefined && { avatarUrl }),
        }),
      });

      //  invalide le cache pour forcer le rechargement
      await queryClient.invalidateQueries({ queryKey: ["my-shop"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Modifier le profil
          </h1>
          <p className="text-xs text-gray-400">
            Mettez à jour vos informations personnelles
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          {isPending ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-8 h-9 w-9 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-2 pt-6">
                    <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                    <div className="h-10 w-full rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-2 mb-2">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary/20">
                      <AvatarImage src={avatarPreview ?? undefined} />
                      <AvatarFallback className="bg-primary/40 font-semibold text-3xl uppercase">
                        {user?.name?.charAt(0) || "?"}
                        {user?.name?.charAt(1) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Cliquez sur l'icône pour changer la photo
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <FieldRow icon={User}>
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Nom
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Votre nom"
                            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldRow>

                <FieldRow icon={Mail}>
                  <FormField
                    control={form.control}
                    name="ownerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled
                            placeholder="votre@email.com"
                            className="rounded-xl border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldRow>

                <FieldRow icon={Phone}>
                  <FormField
                    control={form.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Téléphone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+261 34 00 000 00"
                            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FieldRow>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Parlez un peu de vous ou de votre boutique..."
                          className="resize-none rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full rounded-xl gap-2"
                  disabled={form.formState.isSubmitting || isUploading}
                >
                  <Save className="h-4 w-4" />
                  {isUploading
                    ? "Upload en cours..."
                    : form.formState.isSubmitting
                      ? "Enregistrement..."
                      : "Enregistrer"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
