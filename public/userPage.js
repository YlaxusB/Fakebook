import { createPost } from "/utilities.js";
import { search } from "./utilities.js";

// Search mechanism
const searchButton = document.querySelector(".search-button");
searchButton.onclick = () => {
  search();
};

createOlderPosts();
async function createOlderPosts() {
  let url = document.URL.split("?");
  let filter = [decodeURI(url[1].split("=")[1])];
  // Get from server the posts
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filter }),
  };
  const request = await fetch("/loadPosts", options);
  const response = await request.json();

  // Create the posts in html using the data got from server
  const appender = document.querySelector("body");
  JSON.parse(response.posts).forEach((element) => {
    createPost(appender, element);
  });
}
