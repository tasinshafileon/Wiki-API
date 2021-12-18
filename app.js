const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
  title: "String",
  content: "String"
};

const Article = mongoose.model("article", articleSchema);

app.get("/articles", function(req, res){
  Article.find({}, function(err, found) {
    if (!err) {
      res.send(found);
    }else{
      res.send(err);
    }
  });
});

app.post("/articles", function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Article added successfully");
    }else{
      res.send(err);
    }
  });
});

app.delete("/articles", function(req, res){
  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Deleted all the articles successfully");
    }else{
      res.send(err);
    }
  });
});

app.listen(process.env.port || 3000 , function(){
  console.log("Server is up and running");
});
