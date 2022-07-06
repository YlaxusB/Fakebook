const { response } = require("express");
const { MongoClient } = require("mongodb");
const express = require("express");
const res = require("express/lib/response");
const app = express();
const port = 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

//app.use(express.static('./index.html'))
app.use(express.static(__dirname + "/public"));
app.use(express.json({ limit: "1mb" }));

/* Database */

const mongoURI =
  "mongodb+srv://asde:qwe@cluster0.pm5se.mongodb.net/Fakebook?retryWrites=true&w=majority";
const client = new MongoClient(mongoURI);
client.connect();

const bodyParser = require("body-parser");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { mongoose } = require("mongoose");
const myParser = require("body-parser");
const fs = require("file-system");

app.use(myParser.json({ limit: "200mb" }));
app.use(myParser.urlencoded({ limit: "200mb", extended: true }));

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage });

// Insert the register data in database
async function insertToDatabase(data) {
  const salt = 10;

  data.password = await bcrypt.hash(data.password, salt);
  const users = client.db("Fakebook").collection("Users"); // Get the collection from the database

  // Verify if the email inst already registered
  query = { email: data.email };
  const queried = await users.findOne(query);
  if (queried != null) {
    return (bool = false);
  }

  client
    .db("Fakebook")
    .collection("Avatars")
    .insertOne({ image: data.avatar }, (err, result) => {
      if (err) return console.log(err);
      data._id = result.insertedId;
      delete data.avatar;
      users.insertOne(data);
    });
  return (bool = true);
}

// Verify if the email and password are already registered

async function verifyLogin(data) {
  const users = client.db("Fakebook").collection("Users"); // Get the collection from the database

  // Verify the email
  const currentUser = await users.findOne({ email: data.email });
  if (
    currentUser != null &&
    (await bcrypt.compare(data.password, currentUser.password)) == true
  ) {
    return { string: "true", uuid: currentUser.uuid };
  } else if (currentUser == null) {
    // Didn't find any email
    return { string: "email" };
  } else {
    // Incorret Password
    return { string: "password" };
  }
}

/* Database */

app.get("/", function (req, res) {
  res.redirect("/client.html");
});

app.get("/register", (request, response) => {
  response.sendFile(__dirname + "/public/register.html");
});

app.post("/redirectToRegister", (request, response) => {
  response.redirect("/register");
});

// Save post
app.post("/savePost", async (request, response) => {
  const users = client.db("Fakebook").collection("Posts"); // Get the collection from the database
  users.insertOne(request.body).then((e) => {
    response.json(e.insertedId);
  });
});

// From register button in the register page
app.post(
  "/registerNewUser",
  upload.single("file"),
  async (request, response) => {
    await insertToDatabase(request.body);
    response.json({ bool });
  }
);

// From login button in the register page
app.post("/verifyLogin", async (request, response) => {
  response.json(await verifyLogin(request.body));
});

// Get the name of the user to create the post with her name
app.post("/loginGetParameters", async (request, response) => {
  const users = client.db("Fakebook").collection("Users");
  const avatars = client.db("Fakebook").collection("Avatars");
  let foundUser = await users.findOne({ uuid: request.body.token });
  let avatar = await avatars.findOne({ _id: foundUser._id });
  foundUser.avatar = avatar.image;
  response.json({ user: foundUser });
});

/*
app.post('/api', (request,response)=>{
    //res.json({a:1})
    const data = request.body;
    //res.json({status: 'success', latitude: data.lat, lontitude: data.lon})
    response.json({status:'success', latitude:data.lat, lontitude:data.lon})
})
*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Easily clear the mongo database
app.post("/clearDatabase", async (request, response) => {
  const users = client.db("Fakebook");
  if (users.listCollections().namespace.db == "Fakebook") {
    users.dropCollection("Users");
  }
  users.createCollection("Users");
});

// Clear all posts
app.post("/clearPosts", async (request, response) => {
  const users = client.db("Fakebook");
  if (users.listCollections().namespace.db == "Fakebook") {
    users.dropCollection("Posts");
  }
  users.createCollection("Posts");
});

// Get the posts from database and send to client
app.post("/loadPosts", async (request, response) => {
  // if there's no filter then just load all posts
  if (request.body.filter[0] == null || request.body.filter[0] == undefined) {
    await client
      .db("Fakebook")
      .collection("Posts")
      .find({})
      .toArray(function (err, results) {
        response.json({ posts: JSON.stringify(results) });
      });
  } else {
    // if there's a filter then loads based on the filter
    await client
      .db("Fakebook")
      .collection("Posts")
      .find({ userID: request.body.filter[0] })
      .toArray(function (err, results) {
        response.json({ posts: JSON.stringify(results) });
      });
  }

  // avatar: client.db("Fakebook").collection('Avatars').find({})
});

// Search mechanism
app.post("/redirectToSearch", async (request, response) => {
  let string = encodeURIComponent(request.body.val);
  response.redirect(`/search.html?query=${string}`);
});

// Lorem Ipsum generator to the posts
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});
app.post("/loremIpsumGenerator", async (request, response) => {
  response.json({ lorem: JSON.stringify(lorem.generateParagraphs(1)) });
});

// Search database to find someone to display
app.post("/searchQuery", async (request, response) => {
  // Find people
  const users = client.db("Fakebook").collection("Users"); // Get the collection from the database
  //    let people = await users.find({name:request.body.queryValue[0]}).toArray();

  const pipeline = [
    {
      $search: {
        index: "userSearchIndex",
        autocomplete: {
          query: `${request.body.queryValue[0]}`,
          path: "name",
        },
      },
    },
  ];
  let people = await users.aggregate(pipeline).toArray();
  // Find the avatar from the people
  await people.forEach(async (element, index) => {
    element.avatar = client
      .db("Fakebook")
      .collection("Avatars")
      .findOne({ _id: element._id })
      .then((value) => {
        element.avatar = value.image;
        if (index == people.length - 1) {
          response.json({ people });
        }
      })
      .catch((error) => {
        console.log(error + "\n" + "Error trying to find people avatars");
      });
  });
});

// Redirect to the user page, where there will be the their posts
app.get("/user/:user", async (request, response) => {
  response.sendFile(__dirname + "/public/userPage.html");
});

// Add likes to the posts
app.post("/addLike", async (request, response) => {
  const posts = client.db("Fakebook").collection("Posts");
  const post = await posts.findOne({ _id: ObjectId(request.body.postID) });
  post.likes = parseInt(post.likes) + 1;

  posts.findOneAndUpdate(
    { _id: ObjectId(request.body.postID) },
    { $set: { likes: post.likes } },
    { upsert: true, multi:true },
    
  ).then((value) => {
    let asd = {a:value.lastErrorObject, b:value.ok, c:request.body.likes};
    console.log(asd)
    response.json({ status: 200 });
  })
  
  // await posts.findOneAndUpdate(
  //   { _id: ObjectId(request.body.postID) },
  //   { $set: { likes: post.likes } },
  //   { upsert: true },
  //   (err, result) => {
  //     if (err) {
  //       response.json({ status: 400 });
  //     } else {
  //       response.json({ status: 200 });
  //     }
  //   }
  // );
});

// Remove post
app.post("/removePost", async (request, response) => {
  const removedPost = await client
    .db("Fakebook")
    .collection("Posts")
    .findOneAndDelete({ _id: ObjectId(request.body.postID.toString()) });
  if (removedPost.value) {
    response.json({ status: 200 });
  } else {
    response.json({ status: 400 });
  }
});
