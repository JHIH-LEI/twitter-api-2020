const express = require("express");
const app = express();
const cors = require("cors");
const router = express.Router();
const subscribeshipController = require("./controller");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../../.env" });
}

const { authenticated, authenticatedUser } = require("../../middlewares/auth");

const port = process.env.PORT || 3000;

app.use(cors());

router.post("/", subscribeshipController.subscribeUser);
router.delete("/:subscribingId", subscribeshipController.unSubscribeUser);

app.use("/api/subscribeships", authenticated, authenticatedUser, router);

app.listen(port, () =>
  console.log(`subscribeship server now is listening on port:${port}`)
);
