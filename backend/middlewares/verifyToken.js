const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

module.exports = verifyToken;
