import { NextResponse } from "next/server";
import { prisma } from "~/server/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json(
      { message: "Méthode non autorisée" },
      { status: 405, headers: { Allow: "GET" } }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const surveys = await prisma.survey.findMany({
      include: {
        user: true,
        questions: true,
      },
    });

    return NextResponse.json(surveys, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de tous les sondages:",
      error
    );
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sondages" },
      { status: 500 }
    );
  }
}
