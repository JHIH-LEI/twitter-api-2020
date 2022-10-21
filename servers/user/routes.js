const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const userController = require("./controller");
const { authenticated, authenticatedUser } =
  process.env.NODE_ENV == "docker"
    ? require("./middlewares/auth")
    : require("../../middlewares/auth");

router.post("/", userController.signUp);
router.get("/current", authenticated, userController.getCurrentUser);
router.use(authenticated, authenticatedUser);
router.get("/top", userController.getTopUser);
router.get("/messages", userController.getChatList);
router.get("/notifications", userController.getNotifications);
router.put(
  "/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  userController.putUser
);
router.get("/:id/replied_tweets", userController.getUserReplies);
router.get("/:id/likes", userController.getUserLikedTweets);
router.get("/:id/tweets", userController.getUserTweets);
router.get("/:id/followings", userController.getUserFollowings);
router.get("/:id/followers", userController.getUserFollowers);
router.get("/:id", userController.getUser);

module.exports = (app) => {
  app.use("/api/users", router);
  app.post("/api/login", userController.login);
};
