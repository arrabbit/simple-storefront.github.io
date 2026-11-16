/** 
 * Summary: 
 * 
 * File: about.js
 * Author: Anna Running Rabbit
*/

function initAbout() {
    const aboutPopup = document.querySelector("#about-popup");
    const aboutLink = document.querySelector("a[data-view='about']");
    const closeAboutX = document.querySelector("#close-about-x");
    const keepShoppingBtn = document.querySelector("#keep-shopping-btn");

    // Open the about popup when the 'About' header link is clicked.
    aboutLink.addEventListener("click", (e) => {
        e.preventDefault(); //stops the browser from jumping back to the top of the page
        aboutPopup.showModal(); //greys out the rest of the page and prevents user from interacting with it
    });

    // Close the about popup when the 'X' button is clicked.
    closeAboutX.addEventListener("click", () => {
        aboutPopup.close();
    });

    // Close the about popup when the 'Keep shopping' button is clicked.
    keepShoppingBtn.addEventListener("click", () => {
        aboutPopup.close();
    });
}

export { initAbout };