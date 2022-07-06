import { createPost, createPeople } from "./utilities.js";
import { search } from "./utilities.js";

// Search mechanism
const searchButton = document.querySelector(".search-button");
searchButton.onclick = () => {
  search();
};

async function loadPeople() {
  let query = document.URL.split("?");
  let queryValue = [decodeURI(query[1].split("=")[1])];
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queryValue }),
  };
  const request = await fetch("/searchQuery", options);
  const response = await request.json();
  console.log(response.people);

  response.people.forEach((element) => {
    console.log(element.password);
    createPeople(document.querySelector(".main-content"), {
      name: element.name,
      avatar: element.avatar,
      age: element.age,
      _id: element._id,
    });
  });
}

loadPeople();
