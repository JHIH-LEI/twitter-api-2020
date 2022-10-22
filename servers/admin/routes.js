const express = require("express");
const router = express.Router();
const adminController = require("./controller");

const { authenticated, authenticatedAdmin } =
  process.env.NODE_ENV == "docker"
    ? require("./middlewares/auth")
    : require("../../middlewares/auth");

router.get("/tweets", adminController.getTweets);
router.get("/users", adminController.getUsers);
router.delete("/tweets/:id", adminController.removeTweet);

module.exports = (app) => {
  app.use("/api/admin", authenticated, authenticatedAdmin, router);
};
