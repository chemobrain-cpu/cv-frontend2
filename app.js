require('dotenv').config()
const app = require('express')();
const express = require('express')
const path = require("path")
require('dotenv').config()
const fs = require("fs")
app.use(express.static("public"));
app.use("/", express.static("public"));
const cors = require("cors")
const bodyParser = require("body-parser")
app.use(bodyParser.json())
const { body, validationResult } = require('express-validator')

////setting express to use  the session
app.use(cors())
app.use(bodyParser.json())



const userRoutes = require("./routes/user")
//using the routes
app.use(userRoutes.router)

//error handler //express error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 300
  return res.status(err.statusCode).json({
    response:err.message
  })
})



app.listen(process.env.PORT || 8080, (err) => {
  console.log("sucessfully running on port 8080")
})