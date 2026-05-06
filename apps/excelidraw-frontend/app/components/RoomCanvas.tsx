"use client"

import { WS_URL } from "@/config";
import { InitDraw } from "@/draw";
import { useEffect, useRef, useState } from "react"
import { Canvas } from "./canvas";

//connecting to the ws and rendering the canvas 

export default function RoomCanvas({roomId} : {roomId : string}) {
   
    
    const [socket , setSocket ] = useState<WebSocket | null >(null) ;


    useEffect(()=>{
        const ws  = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMTg4ZjIyYy1hMGFhLTQ4NDgtODY1OS1jOTQ3Nzc5YzNkNzciLCJpYXQiOjE3NzgwNjM0NTl9._VK7DkdLf-GbHg8xRn0KNFPVXGI50XSANMEcERaL6gE`)

        ws.onopen = ()=> {
            setSocket(ws);
            ws.send(JSON.stringify({
                type : "join_room" ,
                roomId
            }))
        }
    } , [])

    if (!socket){
        return <div>
            Connecting to the server....
        </div>
    }

    return <div>
        <Canvas roomId = {roomId} socket= {socket}></Canvas>    
    </div>
}