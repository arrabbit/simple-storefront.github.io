/** 
 * Summary: App entry point. Loads the data, sets up each view, and will also run 
 * the one click listener for the page. buttons and links carry data-action 
 * (and data-id / data-view / ...) attributes.
 * 
 * File name: main.js
 * Owner: Sage Odesanya and Anna Running Rabbit
 */

import { loadProducts, getProductById } from "./data.js";
import { showView } from "./router.js";
import { initHome } from "./home.js";
import { initCategory } from "./category.js";
import { initBrowse, browseActions } from "./browse.js";
import { updateNavHighlight } from "./helpers.js"; // Anna Running Rabbit
import { initAbout } from "./about.js"; // Anna Running Rabbit
import { addToCart } from "./cart.js"; // Anna Running Rabbit
import { initProduct, productActions } from "./product.js"; 

/*look up the clicked card's product and addToCart. */
function handleAddToCart(button) {
  const product = getProductById(Number(button.dataset.id));
  if (product) addToCart(product);
}
// data-action name -> handler. Each handler receives the clicked element.
const actions = {
  "show-view": (el) => showView(el.dataset.view),
  "open-product": (el) => showView("product", { id: Number(el.dataset.id) }),
  "browse-category": (el) => showView("browse", { category: el.dataset.category }),
  "add-to-cart": handleAddToCart,
  ...browseActions,
  ...productActions,
  //https://www.w3schools.com/jsref/jsref_oper_spread.asp
  //spreads all the iterables into individual elements. 
};
/*single click listener: finds the nearest [data-action] and runs it.*/
function handleClick(event) {
  const target = event.target.closest("[data-action]");
  const handler = target && actions[target.dataset.action];
  if (!handler) return;
  event.preventDefault();
  handler(target);
}
/*listen for any view changes and update the navigation highlight*/
document.addEventListener("viewchange", (event) => {
  updateNavHighlight(event.detail.name);
});
/*show a load error if the page content fails to load.*/
function showAppError(message) {
  const box = document.getElementById("app-error");
  box.textContent = message;
  box.classList.remove("hidden");
}
/*start the app:
*   load the data, set up the views and show home.*/
async function start() {
  try {
    await loadProducts();
  } catch (error) {
    showAppError("Sorry, we cannot load the products right now. Please try again later.");
    return;
  }
  initHome();
  initCategory();
  initBrowse();
  initAbout();
  initProduct();
  document.addEventListener("click", handleClick);
  showView("home");
}
start();
