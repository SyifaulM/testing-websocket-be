import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://testing-websocket-fe.vercel.app", "https://testing-websocket-be.vercel.app" ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

try {
    app.use(cors({
        origin: ["http://localhost:3000", "https://testing-websocket-fe.vercel.app", "https://testing-websocket-be.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }));
    app.use(express.json());

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`Perangkat ${socket.id} masuk ke room ${room}`);
        });

        socket.on('notify', (data) => {
            const { target, content } = data;
            if (target === 'semua-perangkat') {
                console.log(target);
                io.emit('notification', { content });
            } else {
                console.log(target);
                io.to(target).emit('notification', { content });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
} catch (error) {
    console.error(error);
}

httpServer.listen(5000, () => {
    console.log(`Express server listening on port: ${port}...`);
});

export { io };