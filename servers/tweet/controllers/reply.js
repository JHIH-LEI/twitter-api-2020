const replyService = require("../services/reply");

const replyController = {
  getTweetReplies: (req, res) => {
    replyService.getTweetReplies(req, res, (data) =>
      res.status(200).json(data)
    );
  },
};

module.exports = replyController;
