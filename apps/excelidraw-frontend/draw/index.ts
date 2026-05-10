
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

            let existingShapes :Shape[] = await getExisitingShapes(roomId) ; //local storage for shape data 

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
                existingShapes.push(shape)  //push the shape to the existing shape when u draw out of the mouse  

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
                if (clicked){  //only if clicked  
                  const width = e.clientX - startX  //current value - start value 
                  const height = e.clientY - startY

                  clearCanvas(existingShapes ,canvas , ctx) ; //clear the canvas and rerenders the exisiting shapes 

                  ctx.strokeStyle = "rgba(255,255,255)"   //apply white stroke style while drawing
                  ctx.strokeRect(startX ,startY ,width ,height);
                }
              
            })
}


function clearCanvas (existingShapes : Shape[] , canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0,0,canvas.width , canvas.height); // clears the whole canvas 
    ctx.fillStyle = "rgba(0,0,0)"   //fill the whole canvas with black 
    ctx.fillRect(0,0,canvas.width , canvas.height);

    existingShapes.map(shape=> {  //rerenders the existing shapes
        if (shape.type === "rectangle") {
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x ,shape.y , shape.width , shape.height);
        }
    })
}


async function getExisitingShapes(roomId:string){  //get existing shape data from the saved backend database using roomId 
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`) ;
        const messages = res.data.messages ;

        const shapes = messages.map( (x: {message : string})=>{
            return JSON.parse(x.message)
        })

        return shapes  // the shape data which is been returned 
    } catch (error) {
        console.error("Error fetching existing shapes:", error);
        return [];
    }
}