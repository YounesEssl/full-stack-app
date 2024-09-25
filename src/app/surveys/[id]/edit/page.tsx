"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Button, Textarea, Title, Text } from "@mantine/core";

export default function EditSurvey({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [survey, setSurvey] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/surveys/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSurvey(data);
          setQuestions(data.questions.map((q: any) => q.text));
        } else {
          throw new Error(`Failed to fetch survey: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching survey:", error);
        setError("Erreur lors du chargement du sondage");
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [params.id]);

  const handleUpdateSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: survey.title,
          description: survey.description,
          questions,
        }),
      });

      if (response.ok) {
        alert("Sondage mis à jour avec succès");
        router.push(`/surveys/${params.id}`);
      } else {
        throw new Error("Erreur lors de la mise à jour du sondage.");
      }
    } catch (error) {
      console.error("Error updating survey:", error);
      setError("Erreur lors de la mise à jour du sondage");
    }
  };

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!survey) {
    return <Text>Sondage non trouvé</Text>;
  }

  return (
    <Container>
      <Title>{survey.title}</Title>
      <Text>{survey.description}</Text>

      {questions.map((question, index) => (
        <Textarea
          key={index}
          value={question}
          onChange={(e) => {
            const newQuestions = [...questions];
            newQuestions[index] = e.currentTarget.value;
            setQuestions(newQuestions);
          }}
          placeholder={`Question ${index + 1}`}
          mt="md"
        />
      ))}

      <Button onClick={handleUpdateSurvey} mt="md">
        Mettre à jour le sondage
      </Button>
    </Container>
  );
}
