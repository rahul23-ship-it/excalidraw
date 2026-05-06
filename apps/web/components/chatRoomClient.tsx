"use client"
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../app/hooks/useSocket"

 


export function ChatroomClient({messages , id}: {messages : {message : string}[] , id: string}) {
    const {socket , loading} = useSocket() ;
    const [chats , setchats] = useState(messages) ; 
    const newMessgaeRef = useRef<HTMLInputElement>(null) ;

    function sendmessage() {
        if (!newMessgaeRef.current){
            return
        }
        const newMessage = newMessgaeRef.current.value 
        socket?.send(JSON.stringify({
            type : "chat" ,
            roomId : id  ,
            message : newMessage
        }))
        newMessgaeRef.current.value = ""
    }
    useEffect(()=> {
        if (socket && !loading) {

            socket.send(JSON.stringify({
                type: "join_room" ,
                roomId : id
            }))

            socket.onmessage = (event) => {
                const parsedData  = JSON.parse(event.data); 
                if (parsedData.type === "chat") {
                    setchats(c => [...c , {message: parsedData.message}])
                }
            }
        }
    } , [socket , loading , id])

    return <div> 
        {chats.map(m => <div>{m.message}</div> )}

        <input type="text" ref={newMessgaeRef}> </input>
        <button onClick={sendmessage}>Send Message</button>
    </div>
}