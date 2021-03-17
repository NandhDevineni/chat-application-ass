// "uri":"mongodb+srv://shehzad_kareem_137:test1122@cluster0.lamak.mongodb.net/test?retryWrites=true&w=majority",
// heroku git:remote -a whatsapp137
const mongoose = require("mongoose");
const config = require("config");
const body = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();

mongoose
  .connect(config.get("uri"), {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use("/api/users", require("./Routes/user.routes"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
