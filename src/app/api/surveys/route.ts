import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth/next"; // Import corrigé
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

// Fonction pour récupérer les sondages de l'utilisateur connecté
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const surveys = await prisma.survey.findMany({
      where: {
        userId: Number(session.user.id),
      },
      include: {
        user: true,
        questions: true,
      },
    });

    return NextResponse.json(surveys, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des sondages:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sondages" },
      { status: 500 }
    );
  }
}

// Fonction pour créer un nouveau sondage
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { title, description, questions } = await request.json();

    // Validation des données reçues
    if (!title || !description || !Array.isArray(questions)) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 }
      );
    }

    const newSurvey = await prisma.survey.create({
      data: {
        title,
        description,
        userId: Number(session.user.id),
        questions: {
          create: questions.map((question: string) => ({
            text: question,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(newSurvey, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du sondage:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du sondage" },
      { status: 500 }
    );
  }
}
