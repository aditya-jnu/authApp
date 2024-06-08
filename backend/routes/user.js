const express=require('express');
const router=express.Router();

//importing all the controller
const{signup,signin}=require('../controllers/usercontrol');

const{auth, isStudent, isAdmin}=require('../middlewares/auth');

//create mapping

// router.post("/login",login);
router.post("/signup",signup);
router.post("/signin",signin);

// protected route

router.get("/student",auth,isStudent,(req,res)=>{res.json({
    sucess:true,
    message:"This is Student Page"
})})

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:'true',
        message:"This is Admin Page"
    })
})


module.exports=router;