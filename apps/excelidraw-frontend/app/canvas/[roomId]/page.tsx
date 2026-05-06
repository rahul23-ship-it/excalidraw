
import RoomCanvas from "@/app/components/RoomCanvas";

//roomId being extracted from params and renders roomcanvas 

export default async function CanvasPage({params} : {
    params : {
        roomId : string
    }
}) {
    const roomId = (await params).roomId ;
   
    return <RoomCanvas roomId= {roomId} ></RoomCanvas>
}