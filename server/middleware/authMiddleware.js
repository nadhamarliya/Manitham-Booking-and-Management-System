import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            // FIXED: Return 401 Unauthorized instead of 404
            return res.status(401).json({ success: false, error: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        // FIXED: Match the token structure (_id) generated in authController
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

export default verifyUser;
