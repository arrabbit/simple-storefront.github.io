/** 
 * Summary: Formatting helper functions used by the cards, product view, and cart view.
 * 
 * File: helpers.js
 * Author: Anna Running Rabbit
 * 
 * Star symbols "★" and "☆" were copied from https://symbolonly.com/star-symbols.html
 * formatDate() uses concepts from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
*/

/** Highlights the header navigation label based on the current active view */
function updateNavHighlight(activeViewName) {
    const navLinks = document.querySelectorAll("#nav-menu a[data-action='show-view']");

    for (let link of navLinks) {
        const li = link.parentNode;

        // Adds green highlight box to the active view and removes it from all the non-active views 
        if (link.dataset.view === activeViewName) {
            li.classList.add("bg-[#E1EACD]", "rounded", "px-2", "py-1");
        } else {
            li.classList.remove("bg-[#E1EACD]", "rounded", "px-2", "py-1");
        }
    }
}

/** Creates the string of stars for a given product rating (product view).*/
function createStars(rating) {
    const starRating = Math.round(rating); // takes the given rating value and rounds to the nearest whole number

    // builds the 5 star string with the correct rating representation
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += (i <= starRating) ? "★" : "☆";
    }
    return stars;
}

/** Formats the date given as an ISO string for review timestamps (product view). */
function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

/** Formats the given number as a dollar value. */
function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

const TOAST_DELAY = 3000; // 3 seconds
let toastTimer;

/** Updates the item count in the cart header button. */
function updateCartCount(count) {
    document.querySelector("#cart-count").textContent = `(${count})`;
}

/** Shows a message in the toast element for 3 seconds before disappearing. */
function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimer); // timer reset to prevent another toast from getting hidden too early

    toastTimer = setTimeout(() => {
        toast.classList.add("hidden"); // what happens after the delay timer runs out
    }, TOAST_DELAY);                   // the delay timer value
}

export { updateNavHighlight, createStars, formatDate, formatPrice, updateCartCount, showToast };