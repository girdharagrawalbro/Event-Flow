import express, { Request } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Extend the Request interface to include the 'io' property
declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
}

const app = express();
const server = http.createServer(app);

// Configure CORS for Express
const corsOptions = {
  origin: [
    "https://eventflow-code.netlify.app",
    "https://event-flow-eight.vercel.app"
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Configure Socket.IO with the same CORS origins
const io = new Server(server, {
  cors: {
    origin: [
      "https://eventflow-code.netlify.app",
      "https://event-flow-eight.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Middleware
app.use(express.json());

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("register", (data) => {
    console.log("Attendee registered:", data);
    io.emit("notification", `${data.email} has registered for an event.`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Import routes
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import registrationRoutes from "./routes/registrationRoutes";

// Add socket.io instance to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

// Start server
server.listen(5000, () => {
  console.log("Server is running on desired port ");
});