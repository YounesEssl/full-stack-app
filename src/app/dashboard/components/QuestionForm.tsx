// app/dashboard/components/QuestionForm.tsx
import { useState } from "react";
import { TextInput, Button, Group, List, Text } from "@mantine/core";

interface QuestionFormProps {
  onAddQuestion: (question: string) => void;
}

export default function QuestionForm({ onAddQuestion }: QuestionFormProps) {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const handleAddQuestion = () => {
    if (question.trim()) {
      onAddQuestion(question);
      setQuestions([...questions, question]);
      setQuestion("");
    }
  };

  return (
    <>
      <TextInput
        label="Nouvelle question"
        placeholder="Entrez votre question"
        value={question}
        onChange={(e) => setQuestion(e.currentTarget.value)}
        required
      />
      <Button onClick={handleAddQuestion} mt="md">
        Ajouter une question
      </Button>

      {/* Liste des questions ajoutées */}
      <Text mt="md" weight={500}>Questions :</Text>
      <List spacing="sm" mt="xs">
        {questions.map((q, index) => (
          <List.Item key={index}>{q}</List.Item>
        ))}
      </List>
    </>
  );
}
