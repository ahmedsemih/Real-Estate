const jwt = require("jsonwebtoken");

module.exports=(req,res,next)=>{
    jwt.verify(req.signedCookies.refreshToken,process.env.SECRET_KEY, (error,decoded)=>{
        if (error) {
            res.clearCookie("currentUser");
            return res.redirect("/auth/login");
        }
        
        const {id,role} = decoded;

        if(req.signedCookies.currentUser !== id || role !== "Administrator") return res.redirect("back");
        next();
    });
};