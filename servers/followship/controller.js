const followshipService = require("./service");

const followshipController = {
  followUser: (req, res) => {
    followshipService.followUser(req, res, (data) =>
      res.status(data.status).json(data)
    );
  },
  unFollowUser: (req, res) => {
    followshipService.unFollowUser(req, res, (data) =>
      res.status(data.status).json(data)
    );
  },
};

module.exports = followshipController;
