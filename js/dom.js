/** 
 * Summary: DOM Helpers shared by every view. 
 * 
 * File: dom.js
 * Author: Sage Odesanya
*/
/*creates an element with tailwind classes and text.*/
export function el(tag, classes = "", text = "") {
  const node = document.createElement(tag);
  const names = classes.split(/\s+/).filter(Boolean);
  if (names.length) node.classList.add(...names);
  if (text) node.textContent = text;
  return node;
}
/*remove every child from a node.*/
export function clear(node) {
  node.replaceChildren();
}