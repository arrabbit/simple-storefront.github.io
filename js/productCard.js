/*
 * Summary: Product card used on Home, Browse, and Related Products. 
 * Clicking the card will open the product page, while the button adds to the cart. 
 * Both are handled by the single click listener in main.js with data- attributes.  
 * 
 * File: productCard.js
 * 
 * Author: Sage Odesanya
*/
import { el } from "./dom.js";
import { formatPrice } from "./helpers.js"; // Anna Running Rabbit
/*Build the card for one product*/
export function createProductCard(product) {
  const card = el("article", "flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#BAD8B6] bg-[#F9F6E6] shadow-sm transition hover:shadow-md");
  card.dataset.action = "open-product";
  card.dataset.id = product.id;
  card.appendChild(createThumbnail(product));
  card.appendChild(createBody(product));
  return card;
}
/*Builds the thumbnail image using product, and returning an HTMLImageElement.*/
//credit: https://www.w3.org/2003/01/dom2-javadoc/org/w3c/dom/html2/HTMLImageElement.html
function createThumbnail(product) {
  const img = el("img", "h-44 w-full object-cover");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy"; //dont load the image until the user scrolls towards it
  return img;
}
/*Build the text area: the title, the price, and the Add to Cart Button.*/
function createBody(product) {
  const body = el("div", "flex flex-1 flex-col gap-2 p-3");
  body.appendChild(el("h3", "line-clamp-2 font-semibold", product.title));
  body.appendChild(el("p", "text-gray-700", formatPrice(product.price)));
  body.appendChild(createAddButton(product));
  return body;
}
/*Builds the Add to Cart button.*/
//Credit: https://www.w3schools.com/jsref/dom_obj_pushbutton.asp
function createAddButton(product) {
  const button = el("button", "mt-auto rounded bg-[#283D32] px-3 py-2 text-[#F9F6E6] hover:bg-[#8D77AB]", "Add to Cart");
  button.type = "button";
  button.dataset.action = "add-to-cart";
  button.dataset.id = product.id;
  return button;
}