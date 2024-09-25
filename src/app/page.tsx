"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Title, Text, Container, Button, Group, Card } from "@mantine/core";
import { useRouter } from "next/navigation";

interface Survey {
  id: number;
  title: string;
  description: string;
  user: {
    id: number; // Assurez-vous que c'est bien un nombre ici
    name: string | null;
    email: string;
  };
}

export default function Home() {
  const { data: session } = useSession();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      const response = await fetch("/api/surveys/all");
      if (response.ok) {
        const data: Survey[] = await response.json();
        setSurveys(data);
      } else {
        console.error("Failed to fetch surveys:", response.status);
      }
    };

    fetchSurveys();
  }, []);

  const handleSurveyClick = (id: number) => {
    router.push(`/surveys/${id}`);
  };

  return (
    <Container size="sm" my={40}>
      <Title align="center">Bienvenue sur votre application Full Stack</Title>
      <Text align="center" mt="md">
        {session
          ? `Connecté en tant que ${session.user?.email}`
          : "Vous n'êtes pas connecté"}
      </Text>

      <Group position="center" mt="xl">
        {session ? (
          <>
            <Button onClick={() => signOut()} variant="outline">
              Se déconnecter
            </Button>
            <Button onClick={() => router.push("/dashboard")}>
              Aller au Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => router.push("/login")}>Se connecter</Button>
            <Button onClick={() => router.push("/register")} variant="outline">
              S'inscrire
            </Button>
          </>
        )}
      </Group>

      <Title order={2} mt="xl">
        Tous les sondages
      </Title>

      {surveys.length > 0 ? (
        surveys.map((survey) => (
          <Card key={survey.id} shadow="sm" p="lg" mt="md">
            <Title
              order={4}
              onClick={() => handleSurveyClick(survey.id)}
              style={{ cursor: "pointer" }}
            >
              {survey.title}
            </Title>
            <Text size="sm" color="dimmed">
              {survey.description}
            </Text>
            <Text size="xs" color="dimmed" mt="xs">
              Créé par :{" "}
              {survey.user?.name || survey.user?.email || "Utilisateur inconnu"}
            </Text>
            {session && survey.user.id === Number(session.user.id) ? (
              <Button onClick={() => handleSurveyClick(survey.id)} mt="md">
                Voir le sondage
              </Button>
            ) : (
              <Button onClick={() => handleSurveyClick(survey.id)} mt="md">
                Noter le sondage
              </Button>
            )}
          </Card>
        ))
      ) : (
        <Text mt="md">Aucun sondage disponible pour le moment.</Text>
      )}
    </Container>
  );
}
