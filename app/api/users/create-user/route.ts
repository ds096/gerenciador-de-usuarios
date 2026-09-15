import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { doc, runTransaction, Timestamp } from "firebase/firestore";

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

    const userId = createHash("sha256").update(email).digest("hex");

    const userRef = doc(db, "users", userId);

    const passwordHash = await bcrypt.hash(password, 12);

    // Data usada como base para criação e validade.
    const createdAt = new Date();

    // Cria uma nova data com validade de um ano.
    const expireAt = new Date(createdAt);
    expireAt.setFullYear(expireAt.getFullYear() + 1);

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

        createdAt: Timestamp.fromDate(createdAt),
        updatedAt: Timestamp.fromDate(createdAt),
        expireAt: Timestamp.fromDate(expireAt),
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
