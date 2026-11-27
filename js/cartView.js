/** 
 * Summary: Functions for the shopping cart view rending logic.
 * File: cartView.js
 * Author: Anna Running Rabbit
*/

import { cart } from "./cart.js";

function renderCartView() {
    const itemsContainer = document.querySelector("#cart-items-container");
    const items = cart.getItems

    // Reset item container
    itemsContainer.replaceChildren();

    // Cart summary elements
    const merchElem = document.querySelector("#summary-merchandise");
    const shippingElem = document.querySelector("#summary-shipping");
    const taxtElem = document.querySelector("#summary-tax");
    const totalElem = document.querySelector("#summary-total");

    if (items.length === 0) {
        // Build the empty cart message if the cart has no items
        const emptyCartDiv = document.createElement('div');
        emptyCartDiv.className = "rounded bg-[#E1EACD] p-8"; // green box

        const emptyCartH3 = document.createElement('h3');
        emptyCartH3.className = "mb-4 font-serif text-2xl font-bold";
        emptyCartH3.textContent = "There's nothing in your cart.";

        
    }
}