// app/dashboard/components/SurveyList.tsx
import { Card, Group, Text, Button } from "@mantine/core";

interface Survey {
  id: number;
  title: string;
  description: string;
}

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: number) => void;
}

export default function SurveyList({ surveys, onDelete }: SurveyListProps) {
  return (
    <>
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
              <Button color="red" onClick={() => onDelete(survey.id)}>
                Supprimer
              </Button>
            </Group>
          </Card>
        ))
      ) : (
        <Text mt="md">Aucun sondage trouvé.</Text>
      )}
    </>
  );
}
