const userSwagger = {
  "/user/search": {
    get: {
      tags: ["User"],
      summary: "Search users",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "q",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "OK" },
        400: { description: "Bad request" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/user/check": {
    get: {
      tags: ["User"],
      summary: "Check username for update",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "username",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "OK" },
        400: { description: "Bad request" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/user": {
    patch: {
      tags: ["User"],
      summary: "Update user",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    avatar: {
                      type: "string",
                      format: "binary",
                    },
                  },
                },
                { $ref: "#/components/schemas/UpdateRequest" },
              ],
            },
          },
        },
      },
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
  },
};

export default userSwagger;