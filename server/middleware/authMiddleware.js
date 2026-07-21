import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        // Read token from standard Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: "Token not provided" });
        }

        const token = authHeader.split(' ')[1]; // Extract token text

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}

export default verifyUser;
