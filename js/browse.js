/** 
 * Summary: browse view: filters, active-filter chips, sorting and the product grid.
 * filters and sort are kept in separate variables so sorting does not reset filters.
 * additionally, clear all does not reset the sort. 
 *  
 * File: browse.js
 * Author: Sage Odesanya
*/
import { getProducts } from "./data.js";
import { getCategories, formatCategory } from "./category.js";
import { createProductCard } from "./productCard.js";
import { formatPrice } from "./ui.js"; // Anna Running Rabbit
import { clear, el } from "./dom.js";
let filters = newFilters();
let sortBy = "name";
/* empty filter set (nothing filtered).*/
function newFilters() {
  return { name: "", categories: new Set(), minRating: 0, minPrice: null, maxPrice: null };
}
/* checking a product against the filters.*/
function matchesFilters(product, f) {
  const nameApplies = product.title.toLowerCase().includes(f.name.trim().toLowerCase()); //case insensitive
  const categoryApplies = f.categories.size === 0 || f.categories.has(product.category); //category is empty, or matches
  const ratingApplies= product.rating >= f.minRating;//rating is greater than or equal to minimum rating
  const minApplies = f.minPrice === null || product.price >= f.minPrice;
  //minimum price filter is empty or product price is greater than or equal to the minimum price filter
  const maxApplies = f.maxPrice === null || product.price <= f.maxPrice;
  //maximum price filter is empty or product price is less than or equal to the maximum price filter
  return nameApplies && categoryApplies && ratingApplies && minApplies && maxApplies;
}
/*only keeping products that match all of the filters.*/
export function filterProducts(list, f) {
  return list.filter((product) => matchesFilters(product, f));
}
/* how the items are being compared. a composite key made up of the name, price, and category are used to compare the items. */
const COMPARERS = {
  name: (a, b) => a.title.localeCompare(b.title), //compare a's name to b's name,
  price: (a, b) => a.price - b.price, //compare 
  category: (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
};
/*returns a sorted copy of the list.*/
export function sortProducts(list, key) {
  return [...list].sort(COMPARERS[key] ?? COMPARERS.name);//shallow copy prevents data mutation,
  //orders using a comparator sort method, and compares the key (name, price, or category)
  //to the name of the item being compared.
}
/*lists filters that have been switched on.*/
export function getActiveFilters(f) {
  const active = [];
  if (f.name.trim()) { // if there is text in the name, push the object onto the list
    active.push({ type: "name", value: "", label: `Name: ${f.name.trim()}` });
  }
  f.categories.forEach((c) => { //for each one, format the categories and create a legible label
    active.push({ type: "category", value: c, label: formatCategory(c) });
    })
  if (f.minRating > 0) { // if the rating is >0, write out the rating & how many stars it is
    active.push({ type: "rating", value: "", label: `Rating: ${f.minRating}+ stars` });
  }
  if (f.minPrice !== null) { //if the minimum price is not null, add a label to the minimum price. this method includes 0 as well.
    active.push({ type: "minPrice", value: "", label: `Min ${formatPrice(f.minPrice)}` });
  }
  if (f.maxPrice !== null) {//if the maximum price is not null, add a label to the maximum price. this method includes 0 as well.
    active.push({ type: "maxPrice", value: "", label: `Max ${formatPrice(f.maxPrice)}` });
    }
  return active;
}
/* for removing the filters.*/
const REMOVERS = {
  name: (f) => { f.name = ""; },
  category: (f, value) => { f.categories.delete(value); },
  rating: (f) => { f.minRating = 0; },
  minPrice: (f) => { f.minPrice = null; },
  maxPrice: (f) => { f.maxPrice = null; },
};
/*witch off one filter. /*switch off one filter F, a type of filter TYPE, and a specific category chip CATEGORY*/
export function removeFilter(f, type, value) {
  REMOVERS[type]?.(f, value);//if the filter exists, remove the filter and the value
}
/*turn input text into a number or turn it into null if it is empty or invalid.*/
export function parsePrice(text) {
  const number = text.trim() === "" ? null : Number(text); //if text is empty, turn it into null
  return Number.isNaN(number) ? null : number; //if not null && number, return the parsed number, otherwise return null.
}
/*after products have been loaded, draw category checkboxes once.*/
function renderCategoryOptions() {
  const box = document.getElementById("category-options");
  clear(box);
  getCategories().forEach((category) => box.appendChild(createCategoryOption(category)));
}
/*build one category checkbox & its label.*/
function createCategoryOption(category) {
  const label = el("label", "flex cursor-pointer items-center gap-2");//tailwind css for label
  const box = el("input", "h-4 w-4");//tailwind css for input
  box.type = "checkbox"; 
  box.value = category;
  label.appendChild(box);
  label.appendChild(el("span", "", formatCategory(category)));
  return label;
}
/*Copy the current filter values into the form controls.*/
function syncControls() {
  document.getElementById("filter-name").value = filters.name;
  document.getElementById("filter-rating").value = String(filters.minRating);
  document.getElementById("filter-min-price").value = filters.minPrice ?? "";
  document.getElementById("filter-max-price").value = filters.maxPrice ?? "";
  document.getElementById("sort-by").value = sortBy;
  document.querySelectorAll("#category-options label").forEach(syncCategoryOption);
}
/*tick & label category option if it is selected.*/
function syncCategoryOption(label) {
  const box = label.querySelector("input");
  box.checked = filters.categories.has(box.value);
  label.classList.toggle("font-bold", box.checked);
}
/*build removable chip for an active filter.*/
function createChip(item) {
  const chip = el("span", "flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800", item.label);
  const remove = el("button", "font-bold hover:text-red-600", "✕");
  remove.type = "button";
  remove.dataset.action = "remove-filter";
  remove.dataset.filter = item.type;
  remove.dataset.value = item.value;
  remove.setAttribute("aria-label", `Remove filter: ${item.label}`);
  chip.appendChild(remove);
  return chip;
}
/*clear all for the buttons. */
function createClearAll() {
  const button = el("button", "text-sm text-blue-700 underline", "Clear All");
  button.type = "button";
  button.dataset.action = "clear-filters";
  return button;
}
/*draw chips for active filters and clear all.*/
function renderActiveFilters() {
  const bar = document.getElementById("active-filters");
  const active = getActiveFilters(filters);
  clear(bar);
  active.forEach((item) => bar.appendChild(createChip(item)));//create a chip for each item
  if (active.length > 0) bar.appendChild(createClearAll()); //if at least one filter is active, clear the clear all chip.
}
/*draw product grid, result count, and message if there are no matches.*/
function renderGrid() {
  const grid = document.getElementById("browse-grid"); 
  const results = sortProducts(filterProducts(getProducts(), filters), sortBy); //sort elements by the filters, once having gotten the elements with getProducts.
  clear(grid);
  results.forEach((product) => grid.appendChild(createProductCard(product)));
  document.getElementById("no-matches").classList.toggle("hidden", results.length > 0); //if there are no matches, hide
  const word = results.length === 1 ? "product" : "products"; //if the length is 1, write product, if not, write products. 
  document.getElementById("result-count").textContent = `${results.length} ${word}`;//write the amount of results there were to the grid
}
/*redraw the chips and the grid, while leaving the form controls alone.*/
function renderResults() {
  renderActiveFilters();
  renderGrid();
}
/*redraw everything, including the form controls.*/
function renderAll() {
  syncControls();
  renderResults();
}
/*function to open or close the filter panel. the button is the panel header button(data-panel = panel id).*/
function togglePanel(button) {
  const panel = document.getElementById(button.dataset.panel);
  const nowHidden = panel.classList.toggle("hidden");
  button.setAttribute("aria-expanded", String(!nowHidden)); 
  button.querySelector("[data-indicator]").textContent = nowHidden ? "+" : "−"; // hide it if they click on the button + or -
}
/*click actions for this view, main.js will eventually merge these into its click listener. each one receives the clicked element.*/
export const browseActions = {
  "toggle-panel": (button) => togglePanel(button),
  "remove-filter": (button) => {
    removeFilter(filters, button.dataset.filter, button.dataset.value);
    renderAll();
  },
  "clear-filters": () => {
    filters = newFilters();
    renderAll();
  },
};
/*add or remove a category when its check box changes.*/
function onCategoryChange(event) {
  const box = event.target;
  if (box.checked) filters.categories.add(box.value);
  else filters.categories.delete(box.value);
  renderAll();
}
/*listen for typing, selecting, and checking in the filter form.*/
function bindControls() {
  const on = (id, type, handler) => document.getElementById(id).addEventListener(type, handler);
  on("filter-name", "input", (e) => { filters.name = e.target.value; renderResults(); });
  on("filter-min-price", "input", (e) => { filters.minPrice = parsePrice(e.target.value); renderResults(); });
  on("filter-max-price", "input", (e) => { filters.maxPrice = parsePrice(e.target.value); renderResults(); });
  on("filter-rating", "change", (e) => { filters.minRating = Number(e.target.value); renderResults(); });
  on("sort-by", "change", (e) => { sortBy = e.target.value; renderResults(); });
  on("category-options", "change", onCategoryChange);
}
/*react to browse view being shown. params.category (from category title) replaces the filters with that one category.*/
function onViewChange(event) {
  const { name, params } = event.detail;
  if (name !== "browse") return;
  if (params.category) {
    filters = newFilters();
    filters.categories.add(params.category);
  }
  renderAll();
}
/*set up browse view(call after products are loaded).*/
export function initBrowse() {
  renderCategoryOptions();
  bindControls();
  document.addEventListener("viewchange", onViewChange);
}