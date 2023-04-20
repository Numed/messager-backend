const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.clientBase,
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
});

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(cors());
app.use("/messanger/api", require("./routes/auth.routes"));

const start = async () => {
  try {
    await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

io.on("connection", (socket) => {
  socket.on("socketSubmit", (data) => {
    io.emit("messageResponse", { ...data, isBot: true });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

start();
