import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SurveyPage from "../page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn() as jest.Mock;

describe("SurveyPage", () => {
  const mockSurvey = {
    id: 1,
    title: "Test Survey",
    description: "A test survey description",
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    },
    questions: [
      { id: 1, text: "Question 1" },
      { id: 2, text: "Question 2" },
    ],
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { id: 2 } } });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSurvey),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders survey details correctly", async () => {
    render(<SurveyPage params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Test Survey")).toBeInTheDocument();
      expect(screen.getByText("A test survey description")).toBeInTheDocument();
      expect(screen.getByText("Créé par : Test User")).toBeInTheDocument();
      expect(screen.getByText("Question 1")).toBeInTheDocument();
      expect(screen.getByText("Question 2")).toBeInTheDocument();
    });
  });

  it("displays rating form for non-owners without existing rating", async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("/rating")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(null) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSurvey),
      });
    });

    render(<SurveyPage params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Noter le sondage")).toBeInTheDocument();
      expect(screen.getByText("Note")).toBeInTheDocument();
      expect(screen.getByText("Commentaire")).toBeInTheDocument();
    });
  });

  it("displays existing rating for non-owners", async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("/rating")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ rating: 4, comment: "Great survey!" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSurvey),
      });
    });

    render(<SurveyPage params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Votre note")).toBeInTheDocument();
      expect(screen.getByText("Note: 4 / 5")).toBeInTheDocument();
      expect(
        screen.getByText("Commentaire: Great survey!")
      ).toBeInTheDocument();
    });
  });

  it("shows edit button for survey owners", async () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: { id: 1 } } });

    render(<SurveyPage params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByText("Modifier le sondage")).toBeInTheDocument();
    });
  });

  it("handles errors when fetching survey", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(<SurveyPage params={{ id: "1" }} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erreur lors de la récupération du sondage. Veuillez réessayer plus tard."
        )
      ).toBeInTheDocument();
    });
  });
});
