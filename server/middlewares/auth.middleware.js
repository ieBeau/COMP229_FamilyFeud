
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  let token;

  /**@type {string} */const authheader = req.headers.authorization;
  if (authheader && authheader.startsWith('Bearer '))
    token = authheader.split(" ")[1];

  else if (req.cookies.token)
    token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (e) {
    return res.status(401).json({ message: "Invalid Token" });
  };

};
