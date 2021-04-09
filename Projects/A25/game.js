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
	const PLANE_SPRITE = 1;
	let sprite_player = {
		id : 0,
		x : 8,
		y : 12,
		color : PS.COLOR_BLUE,
	};
	let spriteBlocks = [];

	/* Init functions */
	function initMap(){
		let sprite_note = PS.spriteSolid(1,1);
		sprite_note = PS.spriteSolid(1,1);
		PS.spriteSolidColor(sprite_note, PS.COLOR_BLACK);
		PS.spritePlane(sprite_note, PLANE_SPRITE);
		PS.spriteMove(sprite_note, 8, 8);
	}

	/* Player functions */
	function player_move(dx, dy){
		sprite_player.x += dx;
		sprite_player.y += dy;
		PS.spriteMove(sprite_player.id, sprite_player.x, sprite_player.y);

	}

	return {
		init : function () {

			PS.gridSize(16, 16); // can change later

			PS.statusText( "Safe and (not) Sound" );

			// draw map
			initMap();

			// create a 1x1 solid player sprite
			// placed at low middle of grid
			sprite_player.id = PS.spriteSolid(1,1);
			PS.spriteSolidColor(sprite_player.id, sprite_player.color);
			PS.spritePlane(sprite_player.id, PLANE_SPRITE);
			PS.spriteMove(sprite_player.id, sprite_player.x, sprite_player.y);


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
			switch ( key ) {
				case PS.KEY_ARROW_UP:
				case 119:
				case 87: {
					player_move( 0, -1 );
					break;
				}
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					player_move( 0, 1 );
					break;
				}
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					player_move( -1, 0 );
					break;
				}
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					player_move( 1, 0 );
					break;
				}
			}
		}
	};
} () );

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;


