/*
game_iife.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)
*/

"use strict";

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

// This is a template for creating PS3 apps based on IIFE architecture.
// If you use it, be sure to rename the file to game.js,
// or change the <script> tag at the bottom of game.html to reference this filename instead:
// <script src="game_iife.js"></script>

const G = ( function () {
	return {
		init : function () {
			// Uncomment the following code line
			// to verify operation:

			// PS.debug( "PS.init() called\n" );

			// This function should normally begin
			// with a call to PS.gridSize( x, y )
			// where x and y are the desired initial
			// dimensions of the grid.
			// Call PS.gridSize() FIRST to avoid problems!
			// The sample call below sets the grid to the
			// default dimensions (8 x 8).
			// Uncomment the following code line and change
			// the x and y parameters as needed.

			// PS.gridSize( 8, 8 );

			// This is also a good place to display
			// your game title or a welcome message
			// in the status line above the grid.
			// Uncomment the following code line and
			// change the string parameter as needed.

			// PS.statusText( "Game" );

			// Add any other initialization code you need here.

			// Change this TEAM constant to your team name,
			// using ONLY alphabetic characters (a-z).
			// No numbers, spaces, punctuation or special characters!

			const TEAM = "teamname";

			// This code should be the last thing
			// called by your PS.init() handler.
			// DO NOT MODIFY IT, except for the change
			// explained in the comment below.

			PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
				if ( user === PS.ERROR ) {
					return;
				}
				PS.dbEvent( TEAM, "startup", user );
				PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
			}, { active : false } );

			// Change the false in the final line above to true
			// before deploying the code to your Web site.
		},
		touch : function ( x, y ) {
			// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
		},
		keyDown : function ( key ) {
			// PS.debug( "PS.keyDown(): key=" + key + "\n" );
		}
	};
} () );

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;

PS.dbLogin( "imgd2900", TEAM, function ( id, user ) {
	if ( user === PS.ERROR ) {
		return;
	}
	PS.dbEvent( TEAM, "startup", user );
	PS.dbSend( TEAM, PS.CURRENT, { discard : true } );
}, { active : false } );
