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

"use strict"; // Do NOT delete this directive!

const G = (function () {
    let time = 10, score = 0, myTimerID  // status bar parameters
    const params = {
        gridColor: 0x7f7f7f,
		backColor : PS.COLOR_BLACK,
		gridSize : [16,16],
        player : 0x7f7f7f,
        light : PS.COLOR_WHITE,
		statusColor : PS.COLOR_WHITE,
		spritePlanePlayer : 1
    }
    let player = {
        id: "", // sprite id
        color: params.player, // color
        position: [0, 0], // [x,y] position on map
        progress: 0, // progress towards completing level
        alpha: 255
    }

    function initPlayer(){
    	player.id = PS.spriteSolid(1,1);
    	PS.spriteSolidColor(player.id, player.color);
        PS.spriteSolidAlpha(player.id, player.alpha);
    	PS.spritePlane(player.id, params.spritePlanePlayer);
    	PS.spriteMove(player.id, 8, 8);
		player.position = [8, 8];
	}

    function myTimer() {
        if (time > 0) {
            PS.statusText("Timer:" + time);
            time -= 1;
        }
        else {
            PS.statusText("GameOver");
            PS.timerStop( myTimerID);
        }
    }


    return {
        init: function () {
            const TEAM = "teamname";

            PS.gridSize(params.gridSize[0], params.gridSize[1]);
            PS.gridColor(params.gridColor);
			PS.color(PS.ALL, PS.ALL, params.backColor);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.statusColor(params.statusColor);

			initPlayer();
            myTimerID = PS.timerStart( 60, myTimer );

            // This code should be the last thing
            // called by your PS.init() handler.
            // DO NOT MODIFY IT, except for the change
            // explained in the comment below.
            PS.dbLogin("imgd2900", TEAM, function (id, user) {
                if (user === PS.ERROR) {
                    return;
                }
                PS.dbEvent(TEAM, "startup", user);
                PS.dbSend(TEAM, PS.CURRENT, {discard: true});
            }, {active: false});
            // Change the false in the final line above to true
            // before deploying the code to your Web site.
        },
        touch: function (x, y) {
            // PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
        },
        keyDown: function (key) {
            if(key === 49){
                params.gridColor == PS.COLOR_GRAY

            }
            PS.debug( "PS.keyDown(): key=" + key + "\n" );
        },
        enter: function (x, y, data, options) {
            // Uncomment the following code line to inspect x/y parameters:

            // PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

            // Add code here for when the mouse cursor/touch enters a bead.
        },
        exit: function (x, y, data, options) {
            // Uncomment the following code line to inspect x/y parameters:

            // PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

            // Add code here for when the mouse cursor/touch exits a bead.
        },
    };
}());

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;
PS.enter = G.enter;
PS.exit = G.exit;
