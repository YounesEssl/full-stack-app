import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "~/server/db";
import { POST } from "../route";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import "whatwg-fetch";
// Mocks
jest.mock("next-auth", () => {
  return {
    __esModule: true,
    default: jest.fn(), // Moquer NextAuth en tant que fonction par défaut
    getServerSession: jest.fn(), // Moquer également getServerSession
  };
});

jest.mock("~/server/db", () => ({
  prisma: {
    rating: {
      create: jest.fn(),
    },
  },
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, options) => ({ body, options })),
  },
}));

describe("POST /api/surveys/[id]/rate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/surveys/1/rate", {
      method: "POST",
      body: JSON.stringify({ rating: 4 }),
    });

    const response = await POST(request, { params: { id: "1" } });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Non autorisé" },
      { status: 401 }
    );
  });

  it("should return 400 if rating is invalid", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "1" },
    });

    const request = new Request("http://localhost:3000/api/surveys/1/rate", {
      method: "POST",
      body: JSON.stringify({ rating: 6 }),
    });

    const response = await POST(request, { params: { id: "1" } });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Données de notation invalides" },
      { status: 400 }
    );
  });

  it("should create rating and return 200 if everything is valid", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "1" },
    });

    const request = new Request("http://localhost:3000/api/surveys/1/rate", {
      method: "POST",
      body: JSON.stringify({ rating: 4 }),
    });

    (prisma.rating.create as jest.Mock).mockResolvedValue({
      id: 1,
      surveyId: 1,
      userId: 1,
      rating: 4,
    });

    const response = await POST(request, { params: { id: "1" } });

    expect(prisma.rating.create).toHaveBeenCalledWith({
      data: {
        surveyId: 1,
        userId: 1,
        rating: 4,
      },
    });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Sondage noté avec succès" },
      { status: 200 }
    );
  });

  it("should return 500 if there's an error during rating creation", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "1" },
    });

    const request = new Request("http://localhost:3000/api/surveys/1/rate", {
      method: "POST",
      body: JSON.stringify({ rating: 4 }),
    });

    (prisma.rating.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const response = await POST(request, { params: { id: "1" } });

    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Erreur lors de la notation du sondage" },
      { status: 500 }
    );
  });
});
