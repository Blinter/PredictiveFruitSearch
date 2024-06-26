const input = document.querySelector('#fruit');
const relevance = document.querySelector('#relevance');
const extended = document.querySelector('#extended');
const suggestions = document.querySelector('div .suggestions');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];
/**
 * Search - Returns the results found based on a string provided
 * @param {string} str A string that is provided to search the fruit table
 * @return {Array} A sorted array based on options defined by the user.
 */
function search(str) {
	if (str.length === 0)
		return [];
	return sortRelevance(str.toLowerCase(), extended.checked ? undefined : 7);
}
/**
 * A callback function when an option is changed or input text is modified.
 * @param {Event} e Event Handler
 * @return {void}
 */
function searchHandler(e) {
	suggestions.innerHTML = "";
	relevance.checked ? showSuggestionsAndScore(search(input.value)) : showSuggestions(search(input.value))
}

/**
 * Show Suggestions without scores
 * Adds HTML elements to the DOM when results are provided
 * @param {Array} results an Array containing the search results
 * @return {void}
 */
function showSuggestions(results) {
	results.forEach(v => {
		const ele1 = document.createElement("span");
		ele1.setAttribute("data-label", v);
		ele1.innerText = v;
		ele1.addEventListener("click", e => useSuggestion(e))
		ele1.addEventListener("mouseover", e => {
			input.className = "styled";
			input.setAttribute("data-previous", input.value);
			input.value = e.target.getAttribute("data-label");
		});
		ele1.addEventListener("mouseout", e => {
			input.value = input.getAttribute("data-previous");
			input.removeAttribute("class");
			input.removeAttribute("data-previous");
		});
		suggestions.append(ele1);
	});
}
/**
 * Show Suggestions with scores
 * Adds HTML elements to the DOM when results are provided
 * @param {Array} results an Array containing both the search results and scores
 * @return {void}
 */
function showSuggestionsAndScore(results) {
	const maximum = results.reduce((a, v) => Math.max(a, v[1]), -Infinity);
	results.forEach((v, i) => {
		let curScore = Math.floor((v[1] / maximum) * 100);
		const ele1 = document.createElement("span");
		ele1.className = "scored";
		ele1.setAttribute("data-label", v[0]);
		ele1.innerText = v[0] + " (" + curScore + "%)";
		ele1.addEventListener("click", e => useSuggestion(e))
		ele1.addEventListener("mouseover", e => {
			input.className = "styled";
			input.setAttribute("data-previous", input.value);
			input.value = e.target.getAttribute("data-label");
		});
		ele1.addEventListener("mouseout", e => {
			input.value = input.getAttribute("data-previous");
			input.removeAttribute("class");
			input.removeAttribute("data-previous");
		});
		suggestions.append(ele1);
	});
}

/**
 * Use Suggestion
 * Event handler is used when user clicks on a search result.
 * @param {Event} e Event Handler which is based on user's change in search selection.
 * @return {void}
 */
function useSuggestion(e) {
	input.value = e.target.getAttribute("data-label");
	suggestions.innerHTML = "";
	input.removeAttribute("class");
	input.removeAttribute("data-previous");
}

/**
 * Sort Relevance - Main function used to generate search results and score.
 * @param {String} str Search Term
 * @param {Number} [resultsAmount] Amount of results based on search or unlimited if not set
 * @return {Array} Based on user form settings in DOM, return a sorted array with a specific number of results.
 */
function sortRelevance(str, resultsAmount = 0) {
	if (resultsAmount === 0)
		resultsAmount = undefined;
	let offset = 0;
	let strSet = new Set();
	while (offset < str.length)
		for (let i = 1; i + offset <= str.length; i++)
			strSet.add(str.split('').splice(offset++, i).join(''));
	_results = Array.from(fruit.reduce((a, v) => {
		if (str.toLowerCase() === v.toLowerCase())
			a.has(v) ? a.set(v, a.get(v) + 15) : a.set(v, 15);
		if (v.toLowerCase().includes(str.toLowerCase()))
			a.has(v) ? a.set(v, a.get(v) + 15) : a.set(v, 15);

		let fruitSet = new Set();
		offset = 0;
		while (offset < v.length)
			for (let i = 1; i + offset <= v.length; i++)
				fruitSet.add(v.split('').splice(offset++, i).join(''));
		for (item of fruitSet)
			for (item2 of strSet)
				if (item2.toLowerCase() === item.toLowerCase())
					a.has(v) ? a.set(v, a.get(v) + 5) : a.set(v, 5);
				else if (item.toLowerCase().includes(item2.toLowerCase()))
					a.has(v) ? a.set(v, a.get(v) + 2) : a.set(v, 2);
		return a;
	}, new Map())).sort((a, b) => {
		return b[1] - a[1];
	}).slice(0, resultsAmount);
	return relevance.checked ? _results : _results.map(v => v[0]);
}

relevance.addEventListener("change", searchHandler);
extended.addEventListener("change", searchHandler);
input.addEventListener('keyup', searchHandler);
suggestions.addEventListener('click', useSuggestion);