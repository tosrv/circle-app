import swaggerJSDoc, { Options } from "swagger-jsdoc";
import j2s from "joi-to-swagger";
import { registerSchema, loginSchema } from "../validations/auth";
import { updateSchema } from "../validations/user";
import { threadSchema } from "../validations/thread";

import authSwagger from "./auth";
import userSwagger from "./user";
import threadsSwagger from "./thread";
import repliesSwagger from "./replies";
import followsSwagger from "./follow";
import likeSwagger from "./like";

const { swagger: registerSwagger } = j2s(registerSchema);
const { swagger: loginSwagger } = j2s(loginSchema);
const { swagger: updateSwagger } = j2s(updateSchema);
const { swagger: threadSwagger } = j2s(threadSchema);

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Circle API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: registerSwagger,
        LoginRequest: loginSwagger,
        UpdateRequest: updateSwagger,
        ThreadRequest: threadSwagger,
      },
    },
    paths: {
      ...authSwagger,
      ...userSwagger,
      ...threadsSwagger,
      ...repliesSwagger,
      ...followsSwagger,
      ...likeSwagger,
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
