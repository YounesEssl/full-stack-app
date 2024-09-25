import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth/next"; // Import corrigé
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

interface Params {
  params: {
    id: string;
  };
}

// Récupération d'un sondage spécifique
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: Number(params.id) },
      include: {
        user: true,
        questions: true,
        ratings: {
          where: { userId: Number(session.user.id) }, // Récupère la note de l'utilisateur connecté
        },
      },
    });

    if (!survey) {
      return NextResponse.json(
        { message: "Sondage non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error("Erreur lors de la récupération du sondage:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération du sondage" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request, { params }: Params) {
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

    const survey = await prisma.survey.findUnique({
      where: { id: Number(params.id) },
    });

    if (!survey || survey.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const updatedSurvey = await prisma.survey.update({
      where: { id: Number(params.id) },
      data: {
        title,
        description,
        questions: {
          deleteMany: {}, // Supprimez d'abord toutes les questions existantes
          create: questions.map((question: string) => ({
            text: question,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(updatedSurvey, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du sondage:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du sondage" },
      { status: 500 }
    );
  }
}

// Fonction pour supprimer un sondage
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const survey = await prisma.survey.findUnique({
      where: { id: Number(params.id) },
    });

    if (!survey || survey.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    // Avec la suppression en cascade configurée, vous pouvez supprimer directement le sondage
    await prisma.survey.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Sondage supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du sondage:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression du sondage" },
      { status: 500 }
    );
  }
}
