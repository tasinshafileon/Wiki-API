const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb+srv://' + process.env.USER_NAME + ':' + process.env.USER_PASSWORD + '@cluster0.ai3n9.mongodb.net/wiki-api');

const articleSchema = {
  title: "String",
  content: "String"
};

const Article = mongoose.model("article", articleSchema);

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, found) {
      if (!err) {
        res.send(found);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Article added successfully");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Deleted all the articles successfully");
      } else {
        res.send(err);
      }
    });
  });

app.route("/articles/:article")
  .get(function(req, res) {
    Article.findOne({
      title: {
        $regex: req.params.article,
        $options: 'i'
      }
    }, function(err, found) {
      if (!err) {
        res.send(found);
      } else {
        res.send(err);
      }
    });
  })
  .put(function(req, res) {
    Article.findOneAndUpdate({
      title: {
        $regex: req.params.article,
        $options: 'i'
      }
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("Article Successfully Updated");
      }else {
        res.send(err);
      }
    });
  })
  .patch(function(req, res) {
    Article.updateOne({
      title: {
        $regex: req.params.article,
        $options: 'i'
      }
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Article Successfully Patched");
      }else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: {
        $regex: req.params.article,
        $options: 'i'
      }
    }, function(err){
      if(!err){
        res.send("Article Deleted")
      }else {
        res.send(err);
      }
    });
  });

app.listen(process.env.port || 3000, function() {
  console.log("Server is up and running");
});
