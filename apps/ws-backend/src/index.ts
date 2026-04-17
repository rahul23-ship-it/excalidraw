import dotenv from "dotenv";
dotenv.config();
import { request } from "express";
import { WebSocketServer, type RawData, type WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "ilovemessi";

const wss = new WebSocketServer({ port: 8080 });


wss.on("connection", (ws: WebSocket , request: any) => {
    console.log("ws-backend: client connected");
    const url = request.url;
    if (!url) {
        console.log("ws-backend: no url");
        ws.close();
        return;
    }

    const params = new URLSearchParams(url.split('?')[1]); 
    const token = params.get("token");
    if (!token) {
        console.log("ws-backend: no token");
        ws.close();
        return;
    }
    console.log("ws-backend: token", token);

    const user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    if (!user || !user.userId) {
        console.log("ws-backend: invalid user");
        ws.close();
        return;
    }

    ws.on("message", (message: RawData) => {
        ws.send("pong");
    });
});
