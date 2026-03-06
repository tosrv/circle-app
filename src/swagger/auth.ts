const authSwagger = {
  "/register": {
    post: {
      tags: ["Auth"],
      summary: "Register new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" },
          },
        },
      },
      responses: {
        201: { description: "Created" },
        409: { description: "Conflict" },
      },
    },
  },
  "/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: { description: "OK" },
        400: { description: "Bad Request" },
      },
    },
  },
  "/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Logged in" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Logged out" },
        401: { description: "Unauthorized" },
      },
    },
  },
};

export default authSwagger;
