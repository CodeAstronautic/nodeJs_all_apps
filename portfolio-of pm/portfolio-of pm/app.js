const express = require("express");
var sslRedirect = require("heroku-ssl-redirect");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://manav:Msmsmsms1@cluster0-rpllp.mongodb.net/messagesDB?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const app = express();

// enable ssl redirect

app.use(sslRedirect());
var db = mongoose.connection;
// db.on("error", console.error.bind(console, 'conncetion error'));
// db.once('open', ()=>{
var messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

// });
const Message = mongoose.model("Message", messageSchema);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.set("view engine", "ejs");

app.post("/", (req, res) => {
  const name = req.body.iname;

  const email = req.body.iemail;
  const message = req.body.imessage;

  console.log(name, email, message);

  const mess = new Message({
    name: name,
    email: email,
    message: message,
  });

  mess.save();
  res.redirect("/submit");
});

app.get("/submit", (req, res) => {
  res.render("submit");
  console.log("reached submit");
});

app.post("/submit", (req, res) => {
  console.log("back to home");
  res.redirect("/");
});

//for rock paper scissor game redirection
app.get("/rps", (req, res) => {
  res
    .status(301)
    .redirect("https://manavendrasen.github.io/rock-paper-scissors/");
});
