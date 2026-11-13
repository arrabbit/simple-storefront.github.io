/** 
 * Summary: Formatting helper functions used by the cards, product view, and cart view.
 * 
 * File: helpers.js
 * Author: Anna Running Rabbit
 * 
 * Star symbols "★" and "☆" were copied from https://symbolonly.com/star-symbols.html
 * formatDate() uses concepts from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
*/

/** Creates the string of stars for a given product rating. */
function createStars(rating) {
    const starRating = Math.round(rating); // takes the given rating value and rounds to the nearest whole number

    // builds the 5 star string with the correct rating representation
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += (i <= starRating) ? "★" : "☆";
    }
    return stars;
}

/** Formats the date given as an ISO string for review timestamps. */
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

export { createStars, formatDate, formatPrice };