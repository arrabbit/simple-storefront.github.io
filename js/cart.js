/** 
 * Summary: Cart class and functions.
 * 
 * File: cart.js
 * Author: Anna Running Rabbit
*/

import { updateCartCount, showToast } from "./ui.js";

const STORAGE_KEY = "cart";

/** A shopping cart that is saved to localStorage after every change. */
class Cart {

    // Private fields
    #items = [];
    #onChange;

    constructor(onChange) {
        this.#onChange = onChange;
        
        // stores the saved cart when the cart has items or an empty array if the cart is empty
        this.#items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        this.#onChange(this.getCount());
    }

    get items() {
        return this.#items; // read-only access
    }

    /** Saves the cart and updates the header count. */
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.#items));
        this.#onChange(this.getCount());
    }

    /** Adds a single product to the cart, or increase the product quantity by 1 if the product is already in the cart. */
    add(product, quantity = 1) {
        const existing = this.#items.find(item => item.id === product.id); //determines if product is in cart already or not

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.#items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: quantity,
            });
        }
        this.save();
    }

    /** Sets the quantity of an item in the cart (quantity must be >= 1). */
    setQuantity(id, quantity) {
        const item = this.#items.find(entry => entry.id === id);

        if (item) {
            item.quantity = Math.max(1, Number(quantity) || 1);
            this.save();
        }
    }

    /** Removes an item by id. */
    remove(id) {
        this.#items = this.#items.filter(item => item.id !== id);
        this.save();
    }

    /** Empties the cart after checkout. */
    clear() {
        this.#items = [];
        this.save();
    }

    /** Returns the total number of items in the cart. */
    getCount() {
        return this.#items.reduce((total, item) => total + item.quantity, 0); // needs 0 as starting value in case of empty cart
    }

    /** Get cart total pre-tax and pre-shipping costs. */
    getMerchandiseTotal() {
        return this.#items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}

const cart = new Cart(updateCartCount);

/** Adds a product to the cart and shows the toast message that a product has been added. */
function addToCart(product, quantity = 1) {
    cart.add(product, quantity);
    showToast(`${product.title} added to cart`);
}

export { Cart, cart, addToCart };