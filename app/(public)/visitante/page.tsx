"use client";

import { useState } from "react";
import { Button, Card, Form, Input, Modal, Typography, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default function VisitorPage() {
  const [form] = Form.useForm<RegisterFormData>();
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
    form.resetFields();
  }

  async function handleRegister(values: RegisterFormData) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível realizar o cadastro.");
      }

      messageApi.success(
        "Cadastro realizado. Verifique seu e-mail para continuar.",
      );

      closeModal();
    } catch (error) {
      messageApi.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao realizar o cadastro.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cyan-600 p-4">
      {contextHolder}

      <Card className="w-full max-w-xl text-center shadow-lg">
        <UserAddOutlined className="text-5xl text-cyan-600" />

        <Title level={2} className="mt-4">
          Bem-vindo
        </Title>

        <Paragraph className="text-base text-gray-600">
          Este sistema permite gerenciar sua conta, acompanhar o tempo da
          sessão, receber notificações e solicitar a reativação do usuário. Para
          acessar todas as funcionalidades, faça seu cadastro e valide o
          endereço de e-mail informado.
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<UserAddOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-cyan-600"
        >
          Quero ser um usuário
        </Button>
      </Card>

      <Modal
        title="Cadastro de usuário"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
        >
          <Form.Item
            label="Nome completo"
            name="name"
            rules={[
              {
                required: true,
                message: "Informe seu nome.",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nome completo"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                required: true,
                message: "Informe seu e-mail.",
              },
              {
                type: "email",
                message: "Informe um e-mail válido.",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="nome@exemplo.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[
              {
                required: true,
                message: "Informe uma senha.",
              },
              {
                min: 8,
                message: "A senha deve ter pelo menos 8 caracteres.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Confirme a senha"
            name="passwordConfirmation"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Confirme sua senha.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value === getFieldValue("password")) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("As senhas não são iguais."));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirme a senha"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
            className="bg-cyan-600"
          >
            Cadastrar
          </Button>
        </Form>
      </Modal>
    </main>
  );
}
