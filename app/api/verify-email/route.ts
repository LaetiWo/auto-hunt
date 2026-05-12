// import { createSessionClient } from "@/lib/appwrite";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, secret } = await req.json();

//     const { account } = await createSessionClient();
//     await account.updateVerification(userId, secret);

//     return NextResponse.json({ message: "Email vérifié" });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, secret } = await req.json();

    const { users } = await createAdminClient();
    await users.updateEmailVerification(userId, true);

    return NextResponse.json({ message: "Email vérifié" });
  } catch (error: any) {
    console.error("VERIFY EMAIL error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
