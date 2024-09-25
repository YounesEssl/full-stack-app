// app/_components/Header.tsx
"use client";
import { Header, Container, Group, Button, Text } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AppHeader() {
  const { data: session } = useSession();

  return (
    <Header height={60} px="md">
      <Container
        size="lg"
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <Link href="/">
          <Text fw={700} size="lg">
            Mon Application
          </Text>
        </Link>
        <Group ml="auto">
          {session ? (
            <>
              <Text>{session.user?.email}</Text>
              <Button onClick={() => signOut()} variant="outline">
                Se déconnecter
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} href="/login">
                Se connecter
              </Button>
              <Button component={Link} href="/register" variant="outline">
                S'inscrire
              </Button>
            </>
          )}
        </Group>
      </Container>
    </Header>
  );
}
