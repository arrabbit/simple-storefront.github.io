/** 
 * Summary: Functions for the shopping cart view rendering logic.
 * File: cartView.js
 * Author: Anna Running Rabbit
*/

import { cart } from "./cart.js";
import { el } from "./dom.js";
import { formatPrice, showToast } from "./helpers.js";
import { showView } from "./router.js";

const FREE_SHIPPING_MIN = 500; // min. spending req. for free shipping $500
const TAX_RATE = 0.05;         // CA 5% tax

// shipping cost by type, then destination
const SHIPPING_RATES = {
    standard: { canada: 10, us: 15, international: 20},
    express: { canada: 25, us: 25, international: 30},
    priority: { canada: 35, us: 50, international: 50},
};

/** Rebuilds the cart rows (or the empty cart message) and updates the summary */
function renderCart() {
    const itemsContainer = document.querySelector("#cart-items-container");
    itemsContainer.innerHTML = ""; // removes all previous cart rows

    const items = cart.getItems();
    if (items.length === 0) {
        // Build the empty cart message if the cart has no items
        const emptyCartDiv = el("div", "p-8");
        
        emptyCartDiv.appendChild(el("h3", "mb-4 font-serif text-2xl font-bold",
                                    "There is nothing in your cart."));
        itemsContainer.appendChild(emptyCartDiv);
        setShippingCheckout(true); // disable checkout btn and shipping dropdowns
    } else {
        items.forEach((item) => itemsContainer.appendChild(createCartRow(item)));
        setShippingCheckout(false); // enable checkout btn and shipping dropdowns
    }
    
    updateSummary();
}

/** Builds one cart row to include a thumbnail, title, price, quantity, and
 *  subtotal with the ability to remove the item. */
function createCartRow(item) {
    // remove button
    const removeBtn = el("button","text-xs hover:text-[#8D77AB]",
                         "Remove");
    removeBtn.type = "button";
    removeBtn.dataset.action = "remove-item";
    removeBtn.dataset.id = item.id;

    // product thumbnail
    const img = el("img", "h-20 w-20 rounded bg-[#E1EACD] object-contain");
    img.src = item.thumbnail;
    img.alt = item.title;

    // title with the price for that item
    const info = el("div", "flex-1");
    info.appendChild(el("p", "text-lg font-semibold opacity-90", item.title));
    info.appendChild(el("p", "text-sm opacity-70", `${formatPrice(item.price)} each`));

    // subtotal with the remove button underneath
    const subtotal = el("div", "flex w-24 flex-col items-end gap-1");
    subtotal.appendChild(el("p", "font-semibold opacity-90",
                             formatPrice(item.price * item.quantity)));
    subtotal.appendChild(removeBtn);

    // one row holding every part
    const row = el("div",
                   "flex items-center gap-4 border-b border-[#BAD8B6] py-4");
    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(el("p", "w-12 text-center", item.quantity));
    row.appendChild(subtotal);
    return row;
}

/** Disables the shipping dropdowns and checkout button when the cart is empty.
 *  Enables them when it isn't.
 *  Disable button attribute concept:
 *      https://www.dofactory.com/html/button/disabled
 *      https://www.yellowduck.be/posts/the-tailwind-enabled-selector-trick-for-disabled-buttons
 */
function setShippingCheckout(isEmpty) {
    document.querySelector("#shipping-type").disabled = isEmpty;
    document.querySelector("#shipping-dest").disabled = isEmpty;
    document.querySelector("#checkout-btn").disabled = isEmpty;
}

/** Returns the shipping cost ($0 if the cart is empty, or if the cart is
 *  over $500).
 */
function getShippingCost(merch) {
    if (merch === 0 || merch > FREE_SHIPPING_MIN) return 0;

    const type = document.querySelector("#shipping-type").value;
    const destination = document.querySelector("#shipping-dest").value;
    return SHIPPING_RATES[type][destination];
}

/** Returns the tax (5% of cost for Canada, otherwise no tax). */
function getTax(merch) {
    const destination = document.querySelector("#shipping-dest").value;
    return destination === "canada" ? merch * TAX_RATE : 0;
}

/** Calculates merchandise, shipping, tax, and total, then formats the prices. */
function updateSummary() {
    const merch = cart.getMerchandiseTotal();
    const shipping = getShippingCost(merch);
    const tax = getTax(merch);
    const total = merch + shipping + tax;

    document.querySelector("#summary-merch").textContent = formatPrice(merch);
    document.querySelector("#summary-ship").textContent = formatPrice(shipping);
    document.querySelector("#summary-tax").textContent = formatPrice(tax);
    document.querySelector("#summary-total").textContent = formatPrice(total);
}

/** Shows a thank you message, empties the cart, and returns to the home view. */
function handleCheckout() {
    showToast("Thank you for your order!");
    cart.clear();
    showView("home");
}

const cartActions = {
    "remove-item": (element) => {
        cart.remove(Number(element.dataset.id));
        renderCart(); //re-displays the cart with the item removed
    },
    "checkout": handleCheckout,
};

/** Registers the cart view's listeners so the cart re-renders when the view is
 *  shown, and updates the summary when the shipping dropdowns are changed.*/
function initCartView() {
    document.addEventListener("viewchange", (event) => {
        if (event.detail.name === "cart") renderCart();
    });

    document.querySelector("#shipping-type").addEventListener("change", updateSummary);
    document.querySelector("#shipping-dest").addEventListener("change", updateSummary);
}

export { initCartView, cartActions };