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
    let time = 30, initTime = 30, score = 0, highScore = 0, levelNum = 0;
    let gameOver = false, pathmap, animateTimer, gameTimer;
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
    let items = []

    const maps = [
        //tutorial level
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },
        //level 1
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
                1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },
        //level 2
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },
        //level 3
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },
        //level 4
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },
        //level 5
        {
            width: params.gridSize[0],
            height: params.gridSize[1],
            pixelSize: 1,
            data: [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1,
                1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ],
            data2d: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]
            ],
        },

    ]

    function drawMap() {
        let map = maps[levelNum];

        PS.gridPlane(params.planeMap)
        let i = 0;
        for (let y = 0; y < map.height; y += 1) {
            for (let x = 0; x < map.width; x += 1) {
                //PS.debug("Drawing map at " + "(" + x + ", " + y + ")\n")
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
                map.data2d[x][15-y] = data;

                i += 1;
            }
        }
        PS.gridPlane(params.planeLight);
        PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
        //PS.gridPlane(params.planeMap);
    }

    let itemParams = {
        positionX: PS.random(params.gridSize[0] - 1),
        positionY: PS.random(params.gridSize[1] - 1),
        color: PS.COLOR_BLACK,
        scale: 50,
        border: 0,
    }

    // Initialize item position
    function theItem() {
        let x = PS.random(params.gridSize[0] - 1);
        let y = PS.random(params.gridSize[1] - 1);

        // Don't spawn inside a wall bead
        while(isWall(x,y)){
            PS.debug("Spawned in wall at (" + x + ", " + y + ")\n");
            x = PS.random(params.gridSize[0] - 1);
            y = PS.random(params.gridSize[1] - 1);
        }

        itemParams.positionX = x;
        itemParams.positionY = y;
    }

    function createItem() {
        let newItem = theItem();
        items.push(newItem)
    };

    function destroyItem() {
        let newItem;
        PS.scale(itemParams.positionX, itemParams.positionY, 100);
        // delete old item
        items.splice(2, 1);
        // add in new item
        newItem = theItem();
        items.push(newItem);

        PS.border(PS.ALL, PS.ALL, 0);

    }

    function initPlayer() {
        player.id = PS.spriteSolid(1, 1);
        PS.spriteSolidColor(player.id, player.color);
        PS.spriteSolidAlpha(player.id, player.alpha);
        PS.spritePlane(player.id, params.spritePlanePlayer);
        PS.spriteMove(player.id, 8, 8);
        player.position = [8, 8];
    }

    // Player movement animation
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

        // Changes level every 5 points
    function levelChange(){
        if (score > 0){
            if (score % 5 == 0){
                levelNum = PS.random(5);
                drawMap();
            }
        }
    }
    // Moves the player to (x, y).
    // Picks up an item if one is present at (x, y).
    function playerMove(x, y) {
        if(isWall(x, y)) {
            return;
        }
        PS.spriteMove(player.id, x, y);
        player.position = [x, y];

        if (x == itemParams.positionX && y == itemParams.positionY) {
            time += 3;
            score += 1;
            if (score % 2 == 0){
                PS.audioPlay("perc_block_low",{volume:0.2})
            } else if (score % 2 == 1){
                PS.audioPlay("perc_block_high",{volume:0.2})
            }
            destroyItem();
            levelChange();
        }
    }

    // Timer
    function myTimer() {
        if (score > 0){
            if (time > 0) {
                PS.statusText("Timer:" + time + " Score:" + score + " Highscore:" + highScore);
                time -= 1;
            } else {
                if(score > highScore){
                    highScore = score;
                    PS.audioPlay("fx_tada",{volume:0.1})
                    PS.statusText("HIGHSCORE!!!")
                }else{
                    PS.audioPlay("fx_uhoh",{volume:0.2})
                    PS.statusText("Try Again")
                }

                levelNum = 0;
                drawMap();
                time = initTime;
                score = 0;
                player.path = null;

                while(isWall(player.position[0], player.position[1])){
                    if(player.position[0] >= 8){
                        playerMove(clampToGrid(player.position[0] - 1), player.position[1])
                    }
                    else{
                        playerMove(clampToGrid(player.position[0] + 1), player.position[1]);
                    }
                }
            }
        }
    }

    // Returns true if (x,y) is at a wall, false otherwise
    function isWall(x, y) {
        //PS.debug("Map data at (" + x + ", " + y + ") is " + maps[levelNum].data2d[x][y] + "\n")
        return (maps[levelNum].data2d[x][params.gridSize[1] - 1 - y] == 0);
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

        let lines = []; // ray traces
        // width of flashlight
        // (how many ray traces to do in each direction)
        let width = 8;

        // calculate angle between mouse position and player position
        // (in degrees)
        let delta_x = x - player.position[0];
        let delta_y = player.position[1] - y;
        let theta_degrees = Math.abs(Math.atan2(delta_y, delta_x) * (180 / Math.PI));

        // do flashlight ray casts based on angle of mouse cursor
        // compared to player position
        if (theta_degrees == 45 || theta_degrees == 135) {
            let newX = 0, newY = 0;
            // flashlight extends to end of grid
            if (x > player.position[0]) {
                newX = params.gridSize[0] - 1
            }
            if (y > player.position[1]) {
                newY = params.gridSize[1] - 1
            }

            // ray casts
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY)))
            for(let i=1;i<=width;i++){
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX - i), clampToGrid(newY)))
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX + i), clampToGrid(newY)))

                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY - i)))
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(newY + i)))
            }
        }
        else if (((theta_degrees > 45) && (theta_degrees < 135))) {
            let newY = 0;
            // flashlight extends to end of grid
            if (y > player.position[1]) {
                newY = params.gridSize[1] - 1
            }

            // ray casts
            lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x), newY));
            for(let i=1;i<=width;i++){
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x - i), clampToGrid(newY)))
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(x + i), clampToGrid(newY)))
            }
        }
        // pointing flashlight to the side
        else if ((theta_degrees < 45) || (theta_degrees > 135)) {
            let newX = 0;
            // flashlight extends to end of grid
            if (x > player.position[0]) {
                newX = params.gridSize[0] - 1
            }

            // ray casts
            lines.push(PS.line(player.position[0], player.position[1], newX, clampToGrid(y)));
            for (let i = 1; i <= width; i++) {
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(y - i)))
                lines.push(PS.line(player.position[0], player.position[1], clampToGrid(newX), clampToGrid(y + i)))
            }
        }

        PS.gridPlane(params.planeLight);

        // don't draw anything if no ray casts exist
        if (!lines) {
            return;
        }

        // draw the map inside the ray casts' area
        // using the level map
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                let map = maps[levelNum];
                let k = 0;

                for (let mapy = 0; mapy < map.height; mapy += 1) {
                    for (let mapx = 0; mapx < map.width; mapx += 1) {
                        let data = map.data[k];
                        let color = null;
                        if ((lines[i][j]) && (mapx == lines[i][j][0]) && (mapy == lines[i][j][1])) {
                            switch (data) {
                                case 0:
                                    color = params.wallColor;
                                    lines[i].splice(j+1);
                                    break;
                                case 1:
                                    color = params.backColor;
                                    break;
                                default:
                                    break;
                            }
                            if (color) {
                                PS.color(mapx, mapy, color);
                            }
                            if (mapx == itemParams.positionX && mapy == itemParams.positionY) {
                                PS.color(itemParams.positionX, itemParams.positionY, PS.COLOR_BLACK);
                                PS.scale(itemParams.positionX, itemParams.positionY, 50);
                                PS.border(itemParams.positionX, itemParams.positionY, 0);
                            }
                        }

                        k += 1;
                    }
                }

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
            PS.statusText("Collect the Items")

            initPlayer();
            pathmap = PS.pathMap(maps[levelNum])
            drawMap();
            gameTimer = PS.timerStart(60, myTimer);
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

            // Disable the previous flashlight
            PS.gridPlane(params.planeLight);
            PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
            PS.gridPlane(params.planeMap);
            PS.border(PS.ALL, PS.ALL, 0);
            PS.scale(PS.ALL, PS.ALL, 100);

            // Draw the flashlight again
            doFlashlight(x, y);
        },
        touch: function (x, y) {
            // PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
            let path = PS.pathFind(pathmap, player.position[0], player.position[1], x, y);
            if (path.length > 0) {
                player.pathPos = 0;
                player.path = path;
            }
            //click on Item
            // if (x == itemParams.positionX && y == itemParams.positionY) {
            //     time += 5;
            //     score += 1;
            //     destroyItem();
            // }
            // _path_print();
        },
    };
}());

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;
PS.enter = G.enter;
PS.touch = G.touch;
