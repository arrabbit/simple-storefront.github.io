/*Summary: each view is a <section id="view-NAME" class="view">. 
* showView hides them all, shows one, then fires a viewchange event so the 
* view can render itself: 
*       document.addEventListener("viewchange", (e) => e.detail.name / e.detail.params)
*  File Name: router.js
* 
* Owner: Sage Odesanya
*/
/* shows one view, and hides the others.*/
export function showView(name, params = {}) {
  const target = document.getElementById(`view-${name}`);
  if (!target) return; 
  hideAllViews();
  target.classList.remove("hidden");
  window.scrollTo(0, 0); //resets to 0, 0 in the window
  document.dispatchEvent(new CustomEvent("viewchange", { detail: { name, params } }));
  //https://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-flow:~:text=the%20EventTarget.dispatchEvent()-,method,-%2C%20and%20implementations%20must
}
/** Hide every view section. */
function hideAllViews() {
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.add("hidden"); 
    //sets the css for the view to hidden, so it does not show up. 
  });
}