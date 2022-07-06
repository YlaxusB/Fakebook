import { create_UUID } from "./utilities.js";

const registerButton = document.querySelector(".register#button");
registerButton.onclick = () => register();

registerButton.addEventListener("Touch", register());

async function register() {
  const email = document.querySelector(".register#input-email").value;
  const name = document.querySelector(".register#input-name").value;
  const password = document.querySelector(".register#input-password").value;
  const age = document.querySelector(".register#input-age").value;
  const avatar = document.querySelector(".register#input-avatar").files[0];

  // create cookie with uuid to auto login until browser session ends
  let uuid = create_UUID();
  document.cookie = `token=${uuid}`;

  var reader = new FileReader();
  reader.readAsDataURL(avatar);

  reader.onload = async function () {
    const avatarImage = reader.result;

    // save to database
    const data = {
      email,
      name,
      age,
      avatar: avatarImage,
      uuid,
      password,
      backgroundImage: "",
      friends: {},
    };
    // check if there's an empty field
    for (const key of Object.entries(data)) {
      if (key[1] == "") {
        window.alert(`${key} field is empty`);
        return;
      }
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch("/registerNewUser", options);
    const json = await response.json();
    if (json.bool == true) {
      window.location.href = "http://localhost:5000";
    } else {
      window.alert("Email already registered");
    }
  };
}

const loginButton = document.querySelector(".login#button");
loginButton.onclick = () => login();

async function login() {
  // Get the fields data
  const email = document.querySelector(".login#input-email").value;
  const password = document.querySelector(".login#input-password").value;

  // Send the data to the server, there it will be verified if the data correspond to another already registered
  const data = { email, password };

  // Check if there's an empty field
  for (const key of Object.entries(data)) {
    if (key[1] == "") {
      window.alert(`${key} field is empty`);
      return;
    }
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await fetch("/verifyLogin", options);
  const json = await response.json();
  console.log(json.string);
  // The password from input and database are the same
  if (json.string == "true") {
    // set the new cookie
    document.cookie = `token=${json.uuid}`;
    window.location.href = "http://localhost:5000";
  } else if (json.string == "email") {
    // there's no email witch matches with the input
    window.alert("This email is not registered");
  } else if (json.string == "password") {
    // incorrect password
    window.alert("Incorrect Password");
  }
}

// Just to easily clear the mongo database
async function clearDatabase() {
  var data = { name: "ratinho" };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await fetch("/clearDatabase", options);
  const json = await response.json();
}

// Clear posts
async function clearPosts() {
  var data = { name: "ratinho" };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await fetch("/clearPosts", options);
  const json = await response.json();
}
