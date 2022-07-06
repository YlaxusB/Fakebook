// Save a post into database
export async function savePosts(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const request = await fetch("/savePost", options);
  const json = await request.json();
  return json;
}

// Create a post
export function createPost(appender, data) {
  /* initial required data: name, user avatar, post date, user id from who posted it  */

  /* Posts html */
  const mainDiv = document.createElement("div");
  mainDiv.setAttribute("id", data._id);
  mainDiv.classList.add("post-main-div", data._id);
  appender.appendChild(mainDiv);

  const header = document.createElement("div"); // user name, avatar, post age
  header.classList.add("post-header");
  mainDiv.appendChild(header);

  const contentDiv = document.createElement("div"); // contain the post text
  contentDiv.classList.add("post-content-div");
  mainDiv.appendChild(contentDiv);

  const bottom = document.createElement("div"); // for the buttons
  bottom.classList.add("post-bottom");
  mainDiv.appendChild(bottom);

  const likeP = document.createElement("p");
  likeP.classList.add("post-bottom-buttons", "post-like-p");
  bottom.appendChild(likeP);
  likeP.innerText = data.likes;

  const likeDiv = document.createElement("div");
  likeDiv.classList.add("post-bottom-buttons", "post-like-div");
  bottom.appendChild(likeDiv);

  const likeImage = document.createElement("img");
  likeImage.classList.add("post-like-image");
  likeImage.src = "./images/thumbsUp.png";
  likeDiv.appendChild(likeImage);

  likeDiv.addEventListener("click", (e) => {
    likeFunction(data._id, likeP, likeP.innerText);
  });

  const editDiv = document.createElement("div");
  editDiv.classList.add("post-bottom-buttons", "post-edit-div");
  bottom.appendChild(editDiv);

  editDiv.addEventListener("click", (e) => {
    editFunction(
      data.name,
      data._id,
      e,
      contentDiv.innerText,
      likeDiv,
      likeP,
      editDiv,
      removeDiv
    );
  });

  const editImage = document.createElement("img");
  editImage.classList.add("post-edit-image");
  editImage.src = "./images/editIcon.png";
  editDiv.appendChild(editImage);

  const removeDiv = document.createElement("div");
  removeDiv.classList.add("post-bottom-buttons", "post-remove-div");
  bottom.appendChild(removeDiv);
  removeDiv.addEventListener("click", (e) => {
    removeFunction(data._id, mainDiv);
  });

  const removeImage = document.createElement("img");
  removeImage.classList.add("post-remove-image");
  removeImage.src = "./images/removeIcon.png";
  removeDiv.appendChild(removeImage);

  const avatarImg = document.createElement("img"); // for the buttons
  avatarImg.classList.add("post-avatarImage");
  header.appendChild(avatarImg);

  const namePost = document.createElement("a"); // for the buttons
  namePost.classList.add("post-name");
  console.log(new Date(data.date).getTimezoneOffset());
  namePost.href = `/user/${data.name}?id=${data.userID}`;
  header.appendChild(namePost);

  const date = document.createElement("p");
  date.classList.add("post-date");
  header.appendChild(date);

  // Inserting the data
  avatarImg.src = data.avatar;
  contentDiv.innerText = data.text;
  namePost.innerText = data.name;
  date.innerText = `${new Date(data.date).toLocaleDateString()} ${new Date(
    data.date
  )
    .getHours()
    .toLocaleString()}H`;
}

// Edit the post
export async function editFunction(
  name,
  postID,
  e,
  content,
  likeDiv,
  likeP,
  editDiv,
  removeDiv
) {
  // Check if clicked on image or div and then get the correct post div
  console.log(e.path);
  let postDiv;
  if (e.target.nodeName == "IMG") {
    postDiv = e.path[4];
  } else if (e.target.nodeName == "DIV") {
    postDiv = e.path[3];
  }

  const editTextArea = document.createElement("textarea");
  editTextArea.classList.add("post-edit-textarea");

  // Replace the new textarea with the old content
  const oldContent = content;
  editTextArea.value = oldContent;
  postDiv.querySelector(".post-content-div").replaceWith(editTextArea);

  [likeDiv, likeP, editDiv, removeDiv].forEach((element) => {
    element.style.visibility = "hidden";
  });

  const doneDiv = document.createElement("div");
  doneDiv.classList.add("post-bottom-buttons", "post-edit-done-div");
  postDiv.querySelector(".post-bottom").appendChild(doneDiv);

  const doneImage = document.createElement("img");
  doneImage.classList.add("post-bottom-buttons", "post-edit-done-image");
  doneDiv.appendChild(doneImage);
  doneImage.src = "./images/doneIcon.png";

  doneDiv.addEventListener("click", (e) => {
    saveChanges(postID, editTextArea.value);
    doneDiv.remove();
    [likeDiv, likeP, editDiv, removeDiv].forEach((element) => {
      element.style.visibility = "visible";
    });
    const contentDiv = document.createElement("div"); // contain the post text
    contentDiv.classList.add("post-content-div");
    contentDiv.innerText = editTextArea.value;
    editTextArea.replaceWith(contentDiv);
  });
}

// Save the changes in database after clicking in done button
export async function saveChanges(postID, newContent) {
  const request = await fetch("/editPost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postID, newContent }),
  });
  const response = await request.json();

  element.innerHTML = parseInt(element.innerHTML) + 1;
}

// Like function
export async function likeFunction(postID, element, postP) {
  const request = await fetch("/addLike", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postID, likes:postP}),
  });
  const response = await request.json();
  if(response.status === 200){
    element.innerHTML = parseInt(element.innerHTML) + 1;
  }
}

// Remove post function
export async function removeFunction(postID, postDiv) {
  console.log(postID)
  const request = await fetch("/removePost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postID }),
  });
  const response = await request.json();
  if(response.status === 200){
    postDiv.remove();
  }
}

// Create the people for display in the search
export function createPeople(appender, data) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("post-main-div");
  mainDiv.setAttribute("id", data._id);
  appender.appendChild(mainDiv);

  const header = document.createElement("div"); // user name, avatar, post age
  header.classList.add("people", "post-header");
  mainDiv.appendChild(header);

  const contentDiv = document.createElement("div"); // contain the post text
  contentDiv.classList.add("people", "post-content-div");
  mainDiv.appendChild(contentDiv);

  const bottom = document.createElement("div"); // for the buttons
  bottom.classList.add("people", "post-bottom");
  mainDiv.appendChild(bottom);

  const avatarImg = document.createElement("img"); // for the buttons
  avatarImg.classList.add("people", "post-avatarImage");
  header.appendChild(avatarImg);

  const namePost = document.createElement("a"); // for the buttons

  namePost.classList.add("people", "post-name");
  header.appendChild(namePost);

  // Inserting the data
  avatarImg.src = data.avatar;
  namePost.innerText = data.name;
  namePost.href = `/user/${data.name}?id=${data._id}`;
}

export async function getLoginParameters(cookie) {
  let token = decodeURIComponent(cookie.split("token="));
  token = token.split(",");
  token = token[1];

  // Request to server
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  };

  const request = await fetch("/loginGetParameters", options);
  const json = await request.json();
  console.log(json);
  return {
    name: json.user.name,
    avatar: json.user.avatar,
    userID: json.user._id,
  };
}

// The function executed when search button is clicked
export async function search() {
  console.log("GG");
  const searchInput = document.querySelector(".search-input");
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ val: searchInput.value }),
  };
  const request = await fetch("/redirectToSearch", options);
  window.location.href = request.url;
}

// OUR uuid generator
export function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
