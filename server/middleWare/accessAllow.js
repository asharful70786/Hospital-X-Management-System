
const allow = (...permitted) => (req, res, next) => {
  console.log(`permitted role ${permitted}`);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized , please login first' });
  }

  if (!permitted.includes(req.user.role))
    return res.status(403).json({ message: `Forbidden , only access ${permitted}  ` });
  next();
};
 

export default allow;
