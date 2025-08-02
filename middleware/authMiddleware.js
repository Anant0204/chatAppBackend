import jwt from 'jsonwebtoken';
import redisClient from '../services/redisService.js';





export const authUser = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token) {
            return res.status(401).json({error: "Unauthorized User" });
        }
        const isTokenBlacklisted =await redisClient.get(`blacklist:${token}`);
        if (isTokenBlacklisted) {  
            res.cookie("token", "")
            return res.status(401).json({error: "Token is blacklisted" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT →', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({error: "Unauthorized User" });
    }
}