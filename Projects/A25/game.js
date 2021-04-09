/*
game.js for Perlenspiel 3.3.xd
Last revision: 2021-04-08 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-21 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

// This is a template for creating PS3 apps based on IIFE architecture.
// If you use it, be sure to rename the file to game.js,
// or change the <script> tag at the bottom of game.html to reference this filename instead:
// <script src="game_iife.js"></script>

const G = ( function () {
	const PLANE_SPRITE_PLAYER = 1, PLANE_SPRITE_NOTE = 2;
	let sprite_player = {
		id : "",
		x : 8,
		y : 12,
		prevPos : [],
		color : PS.COLOR_BLUE,
	};
	let spriteNotes = [];

	/* Init functions */
	function initMap(){
		// initialize one note block
		let sprite_note = {
			id : "",
			color : PS.COLOR_BLACK,
			x : 8,
			y : 8,
			order : 1
		};
		sprite_note.id = PS.spriteSolid(1,1);
		PS.spriteSolidColor(sprite_note.id, sprite_note.color);
		PS.spritePlane(sprite_note.id, 2);
		PS.spriteMove(sprite_note.id, sprite_note.x, sprite_note.y);
		PS.spriteCollide(sprite_note.id, event_note_collide);

		spriteNotes.push(sprite_note);
		//console.log(spriteNotes);
	}

	/* Player functions */
	function sprite_move(spriteObj, dx, dy){
		if(spriteObj.id === sprite_player.id){
			sprite_player.prevPos[0] = spriteObj.x;
			sprite_player.prevPos[1] = spriteObj.y;

			//PS.debug(sprite_player.prevPos + "\n")
		}
		spriteObj.x += dx;
		spriteObj.y += dy;
		PS.spriteMove(spriteObj.id, spriteObj.x, spriteObj.y);

	}

	/* Note functions */
	function event_note_collide(s1, p1, s2, p2, type){
		// if overlapped with player, move one square forward
		// opposite of the pushing direction
		if(s2 === sprite_player.id){
			// check type
			if(type === PS.SPRITE_OVERLAP){
				let spriteObj = null;
				// find the note object with matching sprite
				for(let i=0;i<spriteNotes.length;i++){
					let curSprite = spriteNotes[i];
					if(curSprite.id === s1){
						spriteObj = curSprite;
					}
				}
				if(spriteObj == null){return;}

				//PS.debug("player pushed " + spriteObj.id + "\n")

				// check which edge the player is pushing
				//PS.debug("Player position: (" + sprite_player.x + " , " +
				//sprite_player.y + ")\n");

				let prevx = sprite_player.prevPos[0];
				let prevy = sprite_player.prevPos[1];

				if((prevx == spriteObj.x) && (prevy < spriteObj.y)){
					// player pushing from above
					//PS.debug("moving down\n")
					console.log(spriteObj);
					sprite_move(spriteObj, 0, 1);
				}
				else if((prevx < spriteObj.x) && (prevy === spriteObj.y)){
					// player pushing from immediate left
					sprite_move(spriteObj, 1, 0);
				}
				else if((prevx === spriteObj.x) && (prevy > spriteObj.y)){
					// player pushing from below
					sprite_move(spriteObj, 0, -1);
				}
				else if((prevx > spriteObj.x) && (prevy === spriteObj.y)){
					// player pushing from immediate right
					sprite_move(spriteObj, -1, 0);
				}



			}

		}

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
			PS.spritePlane(sprite_player.id, PLANE_SPRITE_PLAYER);
			PS.spriteMove(sprite_player.id, sprite_player.x, sprite_player.y);


			// Change this TEAM constant to your team name,
			// using ONLY alphabetic characters (a-z).
			// No numbers, spaces, punctuation or special characters!

			const TEAM = "notadog";

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
					// PS.debug("Player sprite id =  " + sprite_player.id + "\n");
					sprite_move(sprite_player, 0, -1 );
					break;
				}
				case PS.KEY_ARROW_DOWN:
				case 115:
				case 83: {
					sprite_move(sprite_player,0, 1 );
					break;
				}
				case PS.KEY_ARROW_LEFT:
				case 97:
				case 65: {
					sprite_move(sprite_player, -1, 0 );
					break;
				}
				case PS.KEY_ARROW_RIGHT:
				case 100:
				case 68: {
					sprite_move(sprite_player, 1, 0 );
					break;
				}
			}
		}
	};
} () );

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;