
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const uc = require("upper-case");
// const firstLetterCap = require("capitalize");
// const test = require('tape')

//const localStorage = require("node-localstorage")
let items = ["Biriyani", "Fish"];
let workItem = ["singapore"];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");


//Home section
app.get("/", function(req, res)  {
 let today = date.getDay();
res.render("list", {listTitle:today,newListItems: items });
});


app.post("/", function(req, res) {
  let item = req.body.addList.slice(0,1).toUpperCase() + req.body.addList.slice(1,req.body.addList.length).toLowerCase(); ;
  
  
  
  //const ucItem = firstLetterCap.Capitalize(req.body.addList);
 // console.log(ucItem);
 
  if(req.body.list === "work Items") {
    workItem.push(item);
    res.redirect("/work");
  }
   else {
    items.push(item);
    res.redirect("/");
   }


});

app.get("/work", function(req,res) {
  res.render("list", {listTitle: "work Items", newListItems: workItem});
});

app.get("/about", function(req,res) {
  res.render("about");
})





app.listen(3000, function(req, res) {
  console.log("your server is running on port 3000");
})