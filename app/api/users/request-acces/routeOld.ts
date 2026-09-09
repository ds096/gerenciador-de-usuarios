// import { createHash } from "node:crypto";
// import bcrypt from "bcryptjs";
// import { cert, getApps, initializeApp } from "firebase-admin/app";
// import { FieldValue, getFirestore } from "firebase-admin/firestore";
// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// const firebaseAdminApp =
//   getApps().length > 0
//     ? getApps()[0]
//     : initializeApp({
//         credential: cert({
//           projectId: process.env.FIREBASE_PROJECT_ID,
//           clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//           privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//         }),
//       });

// const db = getFirestore(firebaseAdminApp);

// interface RegisterRequestBody {
//   name?: unknown;
//   email?: unknown;
//   password?: unknown;
// }

// function isValidEmail(email: string) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// function isAlreadyExistsError(error: unknown) {
//   if (!error || typeof error !== "object") {
//     return false;
//   }

//   const code = "code" in error ? error.code : undefined;

//   return code === 6 || code === "already-exists";
// }

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as RegisterRequestBody;

//     if (
//       typeof body.name !== "string" ||
//       typeof body.email !== "string" ||
//       typeof body.password !== "string"
//     ) {
//       return NextResponse.json(
//         { message: "Nome, e-mail e senha são obrigatórios." },
//         { status: 400 },
//       );
//     }

//     const name = body.name.trim();
//     const email = body.email.trim().toLowerCase();
//     const password = body.password;

//     if (name.length < 3) {
//       return NextResponse.json(
//         { message: "Informe um nome válido." },
//         { status: 400 },
//       );
//     }

//     if (!isValidEmail(email)) {
//       return NextResponse.json(
//         { message: "Informe um e-mail válido." },
//         { status: 400 },
//       );
//     }

//     if (password.length < 8) {
//       return NextResponse.json(
//         { message: "A senha deve ter pelo menos 8 caracteres." },
//         { status: 400 },
//       );
//     }

//     /*
//      * O hash do e-mail é usado como ID do documento.
//      * Isso impede dois cadastros com o mesmo endereço.
//      */
//     const userId = createHash("sha256").update(email).digest("hex");
//     const userReference = db.collection("users").doc(userId);

//     const passwordHash = await bcrypt.hash(password, 12);

//     await userReference.create({
//       name,
//       email,
//       passwordHash,

//       status: "pending",
//       active: false,
//       emailVerified: false,

//       createdAt: FieldValue.serverTimestamp(),
//       updatedAt: FieldValue.serverTimestamp(),
//     });

//     return NextResponse.json(
//       {
//         message: "Usuário cadastrado com sucesso.",
//         userId,
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     if (isAlreadyExistsError(error)) {
//       return NextResponse.json(
//         { message: "Já existe um usuário cadastrado com este e-mail." },
//         { status: 409 },
//       );
//     }

//     console.error("Erro ao cadastrar usuário:", error);

//     return NextResponse.json(
//       { message: "Não foi possível cadastrar o usuário." },
//       { status: 500 },
//     );
//   }
// }
