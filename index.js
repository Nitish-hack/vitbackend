const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const eventRoutes = require("./routes/event");
const studentRoutes = require("./routes/student");
const multer=require('multer');
const upload=multer({dest:"uploads/"});
const app = express();
const PORT=process.env.PORT||5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/uploads',express.static('uploads'));
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/student", studentRoutes);
app.use("/api/event",upload.single("image"),eventRoutes);



const server = app.listen(PORT, () =>
  console.log(`Server started on ${PORT}`)
);

