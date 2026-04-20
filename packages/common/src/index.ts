
import {z} from "zod";


export const CreateUserSchema = z.object ({
    email : z.email("Valid email is required"),
    password : z.string().min(5, "Password is required"),
    name : z.string().min(5, "Name is required"),
    photo : z.string().url("Photo must be a valid URL").optional()
    })

export const LoginUserSchema = z.object ({
    email : z.email("Valid email is required"),
    password : z.string().min(5, "Password is required")
    })  

export const CreateRoomSchema = z.object ({
    slug : z.string().min(3, "Room slug is required")
})
