const followsSwagger = {
  "/follow": {
    get: {
      tags: ["Follows"],
      summary: "Get users to follow",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/follows": {
    get: {
      tags: ["Follows"],
      summary: "Get followers or followings",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "query",
          name: "type",
          required: true,
          schema: { type: "string", enum: ["followers", "followings"] },
        },
        {
          in: "query",
          name: "username",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "OK" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/follow/{id}": {
    post: {
      tags: ["Follows"],
      summary: "Follow a user",
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

export default followsSwagger;
