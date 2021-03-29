/*
Oliver Rayner
Team Not A Dog
MOD 1: Changed the gridsize to 10x10
MOD 2: Made the grid represent piano pitches by shapes in case color is not visible
or if viewer is color blind
MOD 3: Made the color change in orientation to x-axis to show another way of piano pitch
MOD 4: Created random titles that give number hints to the player
MOD 5: Made the gridcolor a royal red color
MOD 6: Made the title a cream color
MOD 7: Added a volume tracker based on y-axis
MOD 8: Gave the borders a starting yucky color
MOD 9: Allowed for the player to clean up the yucky color with black borders
*/

/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // do not remove this directive!

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

	// Specific red color for organization
    const ROYAL_RED = 0xAB2330;

	// Specific yellow color for organization
	const YUCKY_YELLOW = 0xC4BA45;

	// Specific cream color for organization
	const CREAM = 0xFFFDD0;

	// Array storing title hint names 
	const STATUSTITLE = ["1.) Shift + Reload to Get Hint","2.) Play some Music",
	"3.) Volume is the border","4.) Pitch is the shape",
	"5.) Click to color","6.) Release to erase",
	"7.) SPACE loathes exit unlike","8.) ENTER Will get rid of SPACE","9.) Clean up BSlime", "10.) Make Something New"]

    // Random number generator for Title length
	var rando = PS.random( STATUSTITLE.length - 1 );

	// Set grid size to 10 x 10 beads
	PS.gridSize( 10, 10 );
	
	// Makes grid color red
	PS.gridColor( ROYAL_RED );
	
	// Makes the border color an off putting yellow
	PS.borderColor( PS.ALL, PS.ALL, YUCKY_YELLOW )
	
    // Makes the title a relaxing cream color
	PS.statusColor( CREAM );

	// Creates a random hint in title
	PS.statusText( STATUSTITLE[rando] );
	
	// Places the radius circles on the row
	var xr = -1;

	// Alters the radius of each bead going left to right
	var yr = -5;

	// Sets up beads from spuares to left to circles to right
	for (let i=0; i<10; i += 1)
	{
		PS.radius(xr += 1, PS.ALL, yr += 5 );
	}
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
	
    // Establishes red starting value
	const CSR = 74;

	// Establishes green starting value
	const CSG = 177;

	// Establishes blue starting value
	const CSB = 255;

	// Changes clicked bead color by x value
	PS.color (x, y, ((x * 20.111) + CSR), ((x * -2.777) + CSG), ((x * -28.222) + CSB));

	// Reverse functionality on y-axis
    var tenReversedY = ((y - 9) * -1)

	// Changes pitch depending on x-axis (left to right)
	var soundArea = (x * 8.8);

	// Changes volume depending on y-axis (bottom to top)
	var volumeCheck = (tenReversedY * .1);

	// Plays piano with pitch on x-axis and volume on y-axis
	PS.audioPlay( PS.piano( soundArea), {volume: volumeCheck});
};

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


PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Reverts bead back to white when released on a color bead
	PS.color(x,y,PS.COLOR_WHITE);
};


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



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Reverses the y-axis functionality
	var tenReversedY = ((y-9)*-1);
	
	// Creates a border color when entering a bead
	PS.borderColor(x,y,PS.COLOR_BLACK)

	// Changes width of border based on height (bottom to top)
	PS.border(x,y,(tenReversedY*.8))
};


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



PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Reverts border of bead to 1 on exit
	PS.border(x,y,1);
};


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

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Arrays used for storing glyphs for beads
	const ENTER = ["E", "N", "T", "E", "R"];
	const SPACE = ["S", "P", "A", "C", "E"]; 

	// Sets up enter on screen in left half when enter is pressed
	if (key == PS.KEY_ENTER){
		for (let i = 0; i < ENTER.length; i += 1) {
			PS.glyph(i,PS.ALL,ENTER[i]);
		}
	}

	// Sets up space on screen in right half when spacebar is pressed
	if (key == PS.KEY_SPACE){
		for (let j = 5; j < 10; j += 1) {
			PS.glyph(j,PS.ALL,SPACE[j-5]);
		}
	}
};


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


PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!



	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// gets rid of the space glyphs when enter is released
	if (key == PS.KEY_ENTER){
			PS.glyph(PS.ALL,PS.ALL, 0);
	}
	
};

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
