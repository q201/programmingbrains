import { NextResponse } from "next/server";

export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Programming Brains API",
      version: "1.0.0",
      description: "OpenAPI documentation for authentication, blog, and admin endpoints.",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000",
      },
    ],
    tags: [
      { name: "Health", description: "Service health checks" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Blogs", description: "Public blog APIs" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in HTTP-only cookie",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "user@example.com" },
            password: { type: "string", example: "StrongPassword123" },
          },
        },
        AuthError: {
          type: "object",
          properties: {
            error: { type: "string", example: "Invalid credentials" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string", format: "email" },
            name: { type: "string", nullable: true },
            role: { type: "string", example: "USER" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Blog: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            slug: { type: "string" },
            excerpt: { type: "string", nullable: true },
            content: { type: "string" },
            published: { type: "boolean" },
            readTime: { type: "string", nullable: true },
            coverImage: { type: "string", nullable: true },
            viewCount: { type: "integer" },
            categories: {
              type: "array",
              items: { $ref: "#/components/schemas/Category" },
            },
          },
        },
      },
    },
    paths: {
      "/api": {
        get: {
          tags: ["Health"],
          summary: "Base API route",
          responses: {
            "200": {
              description: "API is reachable",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Login successful" },
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthError" },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthError" },
                },
              },
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get currently authenticated user",
          security: [{ cookieAuth: [] }],
          responses: {
            "200": {
              description: "Current user info",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Not authenticated",
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout current user",
          responses: {
            "200": {
              description: "Logout successful",
            },
          },
        },
      },
      "/api/blogs": {
        get: {
          tags: ["Blogs"],
          summary: "List published blogs",
          parameters: [
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "tag", in: "query", schema: { type: "string" } },
            { name: "featured", in: "query", schema: { type: "boolean" } },
            { name: "authorId", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          ],
          responses: {
            "200": {
              description: "Paginated blog list",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      blogs: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Blog" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          page: { type: "integer" },
                          limit: { type: "integer" },
                          pages: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/blogs/{slug}": {
        get: {
          tags: ["Blogs"],
          summary: "Get a single published blog by slug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Blog details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Blog" },
                },
              },
            },
            "404": {
              description: "Blog not found",
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
