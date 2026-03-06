import { useEffect, useRef } from "react";

export const useWebSocket = (
  handlers: Record<string, (payload: any) => void>,
  userId?: number,
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);

  // Update handlers
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // WebSocket connection
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3000");

    wsRef.current.onopen = () => {
      console.log("WS connected");
      const authPayload = { userId };
      wsRef.current?.send(
        JSON.stringify({ type: "auth", payload: authPayload }),
      );
    };

    wsRef.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      // console.log(msg);

      if (handlersRef.current[msg.type]) {
        handlersRef.current[msg.type](msg.payload);
      } 
      // else {
      //   console.log("Unknown WS message:", msg);
      // }
    };

    wsRef.current.onclose = () => console.log("WS closed");
    // wsRef.current.onerror = (err) => console.error("WS error:", err);

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Function untuk mengirim message
  const send = (type: string, payload: any) => {
    const ws = wsRef.current;
    if (!ws) return;

    const trySend = () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, payload }));
      } else {
        setTimeout(trySend, 50);
      }
    };

    trySend();
  };

  return { send };
};
