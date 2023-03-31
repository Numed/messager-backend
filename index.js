const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json({ extended: true }));
app.use(cors());
app.use("messanger/api", require("./routes/auth.routes"));

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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

start();
