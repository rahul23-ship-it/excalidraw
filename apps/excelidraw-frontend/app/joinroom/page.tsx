"use client"
import { Button } from "@repo/ui/button";
import { AuthInput } from "../components/AuthInput";
import { AuthLayout } from "../components/AuthLayout";
import { useRef } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";


export default function JoinRoomPage() {
     const inputRef  =  useRef<HTMLInputElement>(null) ;
     const router = useRouter() ; 
    async function joinRoom() {
       try {
         const slug = inputRef.current?.value;
         if (!slug) return;
         const token = localStorage.getItem("token");
         if (!token) {
           router.push("/signin");
           return;
         }
         const response = await axios.post(
           `${HTTP_BACKEND}/create-room`,
           { slug },
           { headers: { Authorization: token } }
         );
         const roomId = response.data.roomId ;
         router.push(`/canvas/${roomId}`) ; 
       } catch (err) {
         console.error("Failed to join/create room:", err);
       }
    }
  return (
    <AuthLayout title="Join Room" subtitle="Join or Create Room">
        <AuthInput
          label="Room Code / Slug"
          ref={inputRef}
          placeholder="Enter slug to join or create room"
          required
        />
        <Button
        variant="primary"
        onClick={joinRoom}
        size="lg" 
        >Join Room</Button>
    </AuthLayout>
  );
}