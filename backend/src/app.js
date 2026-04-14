const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/upload");

const app = express();
app.use(cors());
app.use(express.json());

// REST endpoint for image upload
app.use("/upload", uploadRoute);

module.exports = app;