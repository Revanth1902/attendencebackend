const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://revanth19a:revanth@cluster0.4jsmfp8.mongodb.net/attendence-app"
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Routes
app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
