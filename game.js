var canvas;
var stage;

var ballArray = [];
var levels = [[1, 3], [2, 9], [3, 15], [5, 21], [7, 24], [10, 30], [15, 36], [21, 39], [27, 45], [33, 48], [44, 60], [60, 69], [80, 90], [90, 99], [125, 150], [150, 150]];

var gameLevelsState = [[true,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0], [false,0]];

var level = 0;
var totalScore = 0;
var numberBalls = levels[level][1];
var radiusCircle = 9;
var incrRadius 	= 50;
var mousePressed = true;
var popCount = 0;
var incrMultiplier = 2;
var levelScore = 0;
var duingCount = 0;
var flagEndGame = false;
var flagOverlay = true;
var gameState = 0;
var levelTxt;
var popCountTxt;
var totalScoreTxt;
var scoreLevelTxt;
var first = true;
var sprite = new Image();

var punch = "punch";
var punch_def = "punch_def";

function createBalls() {
	for (var i = 0; i < numberBalls; i++) {
		var x = getRandomInt(90+(radiusCircle * 2), canWidth-90-(radiusCircle * 2));
		var y = getRandomInt(110+(radiusCircle * 2), canHeight-110-(radiusCircle * 2));
		
		if (i !== 0) {
			for (var j = 0, k = 0; j < ballArray.length; j++) {
				if (distance(x, y, ballArray[j].x, ballArray[j].y, radiusCircle, radiusCircle)) {
					x = getRandomInt(70+(radiusCircle * 2), canWidth-70-(radiusCircle * 2));
					y = getRandomInt(110+(radiusCircle * 2), canHeight-90-(radiusCircle * 2));
					j = -1;
					if(++k > 2000) break;
				}
			}
		}
		ballArray.push(Ball(x, y));
	}
}

function initGame() {
	if (gameState == 1) {
		level += 1;
	} else {
		totalScore -= levelScore;
		totalScoreTxt.text = "Всего очков: " + totalScore
	}
	ballArray = [];
	flagEndGame = false;
	mousePressed = false;
	numberBalls = levels[level][1];
	levelScore = 0;
	popCount = 0;
	
	levelTxt.text = "Уровень " + (level+1);
	popCountTxt.text = popCount + "/" + levels[level][0];
	scoreLevelTxt.text = "Очки уровня: " + levelScore;
	
	createBalls();
}

function Main() {
	canvas = document.getElementById("display");
	canvas.style.backgroundColor = "#353535";
	sprite.src = "sheet.png";
	
	createjs.Sound.registerSound("assets/punch.wav", punch);
	createjs.Sound.registerSound("assets/punch_def.wav", punch_def);
	
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);
	
	canWidth = canvas.width;
	canHeight = canvas.height;
	
	resizeHandler();
	window.addEventListener("resize", resizeHandler);
	createBalls();
	drawUI();
	
	if (first) {
		drawOverlay();
		moveOverlay();
	}
	
	createjs.Ticker.addEventListener("tick", gameLoop);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.framerate  = 60;
	
	function gameLoop(event) {
		update(ballArray);
		stage.update()
	}
}