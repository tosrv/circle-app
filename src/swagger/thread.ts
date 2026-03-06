const threadsSwagger = {
  "/threads": {
    get: {
      tags: ["Thread"],
      summary: "Get all threads",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/thread": {
    post: {
      tags: ["Thread"],
      summary: "Create a thread",
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
                    image: {
                      type: "array",
                      items: {
                        type: "file",
                        format: "binary",
                      },
                    },
                  },
                },
                { $ref: "#/components/schemas/ThreadRequest" },
              ],
            },
          },
        },
      },
      responses: {
        201: { description: "Created" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/thread/{id}": {
    get: {
      tags: ["Thread"],
      summary: "Get a thread",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["Thread"],
      summary: "Delete a thread",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
    patch: {
      tags: ["Thread"],
      summary: "Update a thread",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              allOf: [
                {
                  type: "object",
                  properties: {
                    image: {
                      type: "array",
                      items: {
                        type: "file",
                        format: "binary",
                      },
                    },
                  },
                },
                { $ref: "#/components/schemas/ThreadRequest" },
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

export default threadsSwagger;
