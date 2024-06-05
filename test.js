// Create a new URL object
let url = new URL(window.location.href);
console.log(url)
// Create a new URLSearchParams object from the URL's search string
let params = new URLSearchParams(url.search);
console.log(params)

// Set new query parameters or update existing ones
params.set('key', 'value');
// params.set('anotherKey', 'anotherValue');

// Update the URL with the new query parameters
url.search = params.toString();

// If you want to update the browser's URL without reloading the page
history.pushState(null, '', url);
