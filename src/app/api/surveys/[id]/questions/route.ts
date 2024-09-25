import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: Number(id) },
    });

    if (!survey || survey.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Le texte de la question est invalide" },
        { status: 400 }
      );
    }

    const updatedSurvey = await prisma.survey.update({
      where: { id: Number(id) },
      data: {
        questions: {
          create: { text },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        questions: {
          select: {
            id: true,
            text: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la question:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la question" },
      { status: 500 }
    );
  }
}
