import { Server } from "socket.io";

let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);


    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export function notifyEventUpdate(eventId: number, message: string) {
  io.to(`event-${eventId}`).emit("notification", { eventId, message });
}
