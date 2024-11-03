const { validateToken } = require("../services/auth");

function checkForAuthCookie(cookieName) {
    return (req, res, next) =>{
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            return next();
        }
        try {
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad;
        } catch (error) {
        }
         return next();
        
    }
}

module.exports = {
    checkForAuthCookie,
}