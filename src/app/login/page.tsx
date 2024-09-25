// app/login/page.tsx
"use client";
import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
} from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard"); // Redirige vers le tableau de bord
    } else {
      alert("Échec de la connexion");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center">Se connecter</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            id="email"
            placeholder="votre.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Mot de passe"
            id="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            Se connecter
          </Button>
        </form>
        <Text align="center" mt="md">
          Pas de compte ? <Link href="/register">S'inscrire</Link>
        </Text>
      </Paper>
    </Container>
  );
}
