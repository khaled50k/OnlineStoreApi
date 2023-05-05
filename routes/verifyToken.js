// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");

// Middleware function to verify a token
const verifyToken = (req, res, next) => {
  // Get the token from the request header
  const authHeader = req.headers.token;
  // If no token found, return an unauthorized response
  if (!authHeader) {
    return res.status(401).json("You are not authenticated!");
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];
  // Verify the token
  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    // Attach the decoded user object to the request
    req.user = user;
    next();
  });
};

// Middleware function to verify a token and authorization
const verifyTokenAndAuthorization = (req, res, next) => {
  // Verify the token
  verifyToken(req, res, () => {
    // Check if the user userId matches the request parameter userId or the user is an admin
    if (req.user.userId === req.params.userId || req.user.role === "admin") {
      next();
    } else {
      // Return a forbidden response if the user is not authorized
      res.status(403).json("You are not allowed to do that");
    }
  });
};

// Middleware function to verify a token and admin status
const verifyTokenAndAdmin = (req, res, next) => {
  // Verify the token
  verifyToken(req, res, () => {
    // Check if the user is an admin
    if (req.user.role === "admin") {
      next();
    } else {
      // Return a forbidden response if the user is not an admin
      res.status(403).json("You are not allowed to do that");
    }
  });
};

// Middleware function to get the user ID from a token
const getUserId = (req, res, next) => {
  // Verify the token
  verifyToken(req, res, () => {
    // Extract the token from the request header
    const authHeader = req.headers.token;
    const token = authHeader.split(" ")[1];
    // Decode the token and send the user ID in the response
    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(403).json("Token is not correct");
      }
      console.log(decoded);
      res.status(200).json(decoded);
    });
  });
};

// Export the middleware functions
module.exports = {
  getUserId,
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
