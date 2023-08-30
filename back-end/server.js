const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const {User,Video}=require("./mongoschema");
require('dotenv').config();
const connectMongoDB= require("./mongodb");
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY;
connectMongoDB();
app.use(cors());
app.use(bodyParser.json());

// User login and generate JWT token
app.post("/login", async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await User.find({ email, name });
    if (!user) {
      const user = new User({ email, name });
      await user.save();
    }
    const token = jwt.sign({ email: email, name: name }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
}

// Protected route
app.get("/user", verifyToken, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

app.get("/recordings", verifyToken, async (req, res)=>{

  const{email,name}=req.user;
  const recordings = await Video.find({email, name});
  res.status(200).json(recordings);
})

app.post('/recordings', async (req, res) => {
  const { url, name, email } = req.body;

  try {
    const newVideo = new Video({ url, name, email });
    await newVideo.save();

    res.status(200).json({ message: 'Video recorded and saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving the video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
