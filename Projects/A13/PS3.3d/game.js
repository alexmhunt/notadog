/*
game.js for Perlenspiel 3.3.x
Last revision: 2021-03-24 (BM)

The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT delete this directive!

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/


let toyParams = {
	square : 20,
	lasers : [], // array of laser objects
	fadeRate : 60,
}

function randomColor(){
	let theColors = [0xFF0000,PS.COLOR_BLACK,PS.COLOR_YELLOW,PS.COLOR_RED,PS.COLOR_GREEN];
	let j = PS.random(5) - 1;
	return theColors[j]; 
}
// Animates all lasers
function animate(){
	let len = toyParams.lasers.length;
	let i = 0;

	function bounce(laser, x, y){

		if(x > (toyParams.square - 1) || x < 0) {
			laser.heading = -laser.heading;
		}
		if(y > (toyParams.square - 1)){
			laser.heading += laser.heading * 2;
		}
		if (y < 0){
			laser.heading -= 90;
		}

	}
	// Resets a bead's alpha to max and color to black.
	function resetBead(x, y){
		PS.alpha(x, y, 255);
		PS.color(x, y, PS.COLOR_BLACK);
	}
	// Clamps val to be in the range [min, max].
	function clamp(val, min, max){
		if(val > max){ val = max;}
		else if (val < min){ val = min;}
		return val;
	}

	// loop through all drops, moving each
	// according to its heading
	while (i < len){
		let laser = toyParams.lasers[i];
		let x = laser.position.x, y = laser.position.y;

		// Kill laser once its lifetime ends
		if (laser.lifetime === 0){
			// PS.debug("deleting sprite at " + x + " , " + y + "\n")
			PS.spriteDelete(laser.sprite);
			PS.audioPlay("fx_bloink",{volume:0.1});

			resetBead(laser.position.x, laser.position.y);

			// remove from lasers array
			toyParams.lasers.splice(i , 1);
			len -= 1; // keep loop in sync


		}
		else{ // Laser gets to live...for now, so move it


			// enable fade again for the
			// bead the laser is exiting
			PS.fade(x, y, toyParams.fadeRate);

			// calculate expected position based on laser's heading angle
			let prevPos = [x, y];
			let deltaX = Math.round(1 * Math.sin((laser.heading * Math.PI/180)));
			let deltaY = Math.round(1 * Math.cos((laser.heading * Math.PI/180)));
			//PS.debug(deltaX + " , " + deltaY + "\n");
			if(laser.heading < 0){ // negative angle
				// negated because sin and cos only return values from [0,1]
				x -= -1 * deltaX;
				y -= -1 * deltaY;
			}
			else if (laser.heading > 0){ // positive angle
				x += deltaX;
				y += deltaY;
			}


			// Bounce laser if it reached one of the edges
			if((x > (toyParams.square - 1)) || (y > (toyParams.square - 1)) || (x < 0) || (y < 0)){
				PS.audioPlay("fx_chirp2");
				bounce(laser, x, y);
			}

			x = clamp(x,0, (toyParams.square - 1));
			y = clamp(y,0, (toyParams.square - 1));

			//PS.debug("x = " + x + " y = " + y + "\n");
			//PS.debug("moving sprite from " + prevPos[0] + " , " + prevPos[1] + "\n");
			//PS.debug("moving sprite to " + x + " , " + y + "\n");
			PS.fade(x, y, 0); // temporarily disable fade

			laser.position = PS.spriteMove(laser.sprite, x, y);


			// reset color of previous position to black
			if((prevPos[0] != x) || (prevPos[1] != y)){
				resetBead(prevPos[0], prevPos[1]);
			}
			laser.lifetime -= 1;
			i += 1;
		}






	}
}

PS.init = function( system, options ) {
	// Change this string to your team name
	// Use only ALPHABETIC characters
	// No numbers, spaces or punctuation!

	const TEAM = "NotaDOG";

	// Begin with essential setup
	// Establish initial grid size

	PS.gridSize( toyParams.square, toyParams.square ); // or whatever size you want

	PS.statusColor(0xFFFDD0);
	PS.gridColor(0x08041F);

	PS.statusText("Lightshow Toy");
	// Install additional initialization code
	// here as needed

	// set up base color and fader, remove borders
	PS.color(PS.ALL,PS.ALL,PS.COLOR_BLACK);
	PS.fade(PS.ALL,PS.ALL,toyParams.fadeRate);
	PS.borderColor(PS.ALL,PS.ALL,0);
	PS.timerStart(5, animate);

	// PS.dbLogin() must be called at the END
	// of the PS.init() event handler (as shown)
	// DO NOT MODIFY THIS FUNCTION CALL
	// except as instructed

	PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
		if ( user === PS.ERROR ) {
			return;
		}
		PS.dbEvent( TEAM, "startup", user );
		PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
	}, { active : true } );
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
	// created sprite
	let laser = {
		sprite : null,
		color : 0,
		position : [],
		heading : 45, // in degrees
		lifetime : 60 // in ticks
	};

	PS.audioPlay("fx_shoot4",{volume:.25}); // laser sound on click

	// Create laser at the clicked point
	// PS.color(x,y,PS.COLOR_RED);
	PS.fade(x, y, 0); // temporarily disable fade
	laser.sprite = PS.spriteSolid(1,1); // create sprite
	laser.position = PS.spriteMove(laser.sprite, x, y); // place sprite
	laser.color = PS.spriteSolidColor(laser.sprite, randomColor()); // set sprite color

	toyParams.lasers.push(laser);

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
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

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
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

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
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

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
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

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

	//	 var device = sensors.wheel; // check for scroll wheel
	//
	//	 if ( device ) {
	//	   PS.debug( "PS.input(): " + device + "\n" );
	//	 }

	// Add code here for when an input event is detected.
};

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

PS.shutdown = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

