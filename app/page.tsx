"use client";
import { Button, Input, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function loginAsvisitor() {
    router.push("/visitante");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-600">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col gap-4 w-full max-w-sm border border-cyan-100">
        <h1 className="text-cyan-900 text-xl font-bold tracking-tight text-center">
          Gerenciador de Usuários
        </h1>
        <Input
          placeholder="email"
          prefix={<UserOutlined />}
          onChange={(e) => setUser(e.target.value)}
        />
        <Input.Password
          placeholder="Senha"
          prefix={<LockOutlined />}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={() => console.log("tentei fazer login")}>Login</Button>
        <Button onClick={() => loginAsvisitor()}>Acessar como Visitante</Button>
      </div>
    </div>
  );
}
