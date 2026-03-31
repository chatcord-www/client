import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { initializeSocket } from "./socket";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chatc0rd.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
  })
);

initializeSocket(server);

app.get("/", (_req, res) => {
  res.send("Socket server is running!");
});

const PORT = Number(process.env.SOCKET_PORT) || 3001;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
