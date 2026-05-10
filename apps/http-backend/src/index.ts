
import express from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from '@repo/backend-common/config' ;
import { authenticateToken } from "./middleware";
import {CreateUserSchema , LoginUserSchema , CreateRoomSchema} from '@repo/common/types' ;
import {prismaClient} from '@repo/db/client' ;
import cors from "cors" ;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: false
}));

const connectWithRetry = async (attempts = 5, delayMs = 1_000) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      await prismaClient.$connect();
      return;
    } catch (error) {
      console.error("Database connection attempt failed:", error);
      if (i === attempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
};

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
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}); 

app.get("/health/db", async (_req, res) => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return res.json({ ok: true });
  } catch (error) {
    console.error("Database health check failed:", error);
    return res.status(500).json({ ok: false });
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

// In-memory storage for shapes (temporary for testing)
const shapeStorage: Record<number, any[]> = {};

app.post("/chats/:roomId", async (req, res) => {
  try {
    const roomIdParam = req.params.roomId;
    const { message, userId } = req.body;

    if (!roomIdParam || isNaN(Number(roomIdParam))) {
      return res.status(400).json({ error: "Invalid roomId" });
    }

    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId required" });
    }

    const roomId = Number(roomIdParam);

    // Store in memory
    if (!shapeStorage[roomId]) {
      shapeStorage[roomId] = [];
    }
    
    const newMessage = {
      id: shapeStorage[roomId].length + 1,
      roomId,
      message,
      userId,
      createdAt: new Date()
    };
    
    shapeStorage[roomId].push(newMessage);

    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomIdParam = req.params.roomId;

    if (!roomIdParam || isNaN(Number(roomIdParam))) {
      return res.status(400).json({ error: "Invalid roomId" });
    }

    const roomId = Number(roomIdParam);

    const messages = shapeStorage[roomId] || [];
    
    res.json({ messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get ("/room/:slug" , authenticateToken , async (req, res) => {
  const slugParam = req.params.slug;

  if (typeof slugParam !== "string" || !slugParam.trim()) {
    return res.status(400).json({ error: "Invalid room slug" });
  }

  try{
    const room = await prismaClient.room.findFirst({
    where : {
      slug: slugParam
    }
  }) ;
   res.json({ room }) ;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const port = 3001;
const startServer = async () => {
  await connectWithRetry();
  app.listen(port, () => {
    console.log(`http-backend listening on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
