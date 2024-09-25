import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

interface Params {
  params: { id: string };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const surveyId = Number(params.id);
    const { rating } = await request.json();

    console.log("Received rating:", rating); // Log pour déboguer
    console.log("Survey ID:", surveyId); // Log pour déboguer
    console.log("User ID:", session.user.id); // Log pour déboguer

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Données de notation invalides" },
        { status: 400 }
      );
    }

    // Créer la note pour ce sondage
    const createdRating = await prisma.rating.create({
      data: {
        surveyId: surveyId,
        userId: Number(session.user.id),
        rating: rating, // Assurez-vous que le champ `rating` existe dans le modèle Prisma
      },
    });

    console.log("Created rating:", createdRating); // Log pour déboguer

    return NextResponse.json({ message: "Sondage noté avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la notation du sondage:", error);
    return NextResponse.json(
      { message: "Erreur lors de la notation du sondage" },
      { status: 500 }
    );
  }
}
