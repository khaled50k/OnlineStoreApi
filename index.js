const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer=require('multer')
const path=require('path')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

dotenv.config();
const storage=multer.diskStorage({
  destination:'./upload/images',
  filename:(req,file,cb)=>{
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload =multer({
 storage:storage
})


mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB Connection Successful!");
});
const auth = require("./routes/auth");
const user = require("./routes/user");
const product = require("./routes/product");
const cart = require("./routes/cart");
const order = require("./routes/order");
const category = require("./routes/category");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
 // credentials: true,
 origin: 'https://onlinestore-1.khaledwaleade.repl.co'
}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3031");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use('img',express.static('upload/images'))
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/cart", cart);
app.use("/api/order", order);
app.use("/api/category", category);


app.post('/upload',upload.single('img'),(req,res)=>{
  console.log(req.file);
  res.status(200).json({'img':req.file.filename})
})
app.get('/images/:name',(req,res)=>{
     res.sendFile(__dirname +`/upload/images/${req.params.name}.jpg`)   
})
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
