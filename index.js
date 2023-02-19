const express = require("express")
const app = express()
const {userRouter} = require("./routers/userroute")

const cors = require('cors');

app.use(cors())

const {connection} = require("./db")
require('dotenv').config()
const swaggerUI = require("swagger-ui-express")
const swaggerJSDoc = require("swagger-jsdoc")
app.use(express.json())

const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"full stack crud project's swagger",
            version:"1.0.0"
        },
        server:[
            {
                url:"http://localhost:6020"
            }
        ]
    },
    apis:["./routes/*.js"]
}


const swaggerSpec = swaggerJSDoc(options)

app.use("/docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec))

app.get("/",(req,res)=>{
    res.send("welcome to full stack project")
})

app.use("/users",userRouter)


app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("server is connected to database")
    } catch (error) {
        console.log(error)
    }
    console.log(`server is runnig at${process.env.PORT}`)
})