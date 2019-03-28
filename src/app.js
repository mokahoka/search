// Javascript external file

// STATIC VARIABLES
const URL = "http://localhost:1337/api";
const searchBar  = document.getElementById("input")
const searchResults = document.getElementById("search-results");
const container = document.getElementsByClassName("container")[0];


// Timeout for debouncing
let timeout = 0;

let cachedResults = [];


// adds value to cache
function addToCache(val){
	if(cachedResults.indexOf(val) > -1) cachedResults.splice(cachedResults.indexOf(val),1)

	if( cachedResults.length >= 5 ){
		cachedResults = cachedResults.slice(1);
	}
	cachedResults.push(val);
}

// adds single node to an element
function addNode(val,node){
	const link = document.createElement("a");
	const para = document.createElement("p");
	para.innerHTML = val;
	link.appendChild(para)
	node.appendChild(link)
}

// adds an array of data to a node
function appendArrToNode(arr,node){
	arr.forEach( val => {
					const link = document.createElement("a");
					const para = document.createElement("p");
					para.innerHTML = val
					link.addEventListener("click" ,() => {
						addToCache(val)
						searchResults.style.display = "none";
					})
					link.appendChild(para)
					node.appendChild(link);

	})
}

// clears all child nodes of passed node
function clearChildNodes(node){
	while(node.hasChildNodes()){
		node.removeChild(node.firstChild);
	}
}

// show cache
function showCache(){
	clearChildNodes(searchResults);
	if(cachedResults.length > 0){
		const reversedArray = cachedResults.slice();
		reversedArray.reverse();
		addNode("Recent Searches ",searchResults)
		appendArrToNode(reversedArray,searchResults);
	}
	searchResults.style.display = "block";
}

// Event handler for Blur event
searchResults.addEventListener("blur" , () => {
	const query = event.target.value;
	if(!query) searchResults.style.display = "none"
})

// shows cached data on empty focused event
searchBar.addEventListener("focus", (event) => {
	const query = event.target.value;
	if(!query){
		showCache();
	}
})

// fetches data on each keyup event
searchBar.addEventListener("keyup", (event) => {

	// registers only valid keypresses
	if( event.key.charCodeAt() > 47 && event.key.charCodeAt() < 58 ||
		event.key.charCodeAt() > 64 && event.key.charCodeAt() < 91 ||
		event.key.charCodeAt() > 96 && event.key.charCodeAt() < 122 ||
		event.key == "Backspace"){
			
			const query = event.target.value;
			if ( query.length == 0 ) showCache();
			else if( query.length == 1) searchResults.style.display = "none";
			else{
				clearTimeout(timeout);
				timeout = setTimeout( async () => {
										const results  = await fetch(`${URL}/${query}`)
															.then(res => res.json())
															.then(val => val.results)
															.catch(err => [])

					if( results && results.length > 0){
						clearChildNodes(searchResults);
						appendArrToNode(results,searchResults);
					}
					else{
						clearChildNodes(searchResults);
						addNode("No results found",searchResults);
					}
					searchResults.style.display = "block"
				},200)
			}
	}
})
