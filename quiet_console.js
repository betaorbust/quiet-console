/**
 * Console silencer.
 * The function will silence all console output (info, log, error) unless a dev cookie is
 * set.
 * Exports a global consoleManager object with the following methods:
 * silence(): Shuts the console up.
 * restore(): Gets the console all chatty.
 * toggle(): toggle the dev cookie state and does an appropriate silence or restore.
 */
(function(window, document, undefined) {
	var con = window.console; // convenience method
	var COOKIENAME = 'bringthenoise';
	var COOKIE_VALUE = 'true';

	var FULL_COOKIE_STRING=COOKIENAME+'='+COOKIE_VALUE;

	// Store the original system functions
	var oldConsole = {
		info: window.console.info,
		log: window.console.log,
		error: window.console.error
	};

	// Doesn't do shit.
	var noOp = function(){};


	// Quick lib for dealing with our cookie.
	window.cookieLib = {
		hasCookie: function () {
			return document.cookie.indexOf(FULL_COOKIE_STRING) >= 0;
		},
		writeCookie: function() {
			document.cookie = FULL_COOKIE_STRING;
		},
		removeCookie: function () {
			if (cookieLib.hasCookie()) {
				document.cookie = COOKIENAME + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		}
	};

	// What we'll expose on the object we'll make global
	var exported = {
		silence: function(){ // Shut up.
			window.console.info = noOp;
			window.console.log = noOp;
			window.console.error = noOp;
			cookieLib.removeCookie();
		},
		restore: function(){ // Get all talky.
			window.console.info = oldConsole.info;
			window.console.log = oldConsole.log;
			window.console.error = oldConsole.error;
			cookieLib.writeCookie();
		},
		toggle: function(){ // Do the other one ;)
			return cookieLib.hasCookie() ? exported.silence() : exported.restore();
		}
	};

	// Do the runtime configuration.
	// If the cookie isn't set, turn off all console output.
	if(!cookieLib.hasCookie()){
		exported.silence();
	}

	// Actually export our stuff
	window.consoleManager = exported;

})(window, document);