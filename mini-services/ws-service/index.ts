// @ts-ignore
import { serve } from "bun";

const PORT = 3030;
const clients = new Map<string, any>();
const sessions = new Map<string, Set<string>>();

console.log(`[WS] Starting WebSocket service on port ${PORT}`);

serve({
  port: PORT,
  fetch(req, server) {
    const url = new URL(req.url);
    
    if (url.pathname === "/health") {
      return new Response("OK");
    }
    
    if (url.pathname === "/") {
      // @ts-ignore
      const success = server.upgrade(req, {
        data: { id: (crypto as any).randomUUID() }
      });
      if (success) return undefined as any;
    }
    
    return new Response("WS Server");
  },
  
  websocket: {
    open(ws: any) {
      clients.set(ws.data.id, ws);
      ws.send(JSON.stringify({ type: "connected", id: ws.data.id }));
      console.log(`[WS] Client: ${ws.data.id}`);
    },
    close(ws: any) {
      clients.delete(ws.data.id);
    },
    message(ws: any, msg: string) {
      try {
        const data = JSON.parse(msg.toString());
        if (data.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
        } else if (data.type === "broadcast" && data.sessionId) {
          const msgStr = JSON.stringify(data.payload);
          clients.forEach(c => c.send(msgStr));
        }
      } catch (e) {}
    }
  }
});
