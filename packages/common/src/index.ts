
import {z} from "zod";


export const CreateUserSchema = z.object ({
    username : z.string().min(5, "Username is required"),
    password : z.string().min(5, "Password is required"),
    name : z.string().min(5, "Name is required")
    })

export const LoginUserSchema = z.object ({
    username : z.string().min(5, "Username is required"),
    password : z.string().min(5, "Password is required")
    })  

export const CreateRoomSchema = z.object ({
    roomName : z.string().min(5, "Room name is required")
})
