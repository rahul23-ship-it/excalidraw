"use client"
import { InitDraw } from "@/draw";
import { Socket } from "dgram";
import { useEffect, useRef } from "react";


//rendering the canvas after the connection 

export function Canvas({roomId , socket}: {roomId : string , socket: WebSocket}) {
const canvasRef = useRef<HTMLCanvasElement>(null) ;
useEffect(()=> {

    if (canvasRef.current) {
        InitDraw(canvasRef.current , roomId , socket ) ;
    }
}  , [canvasRef]) ;

return <div>
    <canvas width={"2000"} height={"1000"} ref={canvasRef}></canvas>
</div>

}