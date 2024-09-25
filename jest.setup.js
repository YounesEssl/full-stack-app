import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";

beforeAll(async () => {
  const nextRouter = await import("next/router");
  const nextNavigation = await import("next/navigation");

  if (!nextRouter.default) {
    Object.defineProperty(nextRouter, "default", { value: mockRouter });
  }

  if (!nextNavigation.default) {
    Object.defineProperty(nextNavigation, "default", { value: mockRouter });
  }
});
