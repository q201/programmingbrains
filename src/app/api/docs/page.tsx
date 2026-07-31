import type { Metadata } from "next";
import SwaggerDocs from "@/components/swagger/SwaggerDocs";

export const metadata: Metadata = {
  title: "API Docs | Programming Brains",
  description: "Swagger UI documentation for Programming Brains APIs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <SwaggerDocs />
    </main>
  );
}
