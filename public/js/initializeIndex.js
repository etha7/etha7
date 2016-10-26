'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

function initializePage() {
/*
 * Function that is called when the document is ready.
 */
 $("#scientistButton").click(function(e) {
        //$('#buttonContainer').append("<h1>Science!</h1>");
        window.location.href = "/science";
                                        });
               
 $("#citizenButton").click(function(e) {
        window.location.href = "/citizen";
                                       });
}
