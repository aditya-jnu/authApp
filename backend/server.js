const express=require('express');
const app=express();

require("dotenv").config();
const PORT=process.env.PORT||5000;

app.use(express.json());

const dbConnect=require('./config/database')
dbConnect();

const authRoute=require('./routes/user');
app.use("/api/v1", authRoute);

app.listen(PORT,()=>{console.log(`Listening on ${PORT}`)})

