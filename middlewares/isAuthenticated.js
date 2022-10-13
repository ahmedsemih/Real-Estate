const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    res.cookie("previousPage",req.headers.referer || req.headers.referrer);
    jwt.verify(req.signedCookies.accessToken,process.env.SECRET_KEY,(error)=>{
        if(error){
            res.clearCookies("currentUser");
            redirect('/login');
        }
        next();
    });
};