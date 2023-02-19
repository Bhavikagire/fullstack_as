const express = require("express")
const userRouter = express.Router()
const {userModel} = require("../model/usermodel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


/**
 * @swagger
 *  components:
 *      schema:
 *          User:
 *              type:object
 *              properties:
 *                  -id:
 *                      type:string
 *                      description:the auto generated _id
 *                      name:
 *                          type:string
 *                          description:The user name
 *                      email:
 *                          type:string
 *                          description:The user's email
 *                      password:
 *                          type:string
 *                          description:The user's password
 */


/**
 * @swagger
 * /users:
 *  get:
 *      summary:This will get all users from db
 *      tags:[users]
 *      responses:
 *      200:
 *          description:THe list of all the users
 *          content:
 *              application/json:
 *                      Schema:
 *                          type:array
 *                          item:
 *                              $ref:"#/components/schemas/User"
 */

userRouter.get("/",async(req,res)=>{
    try {
        let user = await userModel.find()
        res.send(user)
    } catch (error) {
        res.send(error)
    }
})


userRouter.post("/register",async(req,res)=>{

    const {name,email,password} = req.body

    try {
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err)res.send(err)
            else{
                const user = new userModel({name,email,password:hash})
                await user.save()
                res.send("user register")
            }
        })
       
    } catch (error) {
        res.send(error)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user = await userModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    let token = jwt.sign({userID:user[0]._id},"masai")
                    res.send({"msg":"login success","token":token})
                }
                else{
                    res.send("wrong details")
                }
            })
        }
        else{
            res.send("something is wrong")
        }
    } catch (error) {
        res.send(error)
    }
})

userRouter.delete("/delete/:id",async(req,res)=>{
    const ID = req.params.id

   try {
    await userModel.findByIdAndDelete({_id:ID})
    res.send("user deleted")
  
   } catch (error) {
    res.send(error)
   }
})

userRouter.patch("/update/:id",async(req,res)=>{
    const ID = req.params.id

   try {
    await userModel.findByIdAndUpdate({_id:ID})
    res.send("user updated")
  
   } catch (error) {
    res.send(error)
   }
})

module.exports={userRouter}