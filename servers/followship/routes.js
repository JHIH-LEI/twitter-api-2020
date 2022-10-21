const express = require("express");
const router = express.Router();

const { authenticated, authenticatedUser } =
  process.env.NODE_ENV == "docker"
    ? require("./middlewares/auth")
    : require("../../middlewares/auth");

const followshipController = require("./controller");

router.post("/", followshipController.followUser);
router.delete("/:followingId", followshipController.unFollowUser);

module.exports = (app) => {
  app.use("/api/followships", authenticated, authenticatedUser, router);
};
