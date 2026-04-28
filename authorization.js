import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) {
        return res.status(401).json({
            type: "Error",
            message: "Access token is required"
        });
    }

    try {
        const decoded = JWT.verify(token, process.env.SECRET);
        req.user = decoded; // { id: UsuID, permissions: RolPermisos }
        next();
    } catch (error) {
        return res.status(403).json({
            type: "Error",
            message: "Invalid or expired token"
        });
    }
};

export const checkRole = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions) {
            return res.status(403).json({
                type: "Error",
                message: "No permissions found"
            });
        }

        // Assuming permissions is a string or array, check if user has required
        // For simplicity, if permissions includes the required, or exact match
        if (req.user.permissions !== requiredPermissions) {
            return res.status(403).json({
                type: "Error",
                message: "Insufficient permissions"
            });
        }

        next();
    };
};