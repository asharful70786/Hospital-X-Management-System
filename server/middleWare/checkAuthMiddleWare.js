import Session from "../Models/sessionModel.js";

async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;
  // console.log(sid);
  if (!sid) {
    return res.status(400).json({ message: "You're not logged in, please login first." });
  }
  // console.log(sid);

  const session = await Session.findById(sid).populate({
    path: "userId",
    select: "-password  -__v -createdAt"
  });
  if (!session || !session.userId) {
    return res.status(400).json({ message: "Session expired or user not found" });
  }

  req.user = session.userId;
  req.user.role = session.userId.role
  next()

}

export default checkAuth