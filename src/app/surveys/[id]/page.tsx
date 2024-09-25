import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Button,
  Textarea,
  Select,
  Alert,
} from "@mantine/core";

interface Survey {
  id: number;
  title: string;
  description: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
  questions: {
    id: number;
    text: string;
  }[];
}

interface Rating {
  rating: number;
  comment: string;
}

export default function SurveyPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserRating = async () => {
    try {
      const response = await fetch(`/api/surveys/${params.id}/rating`);
      if (response.ok) {
        const data = await response.json();
        setUserRating(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la note:", error);
    }
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSurvey(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        setError(
          "Erreur lors de la récupération du sondage. Veuillez réessayer plus tard."
        );
        console.error("Erreur lors de la récupération du sondage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
    fetchUserRating();
  }, [params.id]);

  const handleRateSurvey = async () => {
    if (!rating) {
      alert("Veuillez sélectionner une note.");
      return;
    }

    try {
      const response = await fetch(`/api/surveys/${params.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      if (response.ok) {
        alert("Sondage noté avec succès!");
        setRating(null);
        setComment("");
        fetchUserRating();
      } else {
        alert("Erreur lors de la notation du sondage.");
      }
    } catch (error) {
      console.error("Erreur lors de la notation du sondage:", error);
    }
  };

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  if (!survey) {
    return <Text>Le sondage n'a pas été trouvé.</Text>;
  }

  const isOwner = survey.user?.id === Number(session?.user?.id);

  return (
    <Container size="sm" my={40}>
      <Title>{survey.title}</Title>
      <Text mt="md">{survey.description}</Text>
      <Text mt="md" color="dimmed">
        Créé par :{" "}
        {survey.user?.name || survey.user?.email || "Utilisateur inconnu"}
      </Text>

      {survey.questions && survey.questions.length > 0 && (
        <div>
          <Title order={3} mt="xl">
            Questions
          </Title>
          {survey.questions.map((question) => (
            <Text key={question.id} mt="md">
              {question.text}
            </Text>
          ))}
        </div>
      )}

      {isOwner ? (
        <Button
          onClick={() => router.push(`/surveys/${params.id}/edit`)}
          mt="md"
        >
          Modifier le sondage
        </Button>
      ) : (
        <div>
          {userRating ? (
            <Alert title="Votre note" color="green" mt="xl">
              <Text>Note: {userRating.rating} / 5</Text>
              <Text mt="md">Commentaire: {userRating.comment}</Text>
            </Alert>
          ) : (
            <div>
              <Title order={3} mt="xl">
                Noter le sondage
              </Title>
              <Select
                label="Note"
                placeholder="Choisissez une note"
                data={[
                  { value: "1", label: "1 - Très mauvais" },
                  { value: "2", label: "2 - Mauvais" },
                  { value: "3", label: "3 - Moyen" },
                  { value: "4", label: "4 - Bon" },
                  { value: "5", label: "5 - Excellent" },
                ]}
                value={rating}
                onChange={(value) => setRating(value)}
                mt="md"
              />
              <Textarea
                label="Commentaire"
                placeholder="Laissez un commentaire (facultatif)"
                value={comment}
                onChange={(e) => setComment(e.currentTarget.value)}
                mt="md"
              />
              <Button onClick={handleRateSurvey} mt="md">
                Soumettre la note
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
