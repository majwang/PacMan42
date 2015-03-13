var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mazeWalls = "lthhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhrt"+
				"vvpunananavvnananananananananananavvnananapuvv"+
				"vvnaltlcnaucnarchhhhhhhhhhhhhhlcnaucnarcrtnavv"+
				"vvnavvnanananananananavvnanananananananavvnavv"+
				"vvnaucnarcrtnalthhlcnaucnarchhrtnaltlcnaucnavv"+
				"vvnanananavvnavvnananaannananavvnavvnanananavv"+
				"lbhhhhlcnaucnaucnalthhvvhhrtnaucnaucnarchhhhrb"+
				"anananannananananavvanananvvnananananaanananan"+
				"lthhhhlcnadcnadcnalbhhhhhhrbnadcnadcnarchhhhrt"+
				"vvnanananavvnavvnananaannananavvnavvnanananavv"+
				"vvnadcnarcrbnalbhhlcnadcnarchhrbnalblcnadcnavv"+
				"vvnavvnanananananananavvnanananananananavvnavv"+
				"vvnalblcnadcnarchhhhhhhhhhhhhhlcnadcnarcrbnavv"+
				"vvpunananavvnananananananananananavvnananapuvv"+
				"lbhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhrb";
var walls = [];
createMaze();
var score = 0;
var myPacMan = new Pacman();
myPacMan.poweredUp = false;
var blinkySprite = "http://i.imgur.com/MoF6t10.gif?1";
var blinky = new Ghost(550, 300, blinkySprite);
var inkySprite = "http://i.imgur.com/X44mEQ6.gif?2";
var inky = new Ghost(500, 350, inkySprite);
var pinkySprite = "http://i.imgur.com/fdvjX47.gif?1";
var pinky = new Ghost(550, 350, pinkySprite);
var clydeSprite = "http://i.imgur.com/Ob5NKal.gif?2";
var clyde = new Ghost(600, 350, clydeSprite);

blinky.timer = 0;
pinky.timer = 12;
inky.timer = 24;
clyde.timer = 36;
blinky.dead = true;
inky.dead = true;
pinky.dead = true;
clyde.dead = true;
var Fay = Strict.GhostAI;

function Pacman(){
	movingDirection:"right";
	openMouth: true;
	poweredUp: true;
	this.pacx = 550;
	this.pacy = 450;
	var mySprite = new Image();
	mySprite.src = "http://i.imgur.com/cxCDFn2.gif?1";
	
	var p = this;
	mySprite.onload = function(){
		ctx.drawImage(mySprite, p.pacx, p.pacy);
	};
	this.getSprite = (function(){
		return mySprite;
	});
	this.setSprite = (function(sprite){
		mySprite.src = sprite;
	});
}

function Ghost(x,y,ghostSprite){
	this.movingDirection = "up";
	this.isEatable = false;
	this.dead = false;
	this.ghostX = x;
	this.ghostY = y;
	this.timer;
	var mySprite = new Image();
	mySprite.src = ghostSprite;
	
	var p = this;
	
	mySprite.onload = function(){
		ctx.drawImage(mySprite, p.ghostX, p.ghostY);
	};
	this.getSprite = (function(){
		return mySprite;
	});
	this.setSprite = (function(sprite){
		mySprite.src = sprite;
	});
}

function Wall(x,y, wallType){
		this.posx = x;
		this.posy = y;
		this.isWall = true;
		this.wallType = wallType;
		var mySprite = new Image();
		if(wallType === "hh") mySprite.src = "http://i.imgur.com/qrhBcVs.gif";
		if(wallType === "vv") mySprite.src = "http://i.imgur.com/46rHql7.gif";
		if(wallType === "lt") mySprite.src = "http://i.imgur.com/UmEo5mV.gif";
		if(wallType === "rt") mySprite.src = "http://i.imgur.com/lclPLlP.gif";
		if(wallType === "lb") mySprite.src = "http://i.imgur.com/yWKrBgQ.gif";
		if(wallType === "rb") mySprite.src = "http://i.imgur.com/mG439AJ.gif";
		if(wallType === "lc") mySprite.src = "http://i.imgur.com/Vw2os1w.gif?1";
		if(wallType === "rc") mySprite.src = "http://i.imgur.com/i3iUHlI.gif?1";
		if(wallType === "uc") mySprite.src = "http://i.imgur.com/Ai8jWPr.gif?1";
		if(wallType === "dc") mySprite.src = "http://i.imgur.com/5QoBFn3.gif?1";
		if(wallType === "na"){
				mySprite.src = "http://i.imgur.com/JK0Z3ii.gif?1";
				this.isWall = false;
		}
		if(wallType === "pu"){
				mySprite.src = "http://i.imgur.com/v5cebbB.gif?1";
				this.isWall = false;
		}
		
		var p = this;
		mySprite.onload = function(){
			ctx.drawImage(mySprite, p.posx, p.posy);
		};
		this.getSprite = (function(){
			return mySprite;
		});
		this.setSprite = (function(sprite){
			mySprite.src = sprite;
		});
}
function reDraw(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	var wallTracker = 0;
	for (var i = 0; i<15;i++){
		for(var j = 0; j<23;j++){
			var wallType = mazeWalls[wallTracker]+mazeWalls[wallTracker+1];
			wallTracker+=2;
			if(wallType !== "an"){
				var wall = walls[j+(i*23)];
				ctx.drawImage(wall.getSprite(), wall.posx, wall.posy);
			}
		}
	}
	ctx.drawImage(myPacMan.getSprite(), myPacMan.pacx, myPacMan.pacy);
	ctx.drawImage(blinky.getSprite(), blinky.ghostX, blinky.ghostY);
	ctx.drawImage(pinky.getSprite(), pinky.ghostX, pinky.ghostY);
	ctx.drawImage(inky.getSprite(), inky.ghostX, inky.ghostY);
	ctx.drawImage(clyde.getSprite(), clyde.ghostX, clyde.ghostY);
}

function createMaze(){
	var wallTracker = 0;
	for (var i = 0; i<15;i++){
		for(var j = 0; j<23;j++){
			//gets 2 chars at a time for getting type of maze wall to draw
			var wallType = mazeWalls[wallTracker]+mazeWalls[wallTracker+1];
			wallTracker+=2;
			if(wallType !== "an")
				walls[j+(i*23)] = new Wall(j*50, i*50, wallType);
			else
				walls[j+(i*23)] = 0;
		}
	}
}

function moveGhost(ghost){
	if(ghost.movingDirection==="right" && ghost.ghostX >= 0 && ghost.ghostX < canvas.width-50 && ghostCheck(ghost, 50, 0)){
		ghost.ghostX+=50;
		checkTele(50);
	}
	else if(ghost.movingDirection==="left" && ghost.ghostX > 0 && ghost.ghostX <= canvas.width-50 && ghostCheck(ghost, -50, 0)){
		ghost.ghostX-=50;
		checkTele(-50);
	}
	else if(ghost.movingDirection==="up" && ghost.ghostY > 0 && ghost.ghostY  <= canvas.height-50 && ghostCheck(ghost, 0, -50)){
		ghost.ghostY-=50;
	}
	else if(ghost.movingDirection==="down" && ghost.ghostY  >=0 && ghost.ghostY  < canvas.height-50 && ghostCheck(ghost, 0, 50)){
		ghost.ghostY+=50;
	}
	else{
		var haskellPM = Fay.pacMan(myPacMan.pacx, myPacMan.pacy);
		var ghostDirection = calcDirection(ghost.movingDirection);
		var haskellGhost  = Fay.ghost(ghost.ghostX, ghost.ghostY, ghostDirection);
		var haskellWalls = makeWalls();
		
		var move = Fay.move(haskellPM, haskellGhost, haskellWalls, Math.floor((Math.random() * 10) + 1));
		
		if (move[0] > ghost.ghostX) ghost.movingDirection = "right";
		else if (move[0] < ghost.ghostX) ghost.movingDirection = "left";
		else if (move[1] < ghost.ghostY) ghost.movingDirection = "up";
		else ghost.movingDirection = "down";
		
		ghost.ghostX = move[0];
		ghost.ghostY = move[1];
	}
}

//Needed to convert moving direction to an Int for Fay because Fay will not accept String parameters...
function calcDirection(movingDirection){
	if (movingDirection === "up") return 0;
	if (movingDirection === "right") return 1;
	if (movingDirection === "down") return 2;
	if (movingDirection === "left") return 3;
}

function movePac(myPac){
	if(myPacMan.movingDirection==="right" && myPacMan.pacx >= 0 && myPacMan.pacx < canvas.width-50 && checkCollision(50, 0, true)){
		if(myPacMan.openMouth){
			myPacMan.setSprite("http://i.imgur.com/cxCDFn2.gif?1");
			myPacMan.openMouth = !myPacMan.openMouth;
			
		}else{
			myPacMan.setSprite("http://i.imgur.com/nAaDQ3X.gif?1");
			myPacMan.openMouth = !myPacMan.openMouth;
		}
		myPacMan.pacx+=50;
		checkTele(50);
	}
	if(myPac.movingDirection==="left" && myPac.pacx > 0 && myPac.pacx <= canvas.width-50 && checkCollision(-50, 0, true)){
		if(myPac.openMouth){
			myPac.setSprite("http://i.imgur.com/DCoGkEY.gif?1");
			myPac.openMouth = !myPac.openMouth;
			
		}else{
			myPac.setSprite("http://i.imgur.com/6ODn9qE.gif?1");
			myPac.openMouth = !myPac.openMouth;
		}
		myPacMan.pacx-=50;
		checkTele(-50);
	}
	if(myPac.movingDirection==="up" && myPac.pacy > 0 && myPac.pacy <= canvas.height-50 && checkCollision(0,-50, true)){
		if(myPac.openMouth){
			myPac.setSprite("http://i.imgur.com/16Lm0tO.gif?2");
			myPac.openMouth = !myPac.openMouth;
			
		}else{
			myPac.setSprite("http://i.imgur.com/xkPIRnb.gif?1");
			myPac.openMouth = !myPac.openMouth;
		}
		myPacMan.pacy-=50;
	}
	if(myPac.movingDirection==="down" && myPac.pacy >=0 && myPac.pacy < canvas.height-50 && checkCollision(0,50, true)){
		if(myPac.openMouth){
			myPac.setSprite("http://i.imgur.com/CTVx19i.gif?1");
			myPac.openMouth = !myPac.openMouth;
			
		}else{
			myPac.setSprite("http://i.imgur.com/cvGmgzZ.gif?1");
			myPac.openMouth = !myPac.openMouth;
		}
		myPacMan.pacy+=50;
	}
}

var skip = false;
function checkTele(x){
	var checkX = myPacMan.pacx + x;
	var tele1x = -50;
	var tele2x = 1150;
	
	if (checkX === tele1x){
		myPacMan.pacx = tele2x-50;
		skip = true;
	}
	else if (checkX === tele2x){
		myPacMan.pacx = tele1x+50;	
		skip = true;
	}
	
	
}

function checkCollision(x,y,food) {
	var checkX = myPacMan.pacx + x;
	var checkY = myPacMan.pacy + y;
	var fail = false;
	
	//checks for wall
	var wallsIndex = (checkX/50) + ((checkY*23)/50);
	fail = walls[wallsIndex].isWall;
	
	if(!fail) {
		if (food) canEat(checkX,checkY);
		return true;
	}
	else
		return false;
}

//x and y are coordinates ghost trying to move onto
function ghostCheck(ghost,x,y) {
	var checkX = ghost.ghostX + x;
	var checkY = ghost.ghostY + y;
	var fail = false;
	
	var wallsIndex = (checkX/50) + ((checkY*23)/50);
	fail = walls[wallsIndex].isWall;
	
	var currentIndex = (ghost.ghostX/50) + ((ghost.ghostY*23)/50);
	//checks for wall
	if(ghost.movingDirection === "up" || ghost.movingDirection === "down"){
		if(!walls[currentIndex-1].isWall || !walls[currentIndex+1].isWall){
			return false;
		}
	}
	else{
		if(!walls[currentIndex-23].isWall || !walls[currentIndex+23].isWall){
			return false;
		}
	}
	
	return !fail;
}

var timer = 0;
function canEat(x,y){
	var wallsIndex = (x/50) + ((y*23)/50);
	var count;
	
	if(walls[wallsIndex].wallType === "na") {
		walls[wallsIndex].wallType = "an";
		walls[wallsIndex].setSprite("");
		score++;
		$("#score").html(score);
	}
	if(walls[wallsIndex].wallType === "pu") {
		walls[wallsIndex].wallType = "an";
		walls[wallsIndex].setSprite("");
		score+=10;
		$("#score").html(score);
		myPacMan.poweredUp = true;
		blinky.setSprite("http://i.imgur.com/14pVLYF.gif?3");
		inky.setSprite("http://i.imgur.com/14pVLYF.gif?3");
		clyde.setSprite("http://i.imgur.com/14pVLYF.gif?3");
		pinky.setSprite("http://i.imgur.com/14pVLYF.gif?3");
		blinky.isEatable = true;
		pinky.isEatable = true;
		inky.isEatable = true;
		clyde.isEatable = true;
		timer = 40;
	}
}

function reset(){
	alert("GAME OVER!");
		score = 0;
		createMaze();
		myPacMan.pacx = 550;
		myPacMan.pacy = 450;
		blinky.ghostX = 550;
		blinky.ghostY = 300;
		pinky.ghostX = 550;
		pinky.ghostY = 350;
		inky.ghostX = 500;
		inky.ghostY = 350;
		clyde.ghostX = 600;
		clyde.ghostY = 350;
		myPacMan.setSprite("http://i.imgur.com/cxCDFn2.gif?1")
		blinky.setSprite("http://i.imgur.com/MoF6t10.gif?1");
		inky.setSprite("http://i.imgur.com/X44mEQ6.gif?2");
		pinky.setSprite("http://i.imgur.com/fdvjX47.gif?1");
		clyde.setSprite("http://i.imgur.com/Ob5NKal.gif?2");
		blinky.movingDirection = "up";
		pinky.movingDirection = "up";
		inky.movingDirection = "up";
		clyde.movingDirection = "up";
		blinky.timer = 0;
		pinky.timer = 12;
		inky.timer = 24;
		clyde.timer = 36;
}


function gameOver(){
	if (((myPacMan.pacx === blinky.ghostX && myPacMan.pacy === blinky.ghostY) || (myPacMan.pacx === inky.ghostX && myPacMan.pacy === inky.ghostY) ||
		(myPacMan.pacx === clyde.ghostX && myPacMan.pacy === clyde.ghostY) || (myPacMan.pacx === pinky.ghostX && myPacMan.pacy === pinky.ghostY)) 
		&& myPacMan.poweredUp === false){
		reset();
	}
	if(myPacMan.pacx === blinky.ghostX && myPacMan.pacy === blinky.ghostY && myPacMan.poweredUp === true){
		if (blinky.isEatable){
			blinky.ghostX = 550;
			blinky.ghostY = 300;
			score += 10;
			blinky.dead = true;
			blinky.isEatable = false;
			blinky.setSprite("http://i.imgur.com/MoF6t10.gif?1");
			blinky.timer = 12;
		} else reset();
	}
	if(myPacMan.pacx === inky.ghostX && myPacMan.pacy === inky.ghostY && myPacMan.poweredUp === true){
		if (inky.isEatable){
			inky.ghostX = 500;
			inky.ghostY = 350;
			score += 10;
			inky.isEatable = false;
			inky.dead = true;
			inky.setSprite("http://i.imgur.com/X44mEQ6.gif?2");
			inky .timer = 12;
		} else reset();
	}
	if(myPacMan.pacx === pinky.ghostX && myPacMan.pacy === pinky.ghostY && myPacMan.poweredUp === true){
		if (pinky.isEatable){
			pinky.ghostX = 550;
			pinky.ghostY = 350;
			score += 10;
			pinky.isEatable = false;
			pinky.dead = true;
			pinky.setSprite("http://i.imgur.com/fdvjX47.gif?1");
			pinky.timer = 12;
		} else reset();
	}
	if(myPacMan.pacx === clyde.ghostX && myPacMan.pacy === clyde.ghostY && myPacMan.poweredUp === true){
		if (clyde.isEatable){
			clyde.ghostX = 600;
			clyde.ghostY = 350;
			score += 10;
			clyde.isEatable = false;
			clyde.dead = true;
			clyde.setSprite("http://i.imgur.com/Ob5NKal.gif?2");
			clyde.timer = 12;
		} else reset();
	}
	$("#score").html(score);
	reDraw();
}

setInterval(function(){ 
	movePac(myPacMan);
	gameOver();
	moveGhost(blinky);
	moveGhost(pinky);
	moveGhost(inky);
	moveGhost(clyde);
	gameOver();
	if(timer>0){
		timer--;
		$("#upTimer").html((timer/4));
		if(timer === 0) {
			myPacMan.poweredUp = false;
			blinky.setSprite("http://i.imgur.com/MoF6t10.gif?1");
			inky.setSprite("http://i.imgur.com/X44mEQ6.gif?2");
			pinky.setSprite("http://i.imgur.com/fdvjX47.gif?1");
			clyde.setSprite("http://i.imgur.com/Ob5NKal.gif?2");
		}
	}
	if(blinky.timer === 0 && blinky.dead === true){
		blinky.ghostX = 550;
		blinky.ghostY = 300;
		blinky.dead = false;
		blinky.timer = 0;
		blinky.movingDirection = "up";
	}
	if(inky.timer === 0 && inky.dead ===  true){
		inky.ghostX = 550;
		inky.ghostY = 300;
		inky.dead = false;
		inky.timer = 0;
		inky.movingDirection = "up";
	}
	if(pinky.timer === 0 && pinky.dead === true){
		pinky.ghostX = 550;
		pinky.ghostY = 300;
		pinky.dead = false;
		pinky.timer = 0;
		pinky.movingDirection = "up";
	}
	if(clyde.timer === 0 && clyde.dead === true){
		clyde.ghostX = 550;
		clyde.ghostY = 300;
		clyde.dead = false;
		clyde.timer = 0;
		clyde.movingDirection = "up";
	}
	if(pinky.dead) {pinky.timer--;}
	if(inky.dead)  {inky.timer--;}
	if(blinky.dead) {blinky.timer--;}
	if(clyde.dead) {clyde.timer--;}
}, 250);

function makeWalls(){
	var returnWalls = [];
	var index = 0;
	for (var w of walls) {
		returnWalls[index] = Fay.wall(w.posx, w.posy, w.isWall);
		index++;
	}
	return returnWalls;
}

document.onkeydown = function(e){
	e = e || window.event;
	if (!skip){
		if (e.keyCode == '38') {
			// up arrow
			if (checkCollision(0, -50, false))
				myPacMan.movingDirection = "up"
		}
		else if (e.keyCode == '40') {
			// down arrow
			if (checkCollision(0, 50, false))
				myPacMan.movingDirection = "down"
		}
		else if (e.keyCode == '37') {
		// left arrow
			if (checkCollision(-50, 0, false))
				myPacMan.movingDirection = "left"
		}
		else if (e.keyCode == '39') {
		// right arrow
			if (checkCollision(50, 0, false))
				myPacMan.movingDirection = "right"
		}
	} else {
		checkTele(50)
		skip = false;
	}
}

