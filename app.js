require("dotenv").config()

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
//DB Connection
mongoose.connect(process.env.DATABASE, //variable coming from .env file
 {
    useNewUrlParser: true, //need for db connection
    useUnifiedTopology: true, //keeps db connection alive
    useCreateIndex: true //keeps db connection alive
}).then(()=>{
    console.log("DB CONNECTED!!")
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);

//Ports
const port = process.env.PORT || 8000; // env variable from dotenv npm package
//Starting Server
app.listen(port, ()=>{
    console.log(`app is running at ${port}`)
})