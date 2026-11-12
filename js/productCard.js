// async function loadProducts(url, storageKey) {
//   // used https://www.w3schools.com/jsref/prop_win_localstorage.asp for help with this section 
  
//   // checking for cached data
//   const cachedData = localStorage.getItem(storageKey);
  
//   if (cachedData) {
//     // parse and return data if it exists
//     return JSON.parse(cachedData);
//   }
  
//   try {
//     // fetch from server/path otherwise

//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Looks like we encountered an error, this is what it was: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // save as a string in localStorage
//     localStorage.setItem(storageKey, JSON.stringify(data));
//     https://blog.logrocket.com/localstorage-javascript-complete-guide/#when-use-localstorage
    
//     return data;
//   } catch (error) {
//     console.error('Failed to load products:', error);
//     return null;
//   }
// }
// this code is commented out for now. I am not sure how to implemen the functionality of having it grab 
// things from package-lock.json and store it in local storage.
const userArray = ["Obaseki",25]
localStorage.setItem('user', JSON.stringify(userArray));
localStorage.getItem('name');
JSON.parse(localStorage.getItem('user'));
const userData = JSON.parse(localStorage.getItem('user'));
console.log(userData);

// const jsonURL = './package-lock.json';
// const storageKey = 'products';

// loadProducts(jsonURL, storageKey)
//   .then(data => {
//     console.log("Data loaded successfully:", data);
//   })
//   .catch(error => {
//     console.error("Error loading JSON:", error);
//   });