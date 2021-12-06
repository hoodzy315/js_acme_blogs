function createElemWithText(elemType = "p", textContent = "", className){
    const myElem = document.createElement(elemType);
    myElem.textContent = textContent;
    if(className) myElem.classList.add(className);
    return myElem;
}

function createSelectOptions(jsonData){
    if(!jsonData) return undefined;
    let optionArray = [];
    for(let x in jsonData){
        let theOption = document.createElement("OPTION");
        theOption.value = jsonData[x].id;
        theOption.textContent = jsonData[x].name;
        console.log(theOption.textContent);
        optionArray.push(theOption);
    }
    return optionArray;
}

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

function toggleCommentButton(postId){
    if(!postId) return undefined;
    const comBut = document.querySelector(`button[data-post-id='${postId}']`);
    if(!comBut) return null;
    comBut.textContent = (comBut.textContent == 'Show Comments') ? "Hide Comments" : "Show Comments"; 
    return comBut;
}

function deleteChildElements(parentElement){
    if(!parentElement?.tagName) return undefined;
    let child = parentElement.lastElementChild;
    while(child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

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

function populateSelectMenu(jsonData){
    if(!jsonData) return undefined;
    const selectMenu = document.getElementById('selectMenu');
    const users = createSelectOptions(jsonData);
    for(var i = 0; i < users.length; i++){
        selectMenu.append(users[i].textConent);
    }
    return selectMenu;
}

const getUsers = async () => {
    try{
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if(!res.ok) throw new Error("Wrong data bud!");

        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

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

const displayPosts = async (posts) => {
    const getMain = document.querySelector('main');
    const element = (posts?.length) ? await createPosts(posts) : createElemWithText('p', "Select an Employee to display their posts.", 'default-text');
    getMain.append(element);
    return element;
}

function toggleComments(event, postId){
    if(!event && !postId) return undefined;
    const com = document.querySelector(`button[data-post-id='${postId}']`);
    com.textContent = (com.textContent == 'Show Comments') ? event.target.listener = false : event.target.listener = true;
    const tc = [];
    tc.push(toggleCommentSection(postId));
    tc.push(toggleCommentButton(postId));
    return tc;
}

const refreshPosts = async (posts) => {
    if(!posts?.length) return undefined;
    let rp = [];
    rp.push(removeButtonListeners());
    rp.push(deleteChildElements(document.querySelector('main')));
    rp.push(await displayPosts(posts));
    rp.push(addButtonListeners());
    return rp;
}

const selectMenuChangeEventHandler = async (event) => {
    const userId = event?.target?.value || 1;
    const mceh = [];
    mceh.push(userId);
    const posts = await getUserPosts(userId);
    mceh.push(posts);
    mceh.push(await refreshPosts(posts));
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
    menu.addEventListener('change', function(e) { selectMenuChangeEventHandler(e)});
}

document.addEventListener('DOMContentLoaded', function() {initApp()});