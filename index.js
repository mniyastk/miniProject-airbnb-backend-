const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./Routes/userRouter");
const hostRouter = require("./Routes/hostRouter");
const port = 4000;
require("dotenv").config()
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("connected to database"))
  .catch(() => console.log("error while connection"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(userRouter);
app.use(hostRouter);
app.listen(port, () => {
  console.log("app is listenig to port:" + port);
});
