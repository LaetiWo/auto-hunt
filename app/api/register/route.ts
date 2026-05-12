// import { AUTH_COOKIE_NAME } from "@/constants/server";
// import { createAdminClient, createSessionClient } from "@/lib/appwrite";
// import { signupSchema } from "@/validation/auth.validation";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import { ID } from "node-appwrite";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { email, name, password } = await signupSchema.parse(body);
//     const { account, database } = await createAdminClient();
//     const user = await account.create(ID.unique(), email, password, name);
//     const session = await account.createEmailPasswordSession(email, password);

//     cookies().set(AUTH_COOKIE_NAME, session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//       maxAge: 60 * 60 * 24 * 30,
//     });

//     //Envoie le mail de vérification — utilise la session du nouvel user
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const { Client, Account } = await import("node-appwrite");
//     const client = new Client()
//       .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
//       .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
//       .setSession(session.secret); // ← la session qu'on vient de créer

//     const sessionAccount = new Account(client);
//     await sessionAccount.createVerification(
//       `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
//     );

//     return NextResponse.json({
//       message: "User created successfully",
//       userId: user.$id,
//     });
//   } catch (error: any) {
//     console.error("REGISTER error:", error.message, error.code);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { createAdminClient } from "@/lib/appwrite";
import { signupSchema } from "@/validation/auth.validation";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = await signupSchema.parse(body);
    const { account } = await createAdminClient();

    // Créer le compte
    const user = await account.create(ID.unique(), email, password, name);

    // Session temporaire juste pour envoyer la vérification
    const tempSession = await account.createEmailPasswordSession(
      email,
      password,
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { Client, Account } = await import("node-appwrite");
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setSession(tempSession.secret);

    const sessionAccount = new Account(client);
    await sessionAccount.createVerification(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
    );

    // Supprimer la session — l'user n'est PAS connecté
    await sessionAccount.deleteSession(tempSession.$id);

    return NextResponse.json({
      message: "Compte créé. Vérifiez votre email avant de vous connecter.",
      userId: user.$id,
    });
  } catch (error: any) {
    console.error("REGISTER error:", error.message, error.code);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
