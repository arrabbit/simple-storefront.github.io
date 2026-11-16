/** 
 * Summary: reading saved data from local storage if it already exists, 
 * saving it to localStorage, getProducts, getting products, & getting them be their ID.
 * 
 * File: data.js
 * Author: Sage Odesanya
*/
import productsData from "./data-pretty.json" with { type: "json" };

const STORAGE_KEY = "products";
let products = [];

/*read saved product list from localStorge. returns the saved list, or null if missing/unreadable.*/
function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    // return the array and the length of items greater than 0, or null if parsed is empty
  } catch {
    return null; // corrupted JSON or storage blocked: treat it like nothing was saved.
  }
}

/*save product list to localStorage.*/
function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // if the storage is full or blocked, the app will still work, but it will not cache. 
  }
}

/*uses the saved copy if there is one, othewise it will use the json file.*/

export async function loadProducts() {
  const saved = readSaved();
  products = saved ?? productsData.products; //products are already saved if they exist in productsData.products
  if (!saved) save(products);// otherwise save it to products
  return products;
}

/*gets loaded products and returns an array of loaded products.*/
export function getProducts() {
  return products;
}

/*find a product using its ID. returns the product, or undefined if it is not found.*/
export function getProductById(id) {
  return products.find((product) => product.id === id);
}