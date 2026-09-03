import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { initializeSocket } from "./src/socket/socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Logistics service running on port ${PORT}`);
});