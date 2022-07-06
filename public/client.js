import {
  search,
  savePosts,
  create_UUID,
  getLoginParameters,
  createPost,
} from "./utilities.js";

const sendPostButton = document.querySelector(".confirmButton");

sendPostButton.onclick = async function () {
  const textarea = document.querySelector(".textarea");
  let text = textarea.value;
  let userid,
    name,
    avatar,
    postDate = 0;

  /* Create the post in the database */

  // Cookies
  let token = decodeURIComponent(document.cookie.split("token="));
  token = token.split(",");
  token = token[1];

  const loginData = await getLoginParameters(document.cookie);
  // Date from post creation
  const date = new Date();

  // The data to insert into posts and database
  const data = {
    text,
    name: loginData.name,
    date,
    avatar: loginData.avatar,
    userID: loginData.userID,
    likes: 0,
  };

  const _id = await savePosts({
    text: data.text,
    name: data.name,
    date: data.date,
    avatar: loginData.avatar,
    userID: loginData.userID,
    likes: 0,
  });
  data._id = _id;
  // Visually create the postF
  const appender = document.querySelector(".main-content");
  createPost(appender, data);
};

// check cookies to see if logged or not

if (!decodeURIComponent(document.cookie)) {
  async function redirection() {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    // send to server verification and redirectionament
    var serverVerification = await fetch("/redirectToRegister", options);
    // go to login site if don't logged
    window.location.href = serverVerification.url;
  }
  redirection();
}

// Create the already posted posts

createOlderPosts();

async function createOlderPosts() {
  // Get from server the posts
  const data = [];
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const request = await fetch("/loadPosts", options);
  const response = await request.json();

  // Create the posts in html using the data got from server
  const appender = document.querySelector(".main-content");
  JSON.parse(response.posts).forEach((element) => {
    createPost(appender, element);
  });
}

// Search mechanism
const searchButton = document.querySelector(".search-button");
searchButton.onclick = () => {
  search();
};

// lorem ipsum to the posts
const loremIpsumGeneratorButton = document.querySelector(".textGenerator");
loremIpsumGeneratorButton.onclick = () => {
  lorem();
};

async function lorem() {
  const data = [];
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const request = await fetch("/loremIpsumGenerator", options);
  const response = await request.json();
  let textarea = document.querySelector(".textarea");
  textarea.value = JSON.parse(response.lorem);
}

/*
var lat = 5;
var lon = 3;
var data = {lat, lon}
//var data = JSON.stringify({lat,lon})
const options = {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(data)
    }
console.log(options.body)

async function data5(){
    // send to server /api with data inside options
    const res = await fetch('/api', options)
    // returned data from server in json
    const json = await res.json()
    console.log(json)
}

data5()*/
