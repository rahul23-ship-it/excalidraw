import { WebSocketServer, type RawData, type WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient, PrismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
        ws: WebSocket;
        rooms: Number[];
        userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
        try {
                const user = jwt.verify(token, JWT_SECRET);

                if (typeof user === "string") {
                        return null;
                }

                if (!user || !user.userId) {
                        return null;
                }

                return user.userId;
        } catch (error) {
                console.error("Error verifying token", error);
                return null;
        }
}

wss.on("connection", (ws, request) => {
        console.log("ws-backend: client connected");

        const url = request.url;
        if (!url) {
                console.log("ws-backend: no url");
                ws.close();
                return;
        }

        const params = new URLSearchParams(url.split("?")[1]);
        const token = params.get("token") || "";
        const userId = checkUser(token);

        if (userId === null) {
                console.log("ws-backend: invalid token");
                ws.close();
                return;
        }

        console.log("ws-backend: userId", userId);

        users.push({
                ws,
                rooms: [],
                userId,
        });

ws.on("message", async(data: RawData) => {
        let parsedData: any;

        try {
                parsedData = JSON.parse(data.toString());
        } catch {
                console.log("ws-backend: invalid json");
                return;
        }

        const user = users.find((x) => x.ws === ws);
        if (!user) {
                return;
        }

        if (parsedData.type === "join_room") {
                const roomId = Number(parsedData.roomId);
                if (!user.rooms.includes(roomId)) {
                        user.rooms.push(roomId);
                }
        }

        if (parsedData.type === "leave_room") {
                const roomId = Number(parsedData.roomId);
                user.rooms = user.rooms.filter((x) => x !== roomId);
        }

        if (parsedData.type === "chat") {
                const roomId = Number(parsedData.roomId);
                const message = parsedData.message;

                try {
                await prismaClient.chat.create({
                        data: {
                                roomId ,
                                message,
                                userId
                        }
                })
        }         catch (error) {
                console.error("Error saving chat message:", error);
        }   

                users.forEach((u) => {
                        if (u.rooms.includes(roomId)) {
                                u.ws.send(
                                        JSON.stringify({
                                                type: "chat",
                                                message,
                                                roomId,
                                        }),
                                );
                        }
                });
        }
});
});
