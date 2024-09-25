// app/dashboard/create-survey/page.tsx
"use client";
import { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function CreateSurvey() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]); // Tableau pour les questions
  const router = useRouter();

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleCreateSurvey = async () => {
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, questions }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setQuestions([""]);
      alert("Sondage créé avec succès");
      router.push("/dashboard");
    } else {
      alert("Erreur lors de la création du sondage");
    }
  };

  return (
    <Container size="sm" my={40}>
      <Title>Créer un nouveau sondage</Title>
      <TextInput
        label="Titre du sondage"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        mt="md"
      />
      <Textarea
        label="Description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        required
        mt="md"
      />

      <Title order={3} mt="lg">
        Questions
      </Title>
      {questions.map((question, index) => (
        <TextInput
          key={index}
          placeholder={`Question ${index + 1}`}
          value={question}
          onChange={(e) => handleQuestionChange(index, e.currentTarget.value)}
          mt="md"
          required
        />
      ))}
      <Button onClick={handleAddQuestion} variant="outline" mt="md">
        Ajouter une question
      </Button>

      <Button onClick={handleCreateSurvey} mt="md">
        Créer un sondage
      </Button>
    </Container>
  );
}
