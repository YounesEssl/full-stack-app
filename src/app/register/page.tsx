"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Data sent to API:", { email, password });

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      await signIn("credentials", { redirect: false, email, password });
      router.push("/");
    } else {
      // Gérer les erreurs
      const errorData = await res.json();
      console.error("API error:", errorData);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Créer un compte</Title>
      <Text color="dimmed" size="sm" ta="center" mt={5}>
        Déjà un compte ?{" "}
        <Link href="/login">
          <Text component="span" color="blue" variant="link">
            Se connecter
          </Text>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            id="email"
            placeholder="votre.email@example.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Mot de passe"
            id="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            S'inscrire
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
