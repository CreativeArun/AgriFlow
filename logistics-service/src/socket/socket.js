import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log(
            `Client connected: ${socket.id}`
        );

        socket.on("join:shipment", (shipmentId) => {

            socket.join(`shipment:${shipmentId}`);

            console.log(
                `${socket.id} joined shipment:${shipmentId}`
            );
        });

        socket.on("shipment:join", (shipmentId) => {

            socket.join(`shipment:${shipmentId}`);

            console.log(
                `${socket.id} joined shipment:${shipmentId}`
            );
        });

        socket.on("disconnect", () => {

            console.log(
                `Client disconnected: ${socket.id}`
            );
        });
    });

    return io;
};

export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
};