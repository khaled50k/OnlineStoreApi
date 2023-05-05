// import required packages and modules
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const fs = require("fs");

// configure dotenv to access environment variables
dotenv.config();

// set up multer storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// initialize multer middleware for file uploads
const upload = multer({
  storage: storage,
});

// connect to MongoDB database
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB Connection Successful!");
});

// import routes for various API endpoints
const auth = require("./routes/auth");
const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const order = require("./routes/order");
const category = require("./routes/category");

// initialize express application
const app = express();

// configure middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // credentials: true,
    origin: "https://onlinestore-1.khaledwaleade.repl.co",
  })
);

// handle static files
app.use("img", express.static("upload/images"));

// configure API endpoints
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/cart", cart);
app.use("/api/order", order);
app.use("/api/category", category);

// handle image upload
app.post("/api/upload", upload.single("img"), (req, res) => {
  try {
    console.log(req.file);
    res.status(200).json({ img: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

// handle image retrieval
app.get("/images/:name", (req, res) => {
  try {
    const imagePath = path.join(__dirname, "/upload/images/", req.params.name);
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving image" });
  }
});

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
