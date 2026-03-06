const likeSwagger = {
  "/thread/{id}/like": {
    post: {
      tags: ["Like"],
      summary: "Like a thread",
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
  },
  "/reply/{id}/like": {
    post: {
      tags: ["Like"],
      summary: "Like a reply",
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
  },
};

export default likeSwagger;
