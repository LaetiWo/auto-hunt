// "use client";

// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// const editProfileSchema = z.object({
//   ownerName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
//   ownerEmail: z.string().email("Email invalide"),
//   ownerPhone: z.string().min(8, "Numéro invalide").optional().or(z.literal("")),
//   description: z.string().max(500, "Max 500 caractères").optional(),
// });

// type EditProfileFormValues = z.infer<typeof editProfileSchema>;

// // 👇 Remplace par tes vraies données / hook API
// const defaultValues: EditProfileFormValues = {
//   ownerName: "",
//   ownerEmail: "",
//   ownerPhone: "",
//   description: "",
// };

// const FieldRow = ({
//   icon: Icon,
//   label,
//   children,
// }: {
//   icon: React.ElementType;
//   label: string;
//   children: React.ReactNode;
// }) => (
//   <div className="flex items-start gap-3">
//     <div className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//       <Icon className="h-4 w-4" />
//     </div>
//     <div className="flex-1">{children}</div>
//   </div>
// );

// export default function EditProfilePage() {
//   const router = useRouter();

//   const form = useForm<EditProfileFormValues>({
//     resolver: zodResolver(editProfileSchema),
//     defaultValues,
//   });

//   const onSubmit = async (values: EditProfileFormValues) => {
//     console.log(values);
//     // TODO: appel API pour sauvegarder
//     router.back();
//   };

//   return (
//     <div className="mx-auto max-w-lg px-4 py-6">
//       {/* Header */}
//       <div className="mb-6 flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//         </button>
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">
//             Modifier le profil
//           </h1>
//           <p className="text-xs text-gray-400">
//             Mettez à jour vos informations personnelles
//           </p>
//         </div>
//       </div>

//       <Card className="border-none shadow-sm">
//         <CardContent className="p-4">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FieldRow icon={User} label="Nom">
//                 <FormField
//                   control={form.control}
//                   name="ownerName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
//                         Nom
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Votre nom"
//                           className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </FieldRow>

//               <FieldRow icon={Mail} label="Email">
//                 <FormField
//                   control={form.control}
//                   name="ownerEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
//                         Email
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="email"
//                           placeholder="votre@email.com"
//                           className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </FieldRow>

//               <FieldRow icon={Phone} label="Téléphone">
//                 <FormField
//                   control={form.control}
//                   name="ownerPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
//                         Téléphone
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           type="tel"
//                           placeholder="+261 34 00 000 00"
//                           className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </FieldRow>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
//                       Description
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Parlez un peu de vous ou de votre boutique..."
//                         className="resize-none rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
//                         rows={4}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="w-full rounded-xl gap-2"
//                 disabled={form.formState.isSubmitting}
//               >
//                 <Save className="h-4 w-4" />
//                 {form.formState.isSubmitting
//                   ? "Enregistrement..."
//                   : "Enregistrer"}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react";
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
import useCurrentUser from "@/hooks/api/use-current-user";

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
  const { data, isPending } = useCurrentUser();

  // data retourne { user: { $id, name, email, phone }, listings }
  const user = data?.user;

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      description: "",
    },
  });

  // Pré-remplir le formulaire dès que les données sont disponibles
  useEffect(() => {
    if (user) {
      form.reset({
        ownerName: user.name ?? "",
        ownerEmail: user.email ?? "",
        ownerPhone: user.phone ?? "",
        description: "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      await fetch("/api/current-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName: values.ownerName,
          ownerPhone: values.ownerPhone,
        }),
      });
      router.back();
    } catch (error) {
      console.error(error);
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
                            placeholder="votre@email.com"
                            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
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
                  disabled={form.formState.isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  {form.formState.isSubmitting
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
