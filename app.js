//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const contactContent = "Is it a perfectly rhyming poem or a poem with no rhyme but beautiful meaning? Is it a story you came up with while daydreaming in the night? Is it one of those amusing experiences that make you laugh or is it a lesson you learnt in your life? Share it with us if you wish to tell others about it. Stick around to read and feel what others want to share with you.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Admin-Shravya:test123@cluster0-vjd7x.mongodb.net/poemsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const poemSchema = new mongoose.Schema({
  title: String,
  info:String,
  content: String
});
const Poem = mongoose.model("Poem", poemSchema);

app.get("/", function(req, res) {
  let d=new Date();
  year= d.getFullYear();
  Poem.find(function(err, mypoems) {
    if (!err) {
       res.render("home", {myposts:mypoems, year:year});
    }
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    conCont: contactContent
  });
});

app.get("/change/compose", function(req, res) {
  Poem.find(function(err, mypoems) {
    if (!err) {
      res.render("compose", {
        myposts: mypoems
      });
    }
  })
});
app.post("/change/compose", function(req, res) {
  const poem = new Poem({
    title: req.body.posttitle,
    info:req.body.postinfo,
    content: req.body.postdata
  });
  poem.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/delete", function(req, res) {
  const poemId = req.body.poemId;
  Poem.findByIdAndRemove(poemId, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Poem.findOne({
    _id: requestedPostId
  }, function(err, resultpoem) {
    res.render("post", {
      titlename: resultpoem.title,
      infoofpost:resultpoem.info,
      contentofpost: resultpoem.content
    });
  });
});

let port=process.env.PORT;
if(port==null||port==""){
  port=3000
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
