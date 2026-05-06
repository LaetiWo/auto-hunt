import { createAdminClient } from "@/lib/appwrite";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  try {
    const { users } = await createAdminClient();
    const user = await users.get(params.userId);

    return (
      <div className="mx-auto max-w-sm px-4 py-10">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/40 font-semibold text-3xl uppercase">
              {user.name?.charAt(0) || "?"}
              {user.name?.charAt(1) || ""}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-3 text-lg font-bold text-gray-900">{user.name}</h1>
        </div>

        {/* Infos */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/60 p-1.5 space-y-0.5">
              <div className="flex items-center gap-3 rounded-xl p-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Nom
                  </p>
                  <p className="truncate text-sm font-medium text-gray-800">
                    {user.name || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="mx-2.5 h-px bg-gray-200/70" />

              <div className="flex items-center gap-3 rounded-xl p-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium text-gray-800">
                    {user.email || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div className="mx-2.5 h-px bg-gray-200/70" />

              <div className="flex items-center gap-3 rounded-xl p-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Téléphone
                  </p>
                  <p className="truncate text-sm font-medium text-gray-800">
                    {user.phone || "Non renseigné"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch {
    notFound();
  }
}
