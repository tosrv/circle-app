import { Server, WebSocket as WS } from "ws";
import http from "http";

interface AuthWebSocket extends WS {
  userId?: number;
}

let wss: Server;

export function initWebSocket(server: http.Server) {
  wss = new Server({ server });

  wss.on("connection", (ws: WS, req) => {
    const authWs = ws as AuthWebSocket;
    console.log("Client connected");

    // Listen auth message from client
    authWs.on("message", (raw) => {
      try {
        const { type, payload } = JSON.parse(raw.toString());
        if (type === "auth" && payload.userId) {
          authWs.userId = payload.userId;
          return;
        }

        if (type === "new_reply") {
          wss.clients.forEach((client) => {
            if (client.readyState === WS.OPEN) {
              client.send(
                JSON.stringify({ type: "new_reply", payload: payload }),
              );
            }
          });
        }
      } catch (err) {
        console.error("Invalid WS message:", raw.toString());
      }
    });

    authWs.on("close", () => {
      console.log("Client disconnected");
    });
  });
}

// Broadcast to all clients
export function broadcastEvent(type: string, payload: any, senderId?: number) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    const authClient = client as AuthWebSocket;
    if (authClient.readyState !== WS.OPEN) return;
    if (senderId && authClient.userId === senderId) return;

    authClient.send(JSON.stringify({ type, payload }));
  });
}

// Broadcast reply
export const broadcastReply = (reply: any) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState !== WS.OPEN) return;
    client.send(JSON.stringify({ type: "new_reply", payload: reply }));
  });
};

// Broadcast follow/unfollow updates
export function broadcastFollow(
  followId: number,
  userId: number,
  payloadTarget: any,
  payloadUser: any,
  isollowing: boolean,
) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    const authClient = client as AuthWebSocket;
    if (authClient.readyState !== WS.OPEN) return;

    // console.log("Broadcast follow/unfollow updates", {
    //   followId,
    //   userId,
    //   payloadTarget,
    //   payloadUser,
    //   isollowing,
    // });

    // target user → followers
    if (authClient.userId === followId) {
      authClient.send(
        JSON.stringify({
          type: "followers_update",
          payload: {
            userId: followId,
            followersCount: payloadTarget.followersCount,
            followerId: userId,
            isFollowing: isollowing,
          },
        }),
      );
    }

    // follow user → following
    if (authClient.userId === userId) {
      authClient.send(
        JSON.stringify({
          type: "following_update",
          payload: {
            userId: userId,
            followingCount: payloadUser.followingCount,
            followId: followId,
            isFollowing: isollowing,
          },
        }),
      );
    }
  });
}
