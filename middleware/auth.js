const config = require('../config/config');
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
   const token = req.header("x-auth-token");

   if (!token) {
      return res.status(401).json({
         success: false,
         error: 'Access denied. Not authorized...' 
      })
   };
   
   try {
      const jwtSecretKey = config.JWT_SECRET;
      const decoded = jwt.verify(token, jwtSecretKey);
      req.user = decoded;
      next();
   } catch (err) { 
      return res.status(401).json({
         success: false,
         error: 'Invalid auth token...' 
      })
   }
   
}

module.exports = auth;