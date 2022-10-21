const messageService = require("./service");

const messageController = {
  getHistoryMessage: (req, res) => {
    messageService.getHistoryMessage(req, res, (data) => {
      if (data.status) return res.status(data.status).json(data);
      return res.json(data);
    });
  },
};

module.exports = messageController;
