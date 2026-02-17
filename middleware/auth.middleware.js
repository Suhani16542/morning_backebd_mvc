const jwt = require("jsonwebtoken");

/**
 * AUTHENTICATION (COOKIE BASED)
 */
const authenticate = (req, res, next) => {
  try {
    // 🔹 Token cookie se lo
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing"
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Access token expired"
          });
        }

        return res.status(401).json({
          success: false,
          message: "Invalid access token"
        });
      }

      // Payload check
      if (!decoded.userId || !decoded.role) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload"
        });
      }

      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };

      next();
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

/**
 * AUTHORIZATION
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized"
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
