/** 
 * Summary: reading saved data from local storage if it already exists, 
 * saving it to localStorage, getProducts, getting products, & getting them be their ID.
 * 
 * File: data.js
 * Author: Sage Odesanya
*/

const API_URL = "https://dummyjson.com/products?limit=100";

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
/*fetch product list form dummyjson. returns promise from the .products firl, and throws an 
* error if the network fails, server gives an error, or the data is not a list. 
 */
async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Your request failed! This is why: (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data.products) || data.products.length === 0) {
    throw new Error("The response had no products... are you sure you're looking in the right place? ");
  }
  return data.products;
}

/*uses the saved copy if there is one, otherwise it will fetch the products
* from DummyJSON and save them to local storage.*/
export async function loadProducts() {
  const saved = readSaved();
  products = saved ?? (await fetchProducts()); //products are already saved if they exist in local storage
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