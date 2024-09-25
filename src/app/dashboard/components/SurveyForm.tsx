// app/dashboard/components/SurveyForm.tsx
import { useState } from "react";
import { TextInput, Textarea, Button } from "@mantine/core";
import QuestionForm from "./QuestionForm";

interface SurveyFormProps {
  onCreate: (title: string, description: string, questions: string[]) => void;
}

export default function SurveyForm({ onCreate }: SurveyFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);

  const handleAddQuestion = (question: string) => {
    setQuestions([...questions, question]);
  };

  const handleSubmit = () => {
    onCreate(title, description, questions);
    setTitle("");
    setDescription("");
    setQuestions([]);
  };

  return (
    <>
      <TextInput
        label="Titre du sondage"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
      />
      <Textarea
        label="Description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        required
        mt="md"
      />

      {/* Ajout des questions */}
      <QuestionForm onAddQuestion={handleAddQuestion} />

      <Button onClick={handleSubmit} mt="md">
        Créer un sondage
      </Button>
    </>
  );
}
