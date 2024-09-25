// app/api/auth/register/route.ts
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "~/server/db"; // Assurez-vous que 'prisma' est l'instance Prisma

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Stocker le mot de passe haché
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
