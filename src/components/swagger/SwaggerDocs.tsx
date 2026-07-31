"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    SwaggerUIBundle?: (config: Record<string, unknown>) => void;
  }
}

function loadSwaggerCss() {
  const existing = document.querySelector('link[data-swagger-ui="true"]');
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css";
  link.setAttribute("data-swagger-ui", "true");
  document.head.appendChild(link);
}

function loadSwaggerScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.SwaggerUIBundle) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Swagger UI script"));
    document.body.appendChild(script);
  });
}

export default function SwaggerDocs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    loadSwaggerCss();
    loadSwaggerScript()
      .then(() => {
        if (!mounted || !containerRef.current || !window.SwaggerUIBundle) return;
        window.SwaggerUIBundle({
          url: "/api/openapi",
          domNode: containerRef.current,
          deepLinking: true,
          docExpansion: "none",
          defaultModelsExpandDepth: 1,
        });
      })
      .catch((error) => {
        console.error("Failed to render API docs:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={containerRef} className="min-h-[70vh] swagger-ui" />;
}
