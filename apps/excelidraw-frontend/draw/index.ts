
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape = {
    type: "rectangle" ,
    x : number ,
    y : number ,
    width : number ,
    height : number 
} | {
    type : "circle" ,
    centerX : number ,
    centerY : number ,
    radius : number 
}



export async function InitDraw(canvas:HTMLCanvasElement , roomId : string , socket : WebSocket) {

            const ctx = canvas.getContext("2d");

            let existingShapes :Shape[] = await getExisitingShapes(roomId) ;

            if (!ctx) {
                return 
            }

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (message.type == 'chat') {
                    const parsedShape = JSON.parse(message.message)
                    existingShapes.push(parsedShape);
                    clearCanvas(existingShapes , canvas , ctx);
                }
            }


            clearCanvas(existingShapes , canvas , ctx);

            let clicked = false ;
            let startX = 0 ;
            let startY = 0 ;

            canvas.addEventListener("mousedown" , (e)=> { //when mouse clicked registering the x,y strat point 
                clicked = true 
                startX = (e.clientX)
                startY = (e.clientY)
            })

            canvas.addEventListener("mouseup" , async (e)=> {
                clicked = false
                const width = e.clientX - startX  //current value - start value 
                const height = e.clientY - startY 
                const shape : Shape = {
                    type : "rectangle" ,
                    x : startX ,
                    y : startY ,
                    height ,
                    width
                }
                existingShapes.push(shape)

                // Save shape to backend
                try {
                    await axios.post(`${HTTP_BACKEND}/chats/${roomId}`, {
                        message: JSON.stringify(shape),
                        userId: "user-" + Math.random().toString(36).substr(2, 9)
                    });
                } catch (error) {
                    console.error("Error saving shape:", error);
                }

                // Also send via WebSocket for real-time updates
                socket.send(JSON.stringify({
                    type : "chat" ,
                    message : JSON.stringify(shape),
                    roomId 
                }))
                
            })

            canvas.addEventListener("mousemove" , (e)=> {
                if (clicked){  //only if clicked draw 
                  const width = e.clientX - startX  //current value - start value 
                  const height = e.clientY - startY
                  clearCanvas(existingShapes ,canvas , ctx) ;
                  ctx.strokeStyle = "rgba(255,255,255)"
                  ctx.strokeRect(startX ,startY ,width ,height);
                }
              
            })
}


function clearCanvas (existingShapes : Shape[] , canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0,0,canvas.width , canvas.height);
    ctx.fillStyle = "rgba(0,0,0)" 
    ctx.fillRect(0,0,canvas.width , canvas.height);

    existingShapes.map(shape=> {
        if (shape.type === "rectangle") {
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x ,shape.y , shape.width , shape.height);
        }
    })
}


async function getExisitingShapes(roomId:string){
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`) ;
        const messages = res.data.messages ;

        const shapes = messages.map( (x: {message : string})=>{
            return JSON.parse(x.message)
        })

        return shapes
    } catch (error) {
        console.error("Error fetching existing shapes:", error);
        return [];
    }
}