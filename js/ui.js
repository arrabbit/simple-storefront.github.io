/** 
 * Summary: Small helpers that every view uses.
 * 
 * File: ui.js
 * Author: Anna Running Rabbit
*/

const TOAST_DELAY = 3000; // 3 seconds
let toastTimer;

/** Updates the item count in the cart header button. */
function updateCartCount(count) {
    document.querySelector("#cart-count").textContent = `(${count})`;
}

/** Shows a message in the toast element for 3 seconds before disapearing. */
function showToast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimer) // timer reset to prevent another toast from getting hidden too early

    toastTimer = setTimeout(() => {
        toast.classList.add("hidden"); // what happens after the delay timer runs out
    }, TOAST_DELAY);                   // the delay timer value
}

export { updateCartCount, showToast };