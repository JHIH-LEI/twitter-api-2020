const express = require("express");
const router = express.Router();
const tweetController = require("./controllers/tweet");
const replyController = require("./controllers/reply");
const likeController = require("./controllers/like");

const { authenticated, authenticatedUser } = require("../../middlewares/auth");

router.post("/:tweet_id/replies", tweetController.postReply);
router.post("/:id/like", likeController.likeTweet);
router.post("/:id/unlike", likeController.unlikeTweet);
router.get("/:tweet_id/replies", replyController.getTweetReplies);
router.get("/:tweet_id", tweetController.getTweet);
router.put("/:tweet_id", tweetController.putTweet);
router.post("/", tweetController.postTweet);
router.get("/", tweetController.getTweets);

module.exports = (app) => {
  app.use("/api/tweets", authenticated, authenticatedUser, router);
};
