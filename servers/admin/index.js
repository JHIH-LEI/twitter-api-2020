const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../../.env" });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

require("./routes")(app);

app.listen(port, () => console.log(`admin server listening on port ${port}!`));

module.exports = app;
