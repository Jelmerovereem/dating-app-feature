let form = document.querySelector('nav ul li form'); // get the search form 
let searchAnchor = document.querySelector('nav ul li form a'); // get the progressive disclosure button
let searchBtn = document.querySelector('button[type="submit"]'); // get the search submit button
let searchBar = document.querySelector(' input[name="searchField"]'); // get the search input field

// set the standard styles
searchAnchor.style.display = "flex";
searchBar.style.display = "none";
searchBtn.style.display = "none";

function showSearchBar() {
	// set the styles to visible elements
	searchAnchor.style.display = "none";
	searchBtn.style.display = "inline-block";
	searchBar.style.display = "inline-block";
}

searchAnchor.addEventListener('click', showSearchBar); // when user clicks on the progressive disclosure btn, fire showSearchBar()

function checkValid() {
	if (!searchBar.validity.valid) {
		document.querySelector(".invalid-modal").classList.add("showInvalid-modal");
		
	} else if (searchBar.validity.valid) {
		document.querySelector(".invalid-modal").classList.remove("showInvalid-modal");
	}
}

searchBar.addEventListener('input', checkValid);


const progressiveDisclosureBtns = document.querySelectorAll(".progressiveDisclosureBtn"); // get the buttons for the user to click on

for (var i = 0; i < progressiveDisclosureBtns.length; i++) { // loop through these multiple buttons
	function showEditRating() {
		this.parentNode.children[2].classList.toggle("changeRatingNone"); // look through the HTML collection to the "select" element and toggle the class
		this.parentNode.children[4].classList.toggle("editBtnNone"); // look through the HTML collection to the "button" element and toggle the class
		this.parentNode.children[5].classList.toggle("removeCancelBtn"); // look through the HTML collection to the "anchor" element and toggle the class
		this.classList.toggle("removeEdit"); // toggle the class of the progressive disclosure button
	}

	progressiveDisclosureBtns[i].addEventListener("click", showEditRating); // when user clicks on one of the buttons, fire up showEditRating()
}


const cancelBtns = document.querySelectorAll(".cancelBtn"); // get all the "cancel" buttons

for (var k = 0; k < cancelBtns.length; k++) { // loop through all these buttons
	function removeEditRating() {
		this.parentNode.children[2].classList.toggle("changeRatingNone");
		this.parentNode.children[4].classList.toggle("editBtnNone");
		this.parentNode.children[5].classList.toggle("removeCancelBtn");
		this.parentNode.children[3].classList.toggle("removeEdit");
	}

	cancelBtns[k].addEventListener("click", removeEditRating); // when user clicks on one of these buttons, fire up removeEditRating()
}