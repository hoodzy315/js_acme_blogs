/*Joe Woods
12/6/2021
*/

/*This function creates an element
three parameters, type of element, content and classname
returns element
*/
function createElemWithText(elemType = "p", textContent = "", className){
    const myElem = document.createElement(elemType);
    myElem.textContent = textContent;
    if(className) myElem.classList.add(className);
    return myElem;
}

/*This function takes in json data and creates the select menu
returns array of id and name
*/
function createSelectOptions(jsonData){
    if(!jsonData) return undefined;
    let optionArray = [];
    for(let x in jsonData){
        let theOption = document.createElement("OPTION");
        theOption.value = jsonData[x].id;
        theOption.textContent = jsonData[x].name;
        optionArray.push(theOption);
    }
    return optionArray;
}

/*This function hides or shows the comment section
parameter of post id
returns the post to hide, null if post is not found, undefined if postId is not correctly sent in
*/
function toggleCommentSection(postId){
    if(!postId) return undefined;
    const postToHide = document.querySelector(`section[data-post-id='${postId}']`);
    if(postToHide)
    {
        postToHide.classList.toggle("hide");
        return postToHide;
    }
    return null;
}

/*This function toggles the show comment button
parameter of post Id
returns the button, or null if the button does not exist, undefined if postId does not exist
*/
function toggleCommentButton(postId){
    if(!postId) return undefined;
    const comBut = document.querySelector(`button[data-post-id='${postId}']`);
    if(!comBut) return null;
    comBut.textContent = (comBut.textContent == 'Show Comments') ? "Hide Comments" : "Show Comments"; 
    return comBut;
}

/*This function deletes all children of an element
returns the parent back, undefined if the parent is not an element
*/
function deleteChildElements(parentElement){
    if(!parentElement?.tagName) return undefined;
    let child = parentElement.lastElementChild;
    while(child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

/*This function adds a listener to all buttons in main
returns buttons object
*/
function addButtonListeners(){
    const getMain = document.querySelector('main');
    const buttons = getMain.querySelectorAll('button');
    if(buttons){
        for(var i = 0; i < buttons.length;i++){
            const postId = buttons[i].dataset.postId;
            buttons[i].addEventListener("click", function(e) { toggleComments(e, postId)});
        }
        
    }
    return buttons;
}


/*This function removes listener from all buttons in main
returns buttons object
*/
function removeButtonListeners(){
    const getMain = document.querySelector('main');
    const buttons = getMain.querySelectorAll('button');
    if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
            const postId = buttons[i].dataset.postId;
            buttons[i].removeEventListener("click", function (e) { toggleComments(e, postId)});
        }
        
    }
    return buttons;
}

/*This function creates a fragment, article, h3, and two paragraphs
appends h3 and paragraphs to article
requires the jsonData for posts
returns a fragment with article appended
*/
function createComments(jsonData){
    if(!jsonData) return undefined;
    const fragment = document.createDocumentFragment();
    for(let x in jsonData){
        let article = document.createElement("ARTICLE");
        const comName = createElemWithText('h3', jsonData[x].name);
        const body = createElemWithText('p', jsonData[x].body);
        const from = createElemWithText('p', `From: ${jsonData[x].email}`);
        article.append(comName);
        article.append(body);
        article.append(from);
        fragment.append(article);
    }

    return fragment;
}

/*This function fills out the select menu
requires jsonData sent in
returns selectMenu
*/
function populateSelectMenu(jsonData){
    if(!jsonData) return undefined;
    const selectMenu = document.getElementById('selectMenu');
    const users = createSelectOptions(jsonData);
    for(var i = 0; i < users.length; i++){
        selectMenu.appendChild(users[i]);
    }
    return selectMenu;
}

/*This function pulls user data from website listing users
returns error if data is not good, or json data of users
*/
const getUsers = async () => {
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if(!res.ok) throw new Error("Wrong data bud!");

        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

/*This function fetches post data with supplied user ID parameter
returns error if data is no good, or json data
*/
const getUserPosts = async (userId) => {
    if(!userId) return undefined;
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if(!res.ok) throw new Error("Wrong data bud!");
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

/*This function finds a user with userID parameter
returns user information or error if data is not good
*/
const getUser = async (userId) => {
    if(!userId) return undefined;
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if(!res.ok) throw new Error("Wrong data bud!");
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}


/*This function finds post comments with postID parameter
returns jsondata of posts or error if data is not good
*/
const getPostComments = async (postId) => {
    if(!postId) return undefined;
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if(!res.ok) throw new Error("Wrong data bud!");
        return await res.json();
    } catch(err) {
        console.error(err);
    }
}

/*This function posts comments based on postId
appends commends to a fragment and section
*/
const displayComments = async (postId) => {
    if(!postId) return undefined;
    const section = document.createElement("SECTION");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}

/*This function creates posts based on jsonData parameter
creates an article, an h2, four paragraphs and a fragment and appends them all to the fragment
returns fragment
*/
const createPosts = async (jsonData) => {
    if(!jsonData) return undefined;
    const fragment = document.createDocumentFragment();
    for (let x in jsonData) {
        const article = document.createElement("ARTICLE");
        const aychtwo = createElemWithText('h2', jsonData[x].title);
        const body = createElemWithText('p', jsonData[x].body);
        const postId = createElemWithText('p', `Post ID: ${jsonData[x].id}`);
        const author = await getUser(jsonData[x].userId);
        const daAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const catchPhrase = createElemWithText('p', author.company.catchPhrase);
        const newButton = createElemWithText('button', "Show Comments");
        newButton.dataset.postId = jsonData[x].id;
        article.append(aychtwo);
        article.append(body);
        article.append(postId);
        article.append(daAuthor);
        article.append(catchPhrase);
        article.append(newButton);
        const section = await displayComments(jsonData[x].id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
}

/*This function displays posts by adding element to main section
uses createPosts
*/
const displayPosts = async (posts) => {
    const getMain = document.querySelector('main');
    const element = (posts?.length) ? await createPosts(posts) : createElemWithText('p', "Select an Employee to display their posts.", 'default-text');
    getMain.append(element);
    return element;
}

/*This function dtoggles comments on and off
uses toggleCommentSection and toggleCommentButton
returns array of comment section and comment button
*/
function toggleComments(event, postId){
    if(!event && !postId) return undefined;
    event.target.listener = true;
    const tc = [];
    tc.push(toggleCommentSection(postId));
    tc.push(toggleCommentButton(postId));
    return tc;
}

/*This function refreshes posts
uses removeButtonListeners, deleteChildElements, displayPosts and addButtonListeners
returns an array with the result of all four functions
*/
const refreshPosts = async (posts) => {
    if(!posts?.length) return undefined;
    let rp = [];
    rp.push(removeButtonListeners());
    rp.push(deleteChildElements(document.querySelector('main')));
    rp.push(await displayPosts(posts));
    rp.push(addButtonListeners());
    return rp;
}

/*This function updates the menu when there is a change in it
uses getUserPosts and refreshPosts
returns an array with the userId, posts and data from refreshPosts
*/
const selectMenuChangeEventHandler = async (event) => {
    const mceh = [];
    mceh.push(event?.target?.value || 1);
    mceh.push(await getUserPosts(mceh[0]));
    mceh.push(await refreshPosts(mceh[1]));
    return mceh;
}

const initPage = async () => {
    const thePage = [];
    thePage.push(await getUsers());
    thePage.push(populateSelectMenu(thePage[0]));
    return thePage;
}

function initApp(){
    initPage();
    const menu = document.getElementById('selectMenu');
    menu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);