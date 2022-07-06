/* initial required data: name, user avatar, post date, user id from who posted it  */

export function createPost(appender, data /* name, text, avatar, date */) {
    /* Posts html */
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('post-main-div');
    appender.appendChild(mainDiv)

    const header = document.createElement('div'); // user name, avatar, post age
    header.classList.add('post-header');
    mainDiv.appendChild(header)

    const contentDiv = document.createElement('div'); // contain the post text
    contentDiv.classList.add('post-content-div');
    mainDiv.appendChild(contentDiv)

    const bottom = document.createElement('div'); // for the buttons
    bottom.classList.add('post-bottom');
    mainDiv.appendChild(bottom)

    const avatarImg = document.createElement('img'); // for the buttons
    avatarImg.classList.add('post-avatarImage');
    header.appendChild(avatarImg)

    const namePost = document.createElement('h1'); // for the buttons
    namePost.classList.add('post-name');
    header.appendChild(namePost)

    // Inserting the data
    avatarImg.src = data.avatar;
    contentDiv.innerText = data.text;
    namePost.innerText = data.name;
}

// Create the people for display in the search
export function createPeople(appender, data ){
       const mainDiv = document.createElement('div');
       mainDiv.classList.add('post-main-div');
       mainDiv.setAttribute("id", data._id)
       appender.appendChild(mainDiv)
   
       const header = document.createElement('div'); // user name, avatar, post age
       header.classList.add('people','post-header');
       mainDiv.appendChild(header)
   
       const contentDiv = document.createElement('div'); // contain the post text
       contentDiv.classList.add('people', 'post-content-div');
       mainDiv.appendChild(contentDiv)
   
       const bottom = document.createElement('div'); // for the buttons
       bottom.classList.add('people','post-bottom');
       mainDiv.appendChild(bottom)
   
       const avatarImg = document.createElement('img'); // for the buttons
       avatarImg.classList.add('people','post-avatarImage');
       header.appendChild(avatarImg)
   
       const namePost = document.createElement('a'); // for the buttons
       namePost.classList.add('people','post-name');
       header.appendChild(namePost)
   
       // Inserting the data
       avatarImg.src = data.avatar;
       namePost.innerText = data.name; 
       namePost.href = `/user/${data.name}?id=${data._id}`;
}
