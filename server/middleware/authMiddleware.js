import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        // SECURE CHANGE: Look for the token inside the incoming cookies object dictionary instead of headers
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(404).json({ success: false, error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(!decoded) {
            return res.status(404).json({ success: false, error: "Invalid token" });
        }

        const user = await User.findById({ _id: decoded._id }).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error" });    
    }
}

export default verifyUser;
