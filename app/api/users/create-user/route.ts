import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import bcrypt from "bcryptjs";

import { db } from "@/lib/firebase/admin";

interface RequestAccessBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestAccessBody;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Informe um e-mail válido." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 },
      );
    }

    /*
     * Um hash do e-mail é usado como ID do documento.
     * Isso permite impedir cadastros duplicados de forma segura.
     */
    const userId = createHash("sha256").update(email).digest("hex");
    const userRef = doc(db, "users", userId);
    const passwordHash = await bcrypt.hash(password, 12);

    // Transação: garante que a leitura + escrita ocorram de forma atômica,
    // evitando que duas requisições simultâneas criem o mesmo usuário.
    await runTransaction(db, async (tx) => {
      const existing = await tx.get(userRef);

      if (existing.exists()) {
        throw new Error("ALREADY_EXISTS");
      }

      tx.set(userRef, {
        name,
        email,
        passwordHash,
        emailVerified: false,
        active: true,
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso.",
        userId,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "ALREADY_EXISTS") {
      return NextResponse.json(
        { message: "Já existe um usuário cadastrado com este e-mail." },
        { status: 409 },
      );
    }

    console.error("Erro ao cadastrar usuário:", error);

    return NextResponse.json(
      { message: "Ocorreu um erro ao cadastrar o usuário." },
      { status: 500 },
    );
  }
}
