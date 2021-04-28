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
    // status bar parameters
    let time = 10, score = 0, gameTimer, gameOver = false;
    let levelNum = 0, pathmap, animateTimer;
    // constants
    const params = {
        gridColor: 0x7f7f7f,
        backColor: 0x424242,
        wallColor: PS.COLOR_WHITE,
        gridSize: [16, 16],
        player: 0x7f7f7f,
        light: PS.COLOR_WHITE,
        statusColor: PS.COLOR_WHITE,
        planeMap: 4,
        spritePlanePlayer: 1,
        spritePlaneTreasure: 3,
        planeLight: 0,
    }
    let player = {
        id: "", // sprite id
        color: params.player, // color
        position: [0, 0], // [x,y] position on map
        progress: 0, // progress towards completing level
        alpha: 255,
        path: null,
        pathPos: 0,
    }

    let item = {
        color: PS.COLOR_GREY,
        postionX: 0,
        positionY: 0,
    }

    const maps = [
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ]
        },
    ]

    function drawMap() {
        let map = maps[levelNum];

        PS.gridPlane(params.planeMap)
        let i = 0;
        for (let y = 0; y < map.height; y += 1) {
            for (let x = 0; x < map.width; x += 1) {
                let data = map.data[i];
                let color;
                switch (data) {
                    case 0:
                        color = params.wallColor;
                        break;
                    case 1:
                        color = params.backColor;
                        break;
                    default:
                        break;
                }
                PS.color(x, y, color);
                i += 1;
            }
        }
        PS.gridPlane(params.planeLight);
        PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
        //PS.gridPlane(params.planeMap);
    }

    function createItem(){
        item.positionX = PS.random(params.gridSize[0] - 1);
        item.positionY = PS.random(params.gridSize[1] - 1);
        PS.color(item.postionX,item.positionY,item.color);
        PS.scale(item.positionX,item.positionY,50)
    }

    function initPlayer(){
        player.id = PS.spriteSolid(1,1);
        PS.spriteSolidColor(player.id, player.color);
        PS.spriteSolidAlpha(player.id, player.alpha);
        PS.spritePlane(player.id, params.spritePlanePlayer);
        PS.spriteMove(player.id, 8, 8);
        player.position = [8, 8];
    }

    function playerAnimate() {
        if (player.path) {
            let point = player.path[player.pathPos];
            let x = point[0];
            let y = point[1];
            if (isWall(x, y)) {
                player.path = null;
                player.pathPos = 0;
                return;
            }
            playerMove(x, y);
            player.pathPos += 1;
            if (player.pathPos >= player.path.length) {
                player.path = null;
            }
        }
    }

    function playerMove(x, y) {
        if (isWall(x, y)) {
            return;
        }
        PS.spriteMove(player.id, x, y);
        player.position = [x, y];
    }

    function myTimer() {
        if (time > 0) {
            PS.statusText("Timer:" + time + " Score:" + score) ;
            time -= 1;
        } else {
            PS.statusText("GameOver");
            PS.timerStop(gameTimer);
        }
    }

    function isWall(x, y) {
        return (maps[levelNum].data[x][y] == 0);
    }

    // Clamps a number to be within the grid size parameters.
    // Assumes a square grid size (4x4, 8x8, 16x16, etc.)
    function clampToGrid(num) {
        if (num >= params.gridSize[0]) {
            return params.gridSize[0] - 1;
        } else if (num < 0) {
            return 0;
        }
        return num;
    }

    // Flashlight effect
    function doFlashlight(x, y) {
        if ((x == player.position[0]) && (y == player.position[1])) {
            return;
        }

        let lines = [];
        let delta_x = x - player.position[0];
        let delta_y = player.position[1] - y;
        let theta_degrees = Math.abs(Math.atan2(delta_y, delta_x) * (180 / Math.PI));
        //PS.debug(Math.abs(theta_degrees) + "\n");
        // pointing flashlight up/down straight
        //if (Math.abs(player.position[0] - x) <= 1) {
        if (theta_degrees == 45 || theta_degrees == 135) {
            let newX = 0, newY = 0;
            if (x > player.position[0]) {
                newX = params.gridSize[0] - 1
            }
            if (y > player.position[1]) {
                newY = params.gridSize[1] - 1
            }
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX-1), clampToGrid(newY)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX-2), clampToGrid(newY)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX+1), clampToGrid(newY)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX+2), clampToGrid(newY)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY-1)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY-2)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY+1)))
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY+2)))

            //PS.debug("edge case \n")
        } else if (((theta_degrees > 45) && (theta_degrees < 135))) {
            let newY = 0;
            if (y > player.position[1]) {
                newY = params.gridSize[1] - 1
            }
            //PS.debug("same y \n")
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x), newY));
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x + 1), newY));
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x + 2), newY));
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x - 1), newY));
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x - 2), newY));
        }
            // pointing flashlight to the side
        //else if (Math.abs(player.position[1] - y) <= 2) {
        else if ((theta_degrees < 45) || (theta_degrees > 135)) {
            let newX = 0;
            if (x > player.position[0]) {
                newX = params.gridSize[0] - 1
            }
            //PS.debug("same y \n")
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y)));
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y - 1)));
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y - 2)));
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y + 1)));
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y + 2)));
        }
        // pointing flashlight up/down at an angle

        PS.gridPlane(params.planeLight);
        if (!lines) {
            return;
        }
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                //PS.debug("Drawing on plane " + plane + "\n");
                //PS.color(lines[i][j][0], lines[i][j][1], PS.COLOR_WHITE);
                let map = maps[levelNum];
                let k = 0;

                for (let mapy = 0; mapy < map.height; mapy += 1) {
                    for (let mapx = 0; mapx < map.width; mapx += 1) {
                        let data = map.data[k];
                        let color = null;
                        if ((mapx == lines[i][j][0]) && (mapy == lines[i][j][1])) {

                            switch (data) {
                                case 0:
                                    color = params.wallColor;
                                    break;
                                case 1:
                                    color = params.backColor;
                                    break;
                                default:
                                    break;
                            }
                            if (color) {
                                //PS.gridPlane(params.planeLight);
                                PS.color(mapx, mapy, color);
                            }

                        }


                        k += 1;
                    }
                }

                //PS.alpha(PS.ALL, PS.ALL, 128);
            }
        }
    }


    return {
        init: function () {
            const TEAM = "notadog";

            PS.gridSize(params.gridSize[0], params.gridSize[1]);
            PS.gridColor(params.gridColor);
            PS.border(PS.ALL, PS.ALL, 0);
            PS.statusColor(params.statusColor);

            initPlayer();
            pathmap = PS.pathMap(maps[levelNum])
            drawMap();
            gameTimer = PS.timerStart( 60, myTimer );
			animateTimer = PS.timerStart(6, playerAnimate);
            createItem();
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
        keyDown: function (key) {
            // PS.debug("PS.keyDown(): key=" + key + "\n");
        },
        enter: function (x, y, data, options) {
            // Uncomment the following code line to inspect x/y parameters:

            // PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

            // Add code here for when the mouse cursor/touch enters a bead.

            if (((x >= 0) && (y >= 0)) && ((x < params.gridSize[0]) && (y < params.gridSize[1]))) {
                doFlashlight(x, y);
            }


        },
        exit: function (x, y, data, options) {
            // Uncomment the following code line to inspect x/y parameters:

            // PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

            // Add code here for when the mouse cursor/touch exits a bead.
            PS.gridPlane(params.planeLight);
            PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
            PS.gridPlane(params.planeMap);
        },
        touch: function (x, y) {
            // PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
            let path = PS.pathFind(pathmap, player.position[0], player.position[1], x, y);
            if (path.length > 0) {
                player.pathPos = 0;
                player.path = path;
            }
            //click on Item
            if (x === item.positionX && y === item.positionY) {
                time += 5;
                score += 1;
                createItem();
            }
            // _path_print();
        },
    };
}());

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;
PS.enter = G.enter;
PS.exit = G.exit;
PS.touch = G.touch;
