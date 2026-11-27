/*
 * Summary: Renders the single product view, add to cart, and tabs.
 * 
 * File: product.js
 * Author: Anna Running Rabbit
 */

import { getProductById } from "./data.js";
import { el } from "./dom.js";
import { addToCart } from "./cart.js";
import { createStars, formatPrice, formatDate } from "./helpers.js";
import { formatCategory } from "./category.js";

// the two tabs shown under the product details
const TABS = [
    { name: "specs", label: "Specifications" },
    { name: "reviews", label: "Reviews" },
];

let currentProd = null; // the product currently shown, used by the add to cart handler

/** Renders the full product section. */
function renderProduct(product) {
    const container = document.getElementById("view-product");
    container.replaceChildren(); // clears the container

    // formats the image on the left with the details on the right
    const mainGrid = el("div", "grid grid-cols-1 md:grid-cols-2 gap-12 mb-12");
    mainGrid.append(buildImage(product), buildDetails(product));

    // cream box around the product details and tabs
    const productBox = el("div", "bg-[#F9F6E6] p-8 rounded text-[#283D32]");
    productBox.append(mainGrid, buildTabs(product));

    container.append(buildBreadcrumb(product), productBox);

    showTab("specs"); // start with the Specifications tab open by default
}

/** Builds the breadcrumb. */
function buildBreadcrumb(product) {
    const text = `Home > ${formatCategory(product.category)} > ${product.title}`;
    return el("p", "text-sm mb-4 text-[#283D32]", text);
}

/** Builds the main product image. */
function buildImage(product) {
    const img = el("img", "w-full rounded-lg border border-[#BAD8B6] object-contain");
    img.src = product.images[0];
    img.alt = product.title;
    return img;
}

/** Builds the product details column. */
function buildDetails(product) {
    const details = el("div", "flex flex-col gap-4");

    details.append(
        el("h1", "text-3xl font-bold font-serif", product.title),
        el("p", "text-2xl font-semibold", formatPrice(product.price)),
        buildSkuRating(product),
        buildTags(product.tags),
        el("p", "font-medium", product.availabilityStatus),
        el("p", "", product.description),
        buildPurchaseBox()
    );
    return details;
}

/** Builds the SKU line with the product's star rating. */
function buildSkuRating(product) {
    const line = el("p", "text-sm", `SKU: ${product.sku} `);
    line.appendChild(el("span", "text-[#8D77AB]", createStars(product.rating)));
    return line;
}

/** Builds the product tags. */
function buildTags(tags) {
    const list = el("ul", "flex flex-wrap gap-2");

    tags.forEach((tag) => {
        list.appendChild(el("li", "rounded-full border border-[#283D32] px-3 py-1 text-sm", tag));
    });
    return list;
}

/** Builds the quantity box and the Add to Cart button. */
function buildPurchaseBox() {
    const box = el("div", "flex items-end gap-8 p-4");

    const label = el("label", "flex flex-col text-sm font-medium", "Quantity");
    const input = el("input", "mt-1 w-20 rounded border border-[#283D32] px-2 py-1");
    input.type = "number";
    input.id = "product-qty";
    input.min = "1";
    input.value = "1";
    label.appendChild(input);

    const button = el("button", "rounded bg-[#283D32] px-4 py-2 text-[#F9F6E6] hover:bg-[#8D77AB]", "+ Add to Cart");
    button.type = "button";
    button.dataset.action = "add-product-to-cart";

    box.append(label, button);
    return box;
}

/** Builds the tab buttons and both tab panels. */
function buildTabs(product) {
    const wrapper = el("div", "mb-12");
    const buttons = el("div", "flex");

    TABS.forEach((tab) => buttons.appendChild(createTabBtn(tab)));

    wrapper.append(buttons, buildSpecs(product), buildReviews(product));
    return wrapper;
}

/** Creates a single tab button. */
function createTabBtn(tab) {
    const button = el("button", "mb-1 rounded border border-[#BAD8B6] px-6 py-2", tab.label);
    button.type = "button";
    button.dataset.action = "show-tab";
    button.dataset.tab = tab.name;
    return button;
}

/** Creates a hidden empty tab panel with the id "tab-<tab name>". */
function createPanel(name) {
    const panel = el("div", "tab-panel hidden rounded border border-[#BAD8B6] bg-white p-6");
    panel.id = `tab-${name}`;
    return panel;
}

/** Shows one tab panel while hiding the other ones, and colours the selected tab button green. */
function showTab(name) {
    document.querySelectorAll(".tab-panel").forEach((panel) => {
        if (panel.id === `tab-${name}`) {
            panel.classList.remove("hidden");
        } else {
            panel.classList.add("hidden");
        }
    });

    document.querySelectorAll("[data-action='show-tab']").forEach((button) => {
        if (button.dataset.tab === name) {
            button.classList.remove("bg-white", "hover:bg-[#8D77AB]", "hover:text-white");
            button.classList.add("bg-[#283D32]", "text-[#F9F6E6]");
        } else {
            button.classList.remove("bg-[#283D32]", "text-[#F9F6E6]");
            button.classList.add("bg-white", "hover:bg-[#8D77AB]", "hover:text-white");
        }
    });
}

/** Builds the Specifications panel. */
function buildSpecs(product) {
    const panel = createPanel("specs");
    const size = product.dimensions;

    const specs = [
        { label: "Weight", value: `${product.weight} kg` },
        { label: "Dimensions", value: `${size.width} x ${size.height} x ${size.depth} cm` },
        { label: "Warranty", value: product.warrantyInformation },
        { label: "Shipping", value: product.shippingInformation },
        { label: "Returns", value: product.returnPolicy },
    ];

    const list = el("dl", "grid grid-cols-2 gap-y-2");
    specs.forEach((spec) => {
        list.append(el("dt", "font-semibold", spec.label), el("dd", "", spec.value));
    });

    panel.appendChild(list);
    return panel;
}

/** Builds the Reviews panel as a scrollable list. */
function buildReviews(product) {
    const panel = createPanel("reviews");

    const list = el("ul", "max-h-72 space-y-4 overflow-y-auto pr-2"); // scrolls once the list is taller than max-h-72
    product.reviews.forEach((review) => list.appendChild(createReview(review)));

    panel.appendChild(list);
    return panel;
}

/** Creates one review: stars, comment, reviewer name, and date. */
function createReview(review) {
    const item = el("li", "border-b border-[#BAD8B6] pb-3");

    item.append(
        el("p", "text-[#8D77AB]", createStars(review.rating)),
        el("p", "", review.comment),
        el("p", "text-sm opacity-70", `${review.reviewerName} - ${formatDate(review.date)}`)
    );
    return item;
}

/** Adds the current product to the cart using the quantity box (minimum 1). */
function handleAddWithQuantity() {
    const input = document.getElementById("product-qty");
    const quantity = Math.max(1, Number(input.value) || 1); // blank, 0, or negative becomes 1

    addToCart(currentProd, quantity); // addToCart also shows the toast
}

// data-action name -> handler, merged into the actions map in main.js
const productActions = {
    "add-product-to-cart": handleAddWithQuantity,
    "show-tab": (element) => showTab(element.dataset.tab),
};

/** Renders the product view whenever it is shown. */
function onViewChange(event) {
    if (event.detail.name !== "product") return;

    currentProd = getProductById(event.detail.params.id);
    if (currentProd) renderProduct(currentProd); // skips rendering if the id doesn't match a product
}

/** Registers the product view's viewchange listener. */
function initProduct() {
    document.addEventListener("viewchange", onViewChange);
}

export { initProduct, productActions };