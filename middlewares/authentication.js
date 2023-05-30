const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");
const user = require("../models/user");

async function authentication(req, res, next) {
  try {
    // const token = req.headers.access_token
    const token = req.get("token");
    const Userdecoded = verifyToken(token);
    User.findOne({
      where: {
        id: Userdecoded.id,
        email: Userdecoded.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            message: "User not authenticated",
            devMessage: `User with id ${Userdecoded.id} not found`,
          });
        }
        res.locals.user = user;
        return next();
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Internal server error",
          devMessage: err.message,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json(err);
  }
}

module.exports = authentication;
