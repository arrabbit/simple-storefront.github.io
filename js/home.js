/* Summary: home view, with its featured products. The hero image, heading, and browse
 * button are plain HTML in index.html. 
 * 
 * File: home.js
 * Author: Sage Odesanya
*/
import { getProducts } from "./data.js";
import { createProductCard } from "./productCard.js";
import { clear } from "./dom.js";
const FEATURED_COUNT = 6;

/*Picks the top-rated products that we choose to feature, instead of choosing arbitrarily. 
* out of a list of all the products, choose how many we return, and return an array of them.
*/
export function getFeatured(list, count = FEATURED_COUNT) {
  return [...list].sort((a, b) => b.rating - a.rating).slice(0, count);
}
/*Fill the featured grid with product cards.*/
export function renderHome() {
  const grid = document.getElementById("featured-grid");
  clear(grid); //fill the grid with the six top-rated elements we chose. 
  getFeatured(getProducts()).forEach((product) => {
    grid.appendChild(createProductCard(product));
  });
}
/*Render these items once again when the Home view is shown.*/
export function initHome() {
  document.addEventListener("viewchange", (event) => {
    if (event.detail.name === "home") renderHome();
  });
}