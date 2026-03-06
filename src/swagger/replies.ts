const repliesSwagger = {
  "/reply/{id}": {
    post: {
      tags: ["Replies"],
      summary: "Create a reply",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
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
  "/replies/{id}": {
    get: {
      tags: ["Replies"],
      summary: "Get replies",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
  },
};

export default repliesSwagger;
