// src/app/api/surveys/[id]/rating/route.ts

import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    // Récupérer la session de l'utilisateur
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const surveyId = Number(params.id);

    // Vérifier si le sondage existe
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return NextResponse.json(
        { message: "Sondage non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer la note de l'utilisateur pour ce sondage
    const rating = await prisma.rating.findUnique({
      where: {
        userId_surveyId: {
          userId: userId,
          surveyId: surveyId,
        },
      },
    });

    if (!rating) {
      return NextResponse.json(
        { message: "Aucune note trouvée pour ce sondage" },
        { status: 404 }
      );
    }

    // Retourner la note et le commentaire
    return NextResponse.json({
      rating: rating.rating,
      comment: rating.comment,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la note:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la note" },
      { status: 500 }
    );
  }
}
