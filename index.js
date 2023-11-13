const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')
const bodyParser=require('body-parser')
const userRouter=require('./Routes/userRouter')
const port = 6000
mongoose
  .connect("mongodb://127.0.0.1:27017/miniProject")
  .then(() => console.log("connected to database"))
  .catch(() => console.log("error while connection"));

  app.use(express.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use(userRouter)
app.listen(port, () => {
  console.log("app is listenig to port:"+port);
});
