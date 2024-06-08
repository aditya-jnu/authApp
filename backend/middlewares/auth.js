const jwt=require('jsonwebtoken')
require('dotenv').config();

// auth wala middleware here is used for authentication

// auth middleware
exports.auth=(req,res,next)=>{
    try{
        // extract jwt
        const token=req.body.token; // or req.cookies.token
        if(!token){
            return res.status(401).json(
                {
                    success:'false',
                    message:'token missing'
                }
            )
        }

        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET)
            // token me jo bhe data pada rahega yha se nikal jayega
            console.log("Hello ",decode)
            req.user=decode;
        }
        catch(err){
            return res.status(401).json(
                {
                    success:'false',
                    message:'token is invalid'
                }
            )
        }

        next();

    }catch(err){
        return res.status(401).json(
            {
                success:'false',
                message:err
            }
        )

    }

}


// dono student aur admin wala middleware role check kar rah therefore we can say these two middleware is used for authorization

// isStudent middleware
exports.isStudent=(req,res,next)=>{
   try{
    if(req.user.role!=="Student"){
        return res.status(401).json(
            {
                success:'false',
                message:'This is protected route only for students.'
            }
        )
    }
    next();
   }catch(err){
    return res.status(401).json({
        success:'false',
        message:'Error while login as student.'
    })
   }
}

// isAdmin middleware
exports.isAdmin=(req,res,next)=>{
    try{
        if(req.body.decode!=='Admin'){
            return res.status(401).json(
                {
                    success:'false',
                    message:'This is protected route only for admins.'
                }
            )
        }
        next();
    }catch(err){
        return res.status(401).json({
            success:'false',
            message:'Error while signin as an Admin'
        })

    }
}