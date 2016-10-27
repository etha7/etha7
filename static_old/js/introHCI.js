'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$("#scientistButton").click(function(e) {
      console.log("scientist");
		$('#buttonContainer').append("<h1>Science!</h1>");
	});

	$("#citizenButton").click(function(e) {
		$('#buttonContainer').append("<h1>Citizen!</h1>");
	});
	// Add any additional listeners here
	// example: $("#div-id").click(functionToCall);
}
