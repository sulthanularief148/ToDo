const express = require("express");
const bodyParser = require("body-parser");
const uc = require("upper-case");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
// const script = require("/index.js")

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"))
app.set("view engine", "ejs");



//Connecting with Mongoose database
main().catch(err => console.log(err));
async function main(db, err) {
  mongoose.connect("mongodb://localhost:27017/todolistDb");

};


//Created List Items Schema
const listItemSchema = {
  name: {
    type: String,
    require: true
  }
};

//Create new list Model "List" is collection of "todolistDb". Home route
const List = mongoose.model("List", listItemSchema);
const welcome = new List({
  name: "Welcome to the todo list!"
});


const allData = [welcome];


//2.Dynamic collection Lists and create new Schema here

const routeSchema = {
  name: String,
  items: [listItemSchema]
};

//Create a Dynamic route collection model.
// Model 2
const routeModel = mongoose.model("route", routeSchema);






//Home section
app.get("/", function (req, res) {
  List.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      List.insertMany(allData, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully added your data")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: founditems
      });
    }
  });
});


//Below code is refer to we can create dynamic routein for user friendly
app.get("/:customList", function (req, res) {
  const requestedTitle = _.capitalize(req.params.customList);
  console.log(requestedTitle);

  routeModel.findOne({
    name: requestedTitle
  }, function (err, foundList) {
    if (!err)
      if (!foundList) {
        //Existing List
        const newRouteList = new routeModel({
          name: requestedTitle,
          items: allData
        });
        newRouteList.save();
        res.redirect("/" + requestedTitle);
      }

    else {
      //Show new list
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items
      });

    }
  });

});




//Post the new list item to the Hmoe route
// app.post("/", function (req, res) {
//   let itemName = req.body.addList;
//   let itemLen = req.body.addList.length;
//   let item = itemName.slice(0, 1).toUpperCase() + itemName.slice(1, itemLen).toLowerCase();

//   let listName = req.body.list;
//   const NewItem = new List({
//     name: item
//   });


//   if (listName === "Today") {
//     NewItem.save();
//     res.redirect("/");
//   } else {
//     routeModel.findOne({
//       name: listName
//     }, function (err, foundItem) {
//       console.log("foundItem: " + foundItem);
//       foundItem.listItems.push(NewItem);
//       foundItem.save();
//       res.redirectt("/" + listName);
//     });
//   }


// });

// List.deleteMany({
//   allData
// }).then(function () {
//   console.log("Data deleted"); // Success
// }).catch(function (error) {
//   console.log(error); // Failure
// });


app.post("/", function (req, res) {

  const itemName = req.body.addList;
  const listName = req.body.list;

  const item = new List({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    routeModel.findOne({
      name: listName
    }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

//Below code is refer to If use of checkbox we delete the Items in the list is Database 

app.post("/delete", function (req, res) {
  const checkedItem = req.body.check;
  const listName = req.body.listName;

  if (listName === "Today") {
    List.findByIdAndRemove(checkedItem, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    routeModel.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItem
        }
      }
    }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});






app.get("/about", function (req, res) {
  res.render("about");
});
















app.listen(3000, function (req, res) {
  console.log("your server is running on port 3000");
});