module.exports=(req,res,next)=>{
    res.locals.isAuthenticated=req.signedCookies.currentUser ? true : false;
    next();
};