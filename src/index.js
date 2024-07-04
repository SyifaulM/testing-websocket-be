import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({path:'../.env'});

const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        // origin: ["http://localhost:3000", "https://testing-websocket-fe.vercel.app", "https://testing-websocket-be.vercel.app" ],
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

try {
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

app.get('/', (req, res) => {
    res.send('Aplikasi Node.js dengan CORS diizinkan dari semua origin');
});

httpServer.listen(port, () => {
    console.log(`Express server listening on port: ${port}...`);
});

export { io };