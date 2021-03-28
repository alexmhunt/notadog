/*
Alex Hunt
Team Not a Dog
A09: Mod the Sample Toy

Gradient Maker Mods:
Mod 1: Changed background color to off-white.
Mod 2: Changed grid to start with a 2x1 color picker, allowing the player to
	   choose one unique color for each bead.
Mod 3: Each bead in the 1x2 grid now changes to a randomly-generated color on touch.
Mod 4: When 'G' is pressed, the grid changes to 32x32.
	   Each row smoothly interpolates between the two colors of the original two beads
	   to varying degrees. First row is the first color, last row is the second color.
Mod 5: After creating the gradient, pressing 'G' again returns to the
	   original 2x1 color picker, saving the previously-used colors.
*/



/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // do not remove this directive!

let currentGrid;
let COLORS = [[153, 21, 57], [230, 220, 87],
			[230, 64, 108], [41, 183, 230],
			[35, 124, 153]];

// randomly generate two colors to start
let beadColors = [ randColor(), randColor() ];
let backgroundColor = 0xebebeb;

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {

	// Establish grid dimensions
	
	currentGrid = PS.gridSize( 1, 2 );
	// Set background color to Perlenspiel logo gray
	
	PS.gridColor( backgroundColor );
	
	// Change status line color and text

	PS.statusColor( PS.COLOR_BLACK );
	PS.statusText( "Pick two colors, then press G!" );

	// Set the two starting beads to random colors
	initColorPicker();

	//PS.debug("color = " + randInt(5));
	
	// Preload click sound

	PS.audioLoad( "fx_click" );
	PS.audioLoad( "fx_pop" );
};



/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// If grid is 2x1 (in color picking mode),
	if((currentGrid.height === 2) && (currentGrid.width === 1)){
		// Set bead color to a random color.
		let next = randColor();
		beadColors[y] = next;
		PS.color(x, y, next);

		// Play click sound.

		PS.audioPlay( "fx_click" );
	}


};

// Initializes a 2x1 color picker.
function initColorPicker(){
	PS.color(0, 0, beadColors[0]);
	PS.data(0,0, beadColors[0]);

	PS.color(0, 1, beadColors[1]);
	PS.data(0,1, beadColors[1]);
}

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:

/*

PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

*/

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	 //PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	 if (key === 103){ // G pressed

	 	// if in the color picker
	 	if((currentGrid.height === 2) && (currentGrid.width === 1)){
	 		currentGrid = PS.gridSize(32,32);

	 		PS.gridColor(backgroundColor);

	 		makeGradient(beadColors[0], beadColors[1]);

			PS.border(PS.ALL,PS.ALL,0);
			PS.statusText("Press G to start over.");
		}
	 	else{ // in the gradient viewer
	 		// Reinstate grid, background color, & status line
			currentGrid = PS.gridSize(1,2);
			PS.gridColor(backgroundColor);
			PS.statusText("Pick two colors, then press G!");

			initColorPicker();
		}

		 PS.audioPlay( "fx_pop" );
	 }

};

// Fills a 16x16 grid with a gradient, each row of beads
// interpolating a color between color1 and color2.
// Row 0 is color1, Row 15 is color2.
function makeGradient(color1, color2){
	// Fill in start and end colors of the gradient
	PS.color(PS.ALL, 0, color1);
	PS.color(PS.ALL, 31, color2);

	// Smoothly interpolate the rest of the gradient
	for(let i=1; i<31; i++){
		PS.color(PS.ALL, i, interpolateColors(color1, color2, i/32));
	}

}

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/

// Helpers


// Interpolates a color between two [R, G, B] colors
// and returns a [R, G, B] color
function interpolateColors(color1, color2, factor){
	// Copy color1
	let result = color1.slice();

	// Interpolate each RGB channel based on the interpolation factor
	for(let i = 0; i < 3; i++){
		result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
	}

	return result;
}

// Returns a random integer between 0 and end.
function randInt(end){
	return Math.floor(Math.random() * end);
}

// Returns a random color in the form of a [R, G, B] integer array.
function randColor(){
	return [randInt(256), randInt(256), randInt(256)];
}
