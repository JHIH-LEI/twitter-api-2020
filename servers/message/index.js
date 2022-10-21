const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const messageController = require("./controller");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../../.env" });
}

const { authenticated, authenticatedUser } = require("../../middlewares/auth");

const port = process.env.PORT || 3000;

app.use(cors());

router.get("/:roomId", messageController.getHistoryMessage);
app.use("/api/messages", authenticated, authenticatedUser, router);

app.listen(port, () =>
  console.log(`message server now is listening on port:${port}`)
);
