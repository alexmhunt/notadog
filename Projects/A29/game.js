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
	const gridDimensions = {
		gridX : 16,
		gridY : 16,
		colorOfGrid : 0x101215,
		groundColor : 0x424242,
		wallColor : PS.COLOR_BLACK,
		textColor : PS.COLOR_YELLOW,
		noteColor : PS.COLOR_RED,
		enemyColor : PS.COLOR_WHITE,
		noteColorRed : [0xfbe9e9,0xf8d3d3,0xf4bdbd,0xf1a7a7,0xed9191,
		                0xe97b7b,0xe66565,0xe24f4f,0xdf3939,0xc52020,
					    0x991919,0x831515,0x6e1212,0x580e0e,0x420b0b],
		noteColorOrange : [0xf2d6bf,0xeec9aa,0xeabb95,0xe5ad7f,0xe1a06a,
		                   0xdd9255,0xd88d3f,0xbf6b26,0xaa5f22,0x94531d,
						   0x7f4719,0x6a3c15,0x553011,0x40240d,0x2a1808],
		noteColorBlue : [0xeae9fd,0xd6d2fa,0xada6f5,0x9890f3,0x8379f0,
		                 0x6f63ee,0x5a4deb,0x4636e9,0x2c1dcf,0x271ab8,
						 0x2216a1,0x1d138a,0x191073,0x140d5c,0x0f0a45],
		noteColorGreen : [0xc0f0d6,0xabebc9,0x96e6bb,0x81e0ad,0x6cdba0,
						  0x57d692,0x42d185,0x29b86b,0x24a35f,0x1f8f53,
	                      0x1b7a47,0x17663c,0x125230,0x0e3d24,0x092918]
	};
	const maps = [
		// level 0 map
		{
			width: gridDimensions.gridX,
			height: gridDimensions.gridY,
			pixelSize : 1,
			data:[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]
		},
		// level 1 map
		{
			width: gridDimensions.gridX,
			height: gridDimensions.gridY,
			pixelSize : 1,
			data:[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]
		},
		// level 2 map
		{
			width: gridDimensions.gridX,
			height: gridDimensions.gridY,
			pixelSize : 1,
			data:[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]
		},
		// level 3 map
		{
			width: gridDimensions.gridX,
			height: gridDimensions.gridY,
			pixelSize : 1,
			data:[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
				0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]
		},
		// level 4 map
		{
			width: gridDimensions.gridX,
			height: gridDimensions.gridY,
			pixelSize : 1,
			data:[
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			]
		},
	];
	const PLANE_SPRITE_PLAYER = 1, PLANE_SPRITE_NOTE = 2, PLANE_SPRITE_ENEMY = 3;
	const solutions = [[54], [84,84,84,84], [66,54,42,54], [72,66,54,30]];
	let sprite_player = {
		id : "",
		x : 8,
		y : 12,
		prevPos : [],
		color : 0xFF600,
	};
	let spriteNotes = [], spriteEnemies = [];
	let pathmap, currentLevel = 0, isPlaying = false;

	// object prototypes
	function noteBlock(xPos, yPos, playSound, orderNum){
		this.id = PS.spriteSolid(1,1);
		this.color = 0;
		this.x = xPos;
		this.y = yPos;
		this.sound = playSound;
		this.pitch = ((this.y - gridDimensions.gridY) * -1) * 6;
		this.order = orderNum;
		this.fading = false;

		PS.spritePlane(this.id, PLANE_SPRITE_NOTE);
		PS.spriteMove(this.id, this.x, this.y);
		PS.spriteCollide(this.id, event_note_collide);
		spriteNotes.push(this);

	}
	function enemy(xPos, yPos, myMessage){
		this.id = PS.spriteSolid(1,1);
		this.color = gridDimensions.enemyColor;
		this.x = xPos;
		this.y = yPos;
		this.message = myMessage;

		PS.spritePlane(this.id, PLANE_SPRITE_ENEMY);
		PS.spriteMove(this.id, this.x, this.y);
		PS.spriteCollide(this.id, event_enemy_collide);
		PS.spriteSolidColor(this.id, this.color);
		spriteEnemies.push(this);
	}

	/* Level init functions */
	function initLevel(){
		switch(currentLevel){
			case 0:
				initLevel0();
				break;
			case 1:
				initLevel1();
				break;
			case 2:
				initLevel2();
				break;
			case 3:
				initLevel3();
				break;
			case 4:
				initLevel4();
				break;
			default:
				break;
		}
	}

	async function nextLevel(){
		await sleep(2000);
		// reset variables
		PS.fade(PS.ALL, PS.ALL, PS.DEFAULT)
		for(let i = 0; i < spriteNotes.length; i++){
			PS.spriteDelete(spriteNotes[i].id);
			//spriteNotes[i].id = null;
		}
		for(let i = 0; i < spriteEnemies.length; i++){
			PS.spriteDelete(spriteEnemies[i].id);
		}



		spriteNotes = [], spriteEnemies = [];
		currentLevel += 1;
		isPlaying = false;
		PS.statusText( "H to listen, Space to play" );

		if(currentLevel > maps.length+1){
			PS.statusText("Congratulations, you're free now!")
			return;
		}
		else{
			initLevel();
		}
	}

	// tutorial level
	function initLevel0(){
		// initialize your note blocks here

		let lvl0note1 = new noteBlock( 8, 9, "testsound", 1);

		// note: you need to initialize color after the first function call so that PS.spriteSolidColor() works
		lvl0note1.color = PS.spriteSolidColor(lvl0note1.id, gridDimensions.noteColorRed[lvl0note1.y]);

		pathmap = PS.pathMap(maps[0]);

		drawMap(maps[0]);
		//console.log(spriteNotes);
	}
	function initLevel1(){
		// initialize your note blocks here
		drawMap(maps[1]);
		let lvl1note1 = new noteBlock( 8, 11, "testsound", 1);
		let lvl1note2 = new noteBlock( 8, 9, "testsound", 2);
		let lvl1note3 = new noteBlock( 8, 6, "testsound", 3);
		let lvl1note4 = new noteBlock( 8, 2, "testers", 4);
		// note: you need to initialize color after the first function call so that PS.spriteSolidColor() works
		//PS.debug(lv1note1.id + "\n")
		lvl1note1.color = PS.spriteSolidColor(lvl1note1.id, gridDimensions.noteColorRed[lvl1note1.y]);

		lvl1note2.color = PS.spriteSolidColor(lvl1note2.id, gridDimensions.noteColorOrange[lvl1note2.y]);

		lvl1note3.color = PS.spriteSolidColor(lvl1note3.id, gridDimensions.noteColorBlue[lvl1note3.y]);

		lvl1note4.color = PS.spriteSolidColor(lvl1note4.id, gridDimensions.noteColorGreen[lvl1note4.y]);

		pathmap = PS.pathMap(maps[1]);

		PS.spriteMove(sprite_player.id, 10, 13);
		sprite_player.prevPos = [10, 13];
		sprite_player.x = 10, sprite_player.y = 13;


		//console.log(spriteNotes);
	}

	function initLevel2(){
		// initialize your note blocks here
		drawMap(maps[2]);
		let lvl2note1 = new noteBlock( 4, 8, "testsound", 1);
		let lvl2note2 = new noteBlock( 6, 8, "testsound", 2);
		let lvl2note3 = new noteBlock( 8, 8, "testsound", 3);
		let lvl2note4 = new noteBlock( 10, 8, "testers", 4);
		// note: you need to initialize color after the first function call so that PS.spriteSolidColor() works
		//PS.debug(lv1note1.id + "\n")
		lvl2note1.color = PS.spriteSolidColor(lvl2note1.id, gridDimensions.noteColorRed[lvl2note1.y]);

		lvl2note2.color = PS.spriteSolidColor(lvl2note2.id, gridDimensions.noteColorOrange[lvl2note2.y]);

		lvl2note3.color = PS.spriteSolidColor(lvl2note3.id, gridDimensions.noteColorBlue[lvl2note3.y]);

		// create one enemy
		let enemy1 = new enemy(14, 1,
			"\"No one escapes Musi City!\"");

		lvl2note4.color = PS.spriteSolidColor(lvl2note4.id, gridDimensions.noteColorGreen[lvl2note4.y]);

		pathmap = PS.pathMap(maps[2]);

		PS.spriteMove(sprite_player.id, 10, 13);
		sprite_player.prevPos = [10, 13];
		sprite_player.x = 10, sprite_player.y = 13;


		//console.log(spriteNotes);
	}

	function initLevel3(){
		// initialize your note blocks here
		pathmap = PS.pathMap(maps[3]);
		drawMap(maps[3]);

		let lvl3note1 = new noteBlock(5, 9, "testsound", 1);
		let lvl3note2 = new noteBlock( 11, 10, "testsound", 2);
		let lvl3note3 = new noteBlock( 12, 5, "testsound", 3);
		let lvl3note4 = new noteBlock( 4, 3, "testers", 4);
		// note: you need to initialize color after the first function call so that PS.spriteSolidColor() works
		lvl3note1.color = PS.spriteSolidColor(lvl3note1.id, gridDimensions.noteColorRed[lvl3note1.y]);

		lvl3note2.color = PS.spriteSolidColor(lvl3note2.id, gridDimensions.noteColorOrange[lvl3note2.y]);

		lvl3note3.color = PS.spriteSolidColor(lvl3note3.id, gridDimensions.noteColorBlue[lvl3note3.y]);

		// create multiple enemies
		let enemy1 = new enemy(2, 5,"\"What's wrong little cube!\"");
		let enemy2 = new enemy(8, 11,"\"Why did you bump into me!\"");
		let enemy3 = new enemy(11, 6,"\"The city breathes leave!\"");
		let enemy4 = new enemy(14, 14,"\"No one escapes Musi City!\"");

		lvl3note4.color = PS.spriteSolidColor(lvl3note4.id, gridDimensions.noteColorGreen[lvl3note4.y]);

		//sprite_player.id = PS.spriteSolid(1,1);
		//PS.spriteSolidColor(sprite_player.id, sprite_player.color);
		//PS.spritePlane(sprite_player.id, PLANE_SPRITE_PLAYER);
		// init player to desired position
		PS.spriteMove(sprite_player.id, 10, 13);
		sprite_player.prevPos = [10, 13];
		sprite_player.x = 10, sprite_player.y = 13;

		//console.log(spriteNotes);
	}
	function initLevel4(){
		// initialize your note blocks here
		pathmap = PS.pathMap(maps[4]);
		drawMap(maps[4]);

		// create multiple siblings
		let enemy1 = new enemy(1, 1,"\"What's wrong little cube!\"");
		let enemy2 = new enemy(2, 9,"\"Why did you bump into me!\"");
		let enemy3 = new enemy(4, 11,"\"The city breathes leave!\"");
		let enemy4 = new enemy(5, 4,"\"No one escapes Musi City!\"");
		let enemy5 = new enemy(7, 12,"\"What's wrong little cube!\"");
		let enemy6 = new enemy(9, 4,"\"Why did you bump into me!\"");
		let enemy7 = new enemy(10, 11,"\"The city breathes leave!\"");
		let enemy8 = new enemy(12, 9,"\"No one escapes Musi City!\"");
		let enemy9 = new enemy(14, 1,"\"What's wrong little cube!\"");
		// create the mama
		let enemy12 = new enemy(6, 7,"\"Welcome Home Child!\"");
		let enemy13 = new enemy(7, 7,"\"Welcome Home Child!\"");
		let enemy14 = new enemy(8, 7,"\"Welcome Home Child!\"");
		let enemy15 = new enemy(6, 8,"\"Welcome Home Child!\"");
		let enemy16 = new enemy(7, 8,"\"Welcome Home Child!\"");
		let enemy17 = new enemy(8, 8,"\"Welcome Home Child!\"");
		let enemy18 = new enemy(6, 9,"\"Welcome Home Child!\"");
		let enemy19 = new enemy(7, 9,"\"Welcome Home Child!\"");
		let enemy20 = new enemy(8, 9,"\"Welcome Home Child!\"");

		//sprite_player.id = PS.spriteSolid(1,1);
		//PS.spriteSolidColor(sprite_player.id, sprite_player.color);
		//PS.spritePlane(sprite_player.id, PLANE_SPRITE_PLAYER);
		// init player to desired position
		PS.spriteMove(sprite_player.id, 9, 14);
		sprite_player.prevPos = [9, 14];
		sprite_player.x = 9, sprite_player.y = 14;

		//console.log(spriteNotes);
	}

	// draw the base map grid
	// can be used for any level
	function drawMap(map){
		let i = 0;
		for ( let y = 0; y < map.height; y += 1 ) {
			for ( let x = 0; x < map.width; x += 1 ) {
				let data = map.data[ i ];
				let color;
				switch ( data ) {
					case 0:
						color = gridDimensions.wallColor;
						break;
					case 1:
						color = gridDimensions.groundColor;
						break;
					default:
						color = gridDimensions.colorOfGrid;
						break;
				}
				PS.color( x, y, color );
				i += 1;
			}
		}
	}

	// Moves a sprite
	function sprite_move(spriteObj, dx, dy){
		let player = false;
		if(spriteObj.id === sprite_player.id){player = true;}

		if(player){
			sprite_player.prevPos[0] = spriteObj.x;
			sprite_player.prevPos[1] = spriteObj.y;

			let adjacent = player_note_adjacent()
			if((adjacent != null) && adjacent.fading){
				return;
			}
		}
		//PS.fade(spriteObj.x, spriteObj.y, 0)

		if(isWall((spriteObj.x + dx), (spriteObj.y + dy))){
			return;
		}

		// only move if the move won't put the sprite out of grid bounds
		spriteObj.x += dx;
		spriteObj.y += dy; 
		PS.spriteMove(spriteObj.id, spriteObj.x, spriteObj.y);

		if(spriteObj.id != sprite_player.id){
			//PS.debug("note at " + spriteObj.y + "\n")
			spriteObj.pitch = ((spriteObj.y - gridDimensions.gridY) * -1) * 6;
			PS.audioPlay(PS.piano(spriteObj.pitch));
			note_color_change(spriteObj);
		}
		//PS.debug(spriteObj.y + "\n")
	}

	function player_note_adjacent(){
		for(let i=0; i<spriteNotes.length;i++){
			let note = spriteNotes[i];
			if((note.x == sprite_player.x) && ((note.y == sprite_player.y + 1) || note.y == sprite_player.y -1) ||
				(note.y == sprite_player.y) && ((note.x == sprite_player.x + 1) || note.x == sprite_player.x -1)){
				//PS.debug("true\n")
				return note;
			}
		}

		return null;
	}

	/* Collision */
	// note block collison
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

				PS.fade(spriteObj.x, spriteObj.y, PS.DEFAULT);
				note_color_change(spriteObj)

				//PS.debug("player pushed " + spriteObj.id + "\n")

				// check which edge the player is pushing
				//PS.debug("Player position: (" + sprite_player.x + " , " +
				//PS.debug(sprite_player.y + ")\n");

				let prevx = sprite_player.prevPos[0];
				let prevy = sprite_player.prevPos[1];


				if((prevx == spriteObj.x) && (prevy < spriteObj.y)){
					// player pushing from above
					if(isWall(spriteObj.x, (spriteObj.y + 1))){
						sprite_move(sprite_player, 0, -1);
					}
					sprite_move(spriteObj, 0, 1);

				}
				else if((prevx < spriteObj.x) && (prevy === spriteObj.y)){
					// player pushing from immediate left
					if(isWall((spriteObj.x + 1), spriteObj.y)){
						sprite_move(sprite_player, -1, 0);
					}
					sprite_move(spriteObj, 1, 0);

				}
				else if((prevx === spriteObj.x) && (prevy > spriteObj.y)){
					// player pushing from below
					if(isWall(spriteObj.x, (spriteObj.y - 1))){
						sprite_move(sprite_player, 0, 1);
						note_color_change(spriteObj)
					}
					sprite_move(spriteObj, 0, -1);

				}
				else if((prevx > spriteObj.x) && (prevy === spriteObj.y)){
					// player pushing from immediate right
					if(isWall((spriteObj.x - 1), spriteObj.y)){
						sprite_move(sprite_player, 1, 0);
					}
					sprite_move(spriteObj, -1, 0);

				}
			}

		}

	}

	// enemy collision
	function event_enemy_collide(s1, p1, s2, p2, type){
		if(s2 === sprite_player.id){
			for(let i=0;i<spriteEnemies.length;i++){
				let curSprite = spriteEnemies[i];
				if(curSprite.id === s1){
					spriteObj = curSprite;
				}
			}
			if(spriteObj == null){return;}
			// check type
			if(type === PS.SPRITE_OVERLAP){
				let spriteObj = null;
				// find the note object with matching sprite


				let prevx = sprite_player.prevPos[0];
				let prevy = sprite_player.prevPos[1];

				if((prevx == spriteObj.x) && (prevy < spriteObj.y)){
					sprite_move(sprite_player, 0, -1);
				}
				else if((prevx < spriteObj.x) && (prevy === spriteObj.y)){
					sprite_move(sprite_player, -1, 0);
				}
				else if((prevx === spriteObj.x) && (prevy > spriteObj.y)){
					sprite_move(sprite_player, 0, 1);
				}
				else if((prevx > spriteObj.x) && (prevy === spriteObj.y)){
					sprite_move(sprite_player, 1, 0);
				}

				PS.statusText(spriteObj.message);

			}
			else{
				PS.statusText(spriteObj.message);
			}
		}
	}

	/* Helpers */
	// changes the color of a note
	function note_color_change(noteBlock, fade){
		if(noteBlock.id === null){
			return;
		}
		let order = noteBlock.order;

		if(fade){
			//PS.debug("fade off\n");
			PS.fade(noteBlock.x, noteBlock.y, 10, {onEnd : fadeOff, params : [noteBlock]})
		}

		switch(order){
			case 1:
				noteBlock.color = PS.spriteSolidColor(noteBlock.id, gridDimensions.noteColorRed[noteBlock.y]);
				break;
			case 2:
				noteBlock.color = PS.spriteSolidColor(noteBlock.id, gridDimensions.noteColorOrange[noteBlock.y]);
				break;
			case 3:
				noteBlock.color = PS.spriteSolidColor(noteBlock.id, gridDimensions.noteColorBlue[noteBlock.y]);
				break;
			case 4:
				noteBlock.color = PS.spriteSolidColor(noteBlock.id, gridDimensions.noteColorGreen[noteBlock.y]);
				break;
			default:
				break;
		}
	}

	function note_flash(noteBlock){
		noteBlock.fading = true;
		PS.fade(noteBlock.x, noteBlock.y, 10, {onEnd : note_color_change, params : [noteBlock, 1]})
		noteBlock.color = PS.spriteSolidColor(noteBlock.id, PS.COLOR_WHITE);
	}

	function fadeOff(noteBlock){
		noteBlock.fading = false;

	}

	// Interpolates a color between two [R, G, B] colors
	// by [factor] and returns a [R, G, B] color
	function interpolateColors(color1, color2, factor){
		// Copy color1
		let result = color1.slice();

		// Interpolate each RGB channel based on the interpolation factor
		for(let i = 0; i < 3; i++){
			result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
		}

		return result;
	}

	// Plays the solution sequence
	function playExample(){
		if(!isPlaying){
			isPlaying = true;
			let hearing = solutions[currentLevel];
			for (let i=0; i<hearing.length; i++){
				task(i);
			}

			function task(i) {
				setTimeout(function() {
					PS.audioPlay(PS.piano(hearing[i]));
					//PS.debug(spriteNotes[i].y + "\n");

				}, 1000 * i);
			}
			// Prevent space bar spamming from making the player's ears bleed
			setTimeout(function(){
				isPlaying = false;
			}, 1000 * hearing.length)
		}
	}

	// checks if the player solved the puzzle
	function checkSolved(){
		switch(currentLevel){
			case 0:
				if((spriteNotes[0].y === 7)){
					return true;
				}
				break;
			case 1:
				if((spriteNotes[0].y === 2) && (spriteNotes[1].y === 2) &&
					(spriteNotes[2].y === 2) && (spriteNotes[3].y === 2)){
					return true;
				}
				break;
			case 2:
				if((spriteNotes[0].y === 5) && (spriteNotes[1].y === 7) &&
					(spriteNotes[2].y === 9) && (spriteNotes[3].y === 7)){
					return true;
				}
				break;
			case 3:
				if((spriteNotes[0].y === 4) && (spriteNotes[1].y === 5) &&
					(spriteNotes[2].y ===7) && (spriteNotes[3].y === 11)){
					return true;
				}
				break;
			default:
				break;
		}
		return false;
	}

	// returns true if x, y is at an impassable wall
	function isWall(x, y){
		return (PS.color(x,y) === gridDimensions.wallColor);
	}

	// sleep
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/* PS functions */
	return {
		init : function () {


			PS.gridSize(gridDimensions.gridX,gridDimensions.gridY); // can change later

			PS.statusText( "H to listen, Space to play" );

			PS.statusColor(gridDimensions.textColor);
			PS.gridColor(gridDimensions.colorOfGrid);
			PS.border(PS.ALL,PS.ALL,0);

			
			// draw map
			initLevel();

			//PS.color(PS.ALL,PS.ALL,gridDimensions.groundColor);

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
			//PS.debug( "PS.keyDown(): key=" + key + "\n" );
			//Notes will play at an interval, player needs to match up the sounds
			if((key === PS.KEY_SPACE) && !isPlaying) {
				isPlaying = true;
				let hearing = solutions[currentLevel];
				//console.log(solutions[currentLevel].length)
				for (let i=0; i < hearing.length; i++){
					task(i);
				}
				function task(i) {
					setTimeout(function() {
						note_flash(spriteNotes[i])
						PS.audioPlay(PS.piano(spriteNotes[i].pitch));
						PS.debug(spritNotes[i].y + "\n");
						//PS.debug(spriteNotes[i].y + "\n");

					}, 1000 * i);
				}
				// Prevent space bar spamming from making the player's ears bleed
				setTimeout(function(){
					isPlaying = false;
					console.log(checkSolved())
					if(checkSolved()){
						switch(currentLevel){
							case 0:
								PS.audioPlay("fx_ding",{volume:.2});
								PS.statusText("There! Moving on...");
								nextLevel();	
								break;
							case 1:
								PS.audioPlay("fx_ding",{volume:.2});
								PS.statusText("Huh they can Merge!");
								nextLevel();
								break;
							case 2:
								PS.audioPlay("fx_ding",{volume:.2});
								PS.statusText("One step closer to home!");
								nextLevel();
								break;
							case 3:
								PS.audioPlay("fx_ding",{volume:.2});
								PS.statusText("Will I ever get out of here?");
								nextLevel();
								break;
							default:
								break;
						}

						//	nextLevel();						
					}
				}, 1000 * hearing.length)

			}
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
				case 104:
					playExample();
					break;
				default:
					break;
			}
		}
	};
} () );

PS.init = G.init;
PS.touch = G.touch;
PS.keyDown = G.keyDown;