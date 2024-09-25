import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  const email = `testuser${Date.now()}@example.com`; // Crée un email unique pour chaque test
  const password = "TestPassword123!";

  test("User can register", async ({ page }) => {
    // Étape 1: Accéder à la page d'inscription
    await page.goto("http://localhost:3000/register");

    // Étape 2: Remplir le formulaire d'inscription
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');

    // Étape 3: Vérifier que l'inscription a réussi (par exemple, redirection vers la page d'accueil)
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page.locator("text=Créer un compte")).not.toBeVisible(); // Vérifie que le formulaire d'inscription n'est plus visible
  });

  test("User can login", async ({ page }) => {
    // Étape 1: Accéder à la page de connexion
    await page.goto("http://localhost:3000/login");

    // Étape 2: Remplir le formulaire de connexion
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.click('button[type="submit"]');

    // Étape 3: Vérifier que la connexion a réussi (par exemple, redirection vers le tableau de bord)

    await expect(page).toHaveURL("http://localhost:3000/dashboard");
    await expect(page.locator("text=Créer un nouveau sondage")).toBeVisible(); // Adaptez selon ce qui est affiché sur votre page
  });
});
