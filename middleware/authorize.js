require('dotenv').config()
const jwt = require("express-jwt");


const authorize = (roles =[]) => {
    if(typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret: process.env.TOKEN_SECRET , algorithms: ["HS256"] }),

        (req,res,next) => {
            console.log(req.user);
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: "Unauthorized" });
              }
        
              // authentication and authorization successful
              next();
        },
    ]
}

module.exports = authorize;