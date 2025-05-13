import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Setup the Swagger documentation
 * @param app - Express application
 */
export function setupDocs(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Random Acts of Kindness",
      version: "1.0.0",
      description:
        "API documentation for a community-driven platform that encourages people to share and complete random kindness ideas.",
    },
    servers: [
      {
        url: "http://localhost:4000/api/",
        description: "Development server",
      },
      {
        url: "https://random-acts-of-kindness-api.onrender.com/api/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth-token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        KindnessAct: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
            },
            createdBy: { $ref: "#/components/schemas/User" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SavedAct: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            act: { $ref: "#/components/schemas/KindnessAct" },
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
            },
            savedAt: { type: "string", format: "date-time" },
          },
        },
        CompletedAct: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            act: { $ref: "#/components/schemas/KindnessAct" },
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
            },
            completedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["**/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
