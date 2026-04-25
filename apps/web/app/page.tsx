"use client"
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const Inputref = useRef<HTMLInputElement>(null) ;
  const router = useRouter() ;
  

  function sendMessage() {
    if (!Inputref.current){
    return 
  }
    const roomId = Inputref.current.value ;
    router.push(`/room/${roomId}`);  
  }
  
  return (
    <div style={{display : "flex"  , justifyContent : "center" ,alignItems: "center" ,
      height :"100vh" , width : "100vw" , backgroundColor : "black"
    }}>
      <div>
      <input style={{padding : 10}} ref={Inputref} type="text" placeholder="Room id"></input>
      <button style={{padding : 10}} onClick={sendMessage}>Join room</button>
      </div>
    </div>
  )
}