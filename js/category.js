/*Summary: category view: one tile per category. 
* Clicking on a tile will open Browse filtered to that category (data-action="browse-category").
* File Name: category.js
* 
* Owner: Sage Odesanya
*/
import { getProducts } from "./data.js";
import { clear, el } from "./dom.js";

/*gets every distinct category. sorted A to Z.*/
export function getCategories() {
  const unique = new Set(getProducts().map((product) => product.category));
  return [...unique].sort();
}
/*turns a category into a readable letter (e.g. home-decoration -> Home Decoration).*/
/*Credit: https://www.geeksforgeeks.org/javascript/how-to-convert-title-to-url-slug-using-javascript/#:~:text=HTML%20code%20implementation*/
export function formatCategory(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
/*uses first product's thumbnail to build the tile for one category.*/
function createTile(category) {
  const sample = getProducts().find((product) => product.category === category);
  const tile = el("button", "overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:shadow-md");
  tile.type = "button";
  tile.dataset.action = "browse-category";
  tile.dataset.category = category;
  const img = el("img", "h-40 w-full object-cover");
  img.src = sample.thumbnail; 
  img.alt = "";
  tile.appendChild(img);
  tile.appendChild(el("p", "p-3 text-lg font-semibold", formatCategory(category)));
  return tile;
}
/*fills the category grid with tiles.*/
export function renderCategories() {
  const grid = document.getElementById("category-grid");
  clear(grid);
  getCategories().forEach((category) => grid.appendChild(createTile(category)));
}
/*re-renders whenever the Category view is shown. */
export function initCategory() {
  document.addEventListener("viewchange", (event) => {
    if (event.detail.name === "category") renderCategories();
  });
}