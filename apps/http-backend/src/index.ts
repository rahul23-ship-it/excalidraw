import express from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = "ilovemessi";

const app = express();
app.use(express.json());

app.post("/signup" , (req, res) => {
  const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    




const port = 3001;
app.listen(port, () => {
  console.log(`http-backend listening on http://localhost:${port}`);
});
