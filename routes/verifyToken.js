const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token=authHeader.split(" ")[1]
    jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
        if (err) res.status(403).json("Token is not valid!")
        req.user=user;
        next()
    })
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};
const verifyTokenAndAuthorization=(req,res,next)=>{
   verifyToken(req,res,()=>{
    if (req.user.id===req.params.id ||req.user.role=="admin" ) {
        next()
    }else{
        res.status(403).json("you are not alowed to do that")
    }
   }) 
}
const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
     if (req.user.role=="admin" ) {
         next()
     }else{
         res.status(403).json("you are not alowed to do that")
     }
    }) 
 }
 const getUserId=(req,res,next)=>{
  verifyToken(req,res,()=>{
    const authHeader = req.headers.token;
    const token=authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) {
        console.error(err);
          res.status(403).json('Token in not correct');
      }
      console.log(decoded);
      res.status(200).json(decoded)
    });
      
   }
  ) 
}
module.exports={getUserId,verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};