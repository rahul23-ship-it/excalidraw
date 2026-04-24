
import express from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from '@repo/backend-common/config' ;
import { authenticateToken } from "./middleware";
import {CreateUserSchema , LoginUserSchema , CreateRoomSchema} from '@repo/common/types' ;
import {prismaClient} from '@repo/db/client' ;

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const validationResult = CreateUserSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.message });
  }
  const { email, password } = validationResult.data;

  try {
  const existingUser = await prismaClient.user.findFirst({
    where : {
      email : email
    }
  }) ;
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }
  await prismaClient.user.create({
    data : {
      email : email,
      password,
      name : validationResult.data.name,
      photo : validationResult.data.photo ?? ""
    }
  }) ;
  return res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error registering user:");
    return res.status(500).json({ error: "Internal server error" });
  }
}); 



app.post("/login", async (req, res) => {
  const validationResult = LoginUserSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.message });
  }

  const email = validationResult.data.email;
  const password = validationResult.data.password;

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email
      }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return res.json({ token });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/create-room", authenticateToken,async (req:any, res) => {
  const validationResult = CreateRoomSchema.safeParse(req.body);
  const  userId  = req.user.userId;
  try {
  const user = await prismaClient.user.findUnique({
    where : {
      id : userId
    }
  }) ;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.message });
  }
}catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
  const { slug } = validationResult.data;
  try {
  const room = await prismaClient.room.create({
    data : {
      slug : slug ,
      adminId : userId
    }
  }) ;
  return res.json({ message: "Room created successfully", roomId: room.id });
  } 
 catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal server error , room already exists" });
  }
}
); 

app.get ("/chats/:roomId" , authenticateToken , async (req, res) => {
  const roomId = Number(req.params.roomId) ;
  try{
    const messages = await prismaClient.chat.findMany({
    where : {
      roomId : roomId
    },
    orderBy : {
      id : "desc"
    },
    take : 50 
  }) ;
   res.json({ messages }) ;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`http-backend listening on http://localhost:${port}`);
});
