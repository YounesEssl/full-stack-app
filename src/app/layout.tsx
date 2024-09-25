"use client";

import { MantineProvider } from "@mantine/core";
import Provider from "./Provider";
import AppHeader from "./_components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body>
        <Provider>
          <MantineProvider>
            <AppHeader />
            {children}
          </MantineProvider>
        </Provider>
      </body>
    </html>
  );
}
