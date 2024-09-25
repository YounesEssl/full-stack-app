"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Container, Title, Button, Card, Group, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

interface Survey {
  id: number;
  title: string;
  description: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys");
        if (response.ok) {
          const data: Survey[] = await response.json();
          setSurveys(data);
        } else {
          console.error("Failed to fetch surveys:", response.status);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sondages:", error);
      }
    };

    if (session) {
      fetchSurveys();
    }
  }, [session]);

  const handleDeleteSurvey = async (id: number) => {
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSurveys(surveys.filter((survey) => survey.id !== id));
        alert("Sondage supprimé avec succès.");
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la suppression du sondage: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du sondage:", error);
      alert("Erreur lors de la suppression du sondage.");
    }
  };

  if (!session) {
    return <p>Vous devez être connecté pour accéder au tableau de bord.</p>;
  }

  return (
    <Container>
      <Title>Tableau de bord</Title>
      <Button onClick={() => router.push("/dashboard/create-survey")} mt="md">
        Créer un nouveau sondage
      </Button>
      {surveys.length > 0 ? (
        surveys.map((survey) => (
          <Card key={survey.id} shadow="sm" p="lg" mt="md">
            <Group position="apart">
              <div>
                <Text weight={500}>{survey.title}</Text>
                <Text size="sm" color="dimmed">
                  {survey.description}
                </Text>
              </div>
              <Group position="right">
                <Button onClick={() => router.push(`/surveys/${survey.id}`)}>
                  Voir les détails
                </Button>
                <Button
                  color="red"
                  onClick={() => handleDeleteSurvey(survey.id)}
                >
                  Supprimer
                </Button>
              </Group>
            </Group>
          </Card>
        ))
      ) : (
        <Text mt="md">Aucun sondage trouvé.</Text>
      )}
    </Container>
  );
}
