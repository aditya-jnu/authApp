// always remember every route is mapped with a controller

const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const userinfomodel=require('../models/usermodel');
require("dotenv").config;

//signup route handler
exports.signup=async (req,res)=>{ 
    try{
             //fetch data from req ke body
             const{name,email,password,role}=req.body;

             //find if user already exist
             const existingUser = await userinfomodel.findOne({email});
             if(existingUser){
                return res.status(400)(
                    {
                        success:false,
                        message:'User already exists'
                    }
                )
             }

            //  password security
            let hashedPass;
            try{
                hashedPass=await bcrypt.hash(password,10)
            }
            catch(err){
                return res.status(500).json({
                    success:false,
                    message:"error in hashing password"
                })
            }

            // saving user in DB
            const user=await userinfomodel.create(
                {
                    name, email, password:hashedPass, role
                }
            )
            return res.status(200).json({
                success:true,
                message:"Account created successfully!!"
            })
    }
    catch(err){
        console.log(err);
        return res.status(500).json(
            {
                success:false,
                message:"Account can't be created please try again later"
            }
        )
    }   
}

// signin route handler
exports.signin=async(req,res)=>{
    try{
        const{email,password}=req.body;
        // email aur pass dono enter karna hoga user ko
        if(!email || !password){
            return res.status(400).json(
                {
                    success:false,
                    message:'Please fill all the details'
                }
            )
        }
        //find if this mail exist
        let   existUser=await userinfomodel.findOne({email});
        if(! existUser){
            return res.status(400).json(
                {
                    success:false,
                    message:'User do not exist, kindly signup'
                }
            )
        }
       
        const payLoad={
            id:existUser._id,
            email:existUser.email,
            role:existUser.role
        }

        // verify password and genrate JW tokens
        if(await bcrypt.compare(password,existUser.password)){
             //password match toh login krwado
             let token=jwt.sign(payLoad,process.env.JWT_SECRET,{expiresIn:'2h'})
             
             existUser=existUser.toObject();
             existUser.token=token;
             existUser.password=undefined;
            //  i will return a cookie
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
             res.cookie("token",token,options).status(200).json(
                {
                    success:true,
                    token,
                    existUser,
                    message:'User logged in successfully!!'
                }
             )

        }
        else{
            return res.status(403).json(
                {
                    success:false,
                    message:'Incorrect password'
                }
            )
        }    
    }
    catch(err){
        console.log(err);
        return res.status(500).json(
            {
                success:'false',
                message:'Login failure'
            }
        )

    }
}