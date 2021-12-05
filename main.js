function createElemWithText(elemType = "p", textContent = "", className){
    const myElem = document.createElement(elemType);
    myElem.textContent = textContent;
    if(className) myElem.classList.add(className);
    return myElem;
}