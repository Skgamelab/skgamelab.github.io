var width = 500;
var heigh = 490;
var container;
var goldStar1;
var goldStar2;
var goldStar3;

function createButton( x, y, scale, out, down, onComplete) {
	var spriteSheet = new createjs.SpriteSheet({
		images: [sprite], 
		frames: [[1, 1, 400, 100, 0, 0, 0], [1, 205, 400, 95, 0, 0, -5],
				 [403, 1, 400, 100, 0, 0, 0], [403, 205, 400, 95, 0, 0, -5],
				 [1, 103, 400, 100, 0, 0, 0], [1, 302, 400, 95, 0, 0, -5],
				 [403, 103, 400, 100, 0, 0, 0], [403, 302, 400, 95, 0, 0, -5]], 
		animations: { closeOut: 0, closeDown: 1, 
					  furtherOut: 2, furtherDown: 3,
					  proceedOut: 4, proceedDown: 5,
					  repeateOut: 6, repeateDown: 7}
	});
	
	var button = new createjs.Sprite(spriteSheet).set({scale: scale, x: x, y: y});
	var buttonHelper = new createjs.ButtonHelper(button, out, down, down);
	button.addEventListener("click", onComplete);
	return button
}

function moveOverlay() {
	if (flagOverlay) {
		flagOverlay = false
		totalScoreTxt.alpha = 0;
		scoreLevelTxt.alpha = 0;
		popCountTxt.alpha = 0;
		levelTxt.alpha = 0;
		createjs.Tween.get(container)
			.to({ x:canWidth/2-width/2 }, 650, createjs.Ease.quintOut).call(function() {
				moveStars();
			});
	} else {
		totalScoreTxt.alpha = 1;
		scoreLevelTxt.alpha = 1;
		popCountTxt.alpha = 1;
		levelTxt.alpha = 1;
		flagOverlay = true;
		createjs.Tween.get(container)
			.to({ x:canWidth+50 }, 550, createjs.Ease.quintOut ).call(function() {
					container.removeAllEventListeners();
					container.removeAllChildren();
				});
	}
}

function clearBalls() {
	for (var i = 0; i < ballArray.length; i++) {
		var ball = ballArray[i];
		ball.graphics.clear();
	}
}

function drawBoardUi() {
	container = new createjs.Container().set({x: canWidth+50, y: canHeight/2-heigh/2});
	var overlay = new createjs.Shape();
	overlay.graphics.ss(3).s("#070707").dr(0, 0, width, heigh);
	overlay.graphics.ss(3).s("#404040").dr(3, 3, width-6, heigh-6);
	overlay.graphics.ss(10).s("#202020").dr(8.5, 8.5, width-17, heigh-17);
	overlay.graphics.ss(3).s("#070707").dr(14.5, 14.5, width-29, heigh-29);
	overlay.graphics.ss(3).s("#565656").dr(17.5, 17.5, width-35, heigh-35);
	overlay.graphics.f("#404040").dr(19, 19, width-38, heigh-38);
	overlay.cache(-1.5, -1.5, width+4.5, heigh+4.5);
	container.addChild(overlay);
	stage.addChild(container);
}

function drawUI() {
	var board = new createjs.Shape();
	board.graphics.f("#202020").dr(0, 0, canWidth, 86);
	board.graphics.f("#202020").dr(0, canHeight-86, canWidth, 86);
	board.graphics.f("#202020").dr(0, 0, 58, canHeight);
	board.graphics.f("#202020").dr(canWidth-58, 0, 58, canHeight);
	board.graphics.f("rgba(255,255,255,0)").ss(3, "square").s("#070707").dr(1.5, 1.5, canWidth-3, canHeight-3);
	board.graphics.ss(3).s("#404040").dr(4.5, 4.5, canWidth-9, canHeight-9);
	board.graphics.ss(3).s("#404040").dr(58, 86, canWidth-116, canHeight-172);
	board.graphics.ss(3).s("#070707").dr(61, 89, canWidth-122, canHeight-178);
	board.graphics.ss(3).s("#262626").dr(64, 92, canWidth-128, canHeight-184);
	
	// var butLevels = new createjs.Shape().set({x: canWidth/2-30, y: canHeight-43-32});
	// butLevels.graphics.ss(3).s("#070707").f("#525252").dr(0, 0, 60, 60);
	// butLevels.graphics.ss(3).s("#070707").f("#808080").dr(6, 6, 48, 48);
	// butLevels.graphics.ss(3).s("#b3b3b3").f("#808080").dr(9, 9, 42, 42);

	var hit = new createjs.Shape();
	hit.graphics.f("#000").dr(64, 92, canWidth-128, canHeight-184);
	board.hitArea = hit;
	
	board.cache(0, 0, canWidth, canHeight);
	
	levelTxt = new createjs.Text("Уровень " + (level+1), "38px font", "#b4b4b4");
	levelTxt.textAlign = "right";
	levelTxt.x = canWidth-58;
	levelTxt.y = canHeight - 43;
	
	popCountTxt = new createjs.Text("Цель: " + popCount + "/" + levels[level][0], "38px font", "#b4b4b4");
	popCountTxt.textAlign = "center";
	popCountTxt.x = 129;
	popCountTxt.y = canHeight - 43;
	
	totalScoreTxt = new createjs.Text("Всего очков: " + totalScore, "38px font", "#b4b4b4");
	totalScoreTxt.textAlign = "left";
	totalScoreTxt.x = 58;
	totalScoreTxt.y = 43;
	
	scoreLevelTxt = new createjs.Text("Очки уровня: " + levelScore, "38px font", "#b4b4b4");
	scoreLevelTxt.textAlign = "right";
	scoreLevelTxt.x = canWidth-58;
	scoreLevelTxt.y = 43;
	
	stage.addChild(board, levelTxt, popCountTxt, totalScoreTxt, scoreLevelTxt);
	
	board.on("click", function(evt) {
		if (!mousePressed) {
			mousePressed = true;
			var ball = new Ball(evt.stageX, evt.stageY, true);
			ball.popped = true;
			ballArray.push(ball);
		}
	})
}

function moveStars() {
	var part = numberBalls/3;
	var numStars = gameLevelsState[level][1];
	
	if (numStars == 1) {
		createjs.Tween.get(goldStar1).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
	} else if(numStars == 2) {
		createjs.Tween.get(goldStar1).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
		createjs.Tween.get(goldStar2).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
	} else if(numStars == 3) {
		createjs.Tween.get(goldStar1).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
		createjs.Tween.get(goldStar2).wait(500).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
		createjs.Tween.get(goldStar3).wait(1000).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.quintOut );
	}
}

// function drawMenuLevels() {
	// drawBoardUi();
	
	// var x = 80;
	// var y = 45;
	// var id = 0;
	
	// var spriteSheet = new createjs.SpriteSheet({
		// images: [sprite], 
		// frames: [ [1, 1, 400, 100, 0, 0, 0], [1, 103, 400, 95, 0, 0, -5] ], 
		// animations: { out: 0, down: 1 }
	// });
	
	// for (var i = 0; i < 4; i++) {
		// for (var j = 0; j < 4; j++) {
			// var numStars = gameLevelsState[id][1];
			// var flagBlockLevel = gameLevelsState[id][0];
			
			// var board = new createjs.Shape();
			// board.graphics.ss(3).s("#070707").f("#808080").dr(x, y, 70, 70);
			// board.graphics.ss(3).s("#b3b3b3").dr(x+3, y+3, 70-6, 70-6);
			// board.id = id;
			// container.addChild(board);

			// board.on("click", function() {
				// console.log(this.id);
			// });
			
			// if (!flagBlockLevel) {
				// var blockLevel = new createjs.Bitmap("block.png").set({scale: 0.35});
				// blockLevel.x = x+35-11;
				// blockLevel.y = y+25-6;
				// container.addChild(blockLevel);
			// } else {
				// var lvl = new createjs.Text( (id+1), "30px font", "#ffffff").set({textAlign: "center"});
				// lvl.x = x+35;
				// lvl.y = y+27;
				
				// var stars = new createjs.Shape().set({x: x+35, y: y+53});
				// stars.graphics.ss(1).s("#070707").f(numStars >= 1 ? "#ffcf00" : "#202020").dp(0, 0, 7, 5, 0.5, -90);
				// stars.graphics.ss(1).s("#070707").f(numStars >= 2 ? "#ffcf00" : "#202020").dp(-17, 0, 7, 5, 0.5, -90);
				// stars.graphics.ss(1).s("#070707").f(numStars == 3 ? "#ffcf00" : "#202020").dp(17, 0, 7, 5, 0.5, -90);
				// container.addChild(lvl, stars);
			// }
			// x += 88;
			// id += 1;
		// }
		// x = 80;
		// y += 88;
	// }
	
	// var butClose = createButton( width/2-101.5, heigh/2+157, 0.5, spriteSheet, "out", "down", moveOverlay2);
	// container.addChild(butClose);
// }

function drawOverlay() {
	var button;
	var button2;
	var button3;
	drawBoardUi();

	if (first) {
		var text = "Твоя цель, разрушить ядра, вызвав цепную реакцию между ними. \n\nЧем больше ядер будет разрушено, тем больше ты заработаешь очков. \n\nТапни, чтобы запустить реакцию.";

		var txt = new createjs.Text(text, "26px font", "white").set({textAlign: "left", x: 48, y: heigh/2-122});
		txt.lineWidth = width-70;
		txt.lineHeight  = 30;
		var butClose = createButton( width/2-100, heigh/2+155, 0.5, "closeOut", "closeDown", function() {
			createjs.WebAudioPlugin.playEmptySound();
			mousePressed = false;
			first = false;
			moveOverlay();
		});
		container.addChild(butClose, txt, );
		
	} else {
		var text = gameState == 1 ? "Уровень проЙден! :)" : "Вы проиграли :(";
		var txt = new createjs.Text(text, "38px font", "white").set({textAlign: "center", x: width/2, y: heigh/2+20});
		
		if (gameState == 1) {
			button = createButton( width/2-215, heigh/2+155, 0.5, "repeateOut", "repeateDown", function() {
				gameState = 2;
				initGame();
				moveOverlay();
			});
			
			button2 = createButton( width/2+15, heigh/2+155, 0.5, "furtherOut", "furtherDown", function() {
				initGame();
				moveOverlay();
			});
		} else {
			txt.y = heigh/2-16;
			button3 = createButton( width/2-100, heigh/2+80, 0.5, "proceedOut", "proceedDown", function() {
				initGame();
				moveOverlay();
			});
			
			button = createButton( width/2-100, heigh/2+155, 0.5, "repeateOut", "repeateOut", function() {
				gameState = 2;
				initGame();
				moveOverlay();
			});
		}
		
		var stars = new createjs.Shape().set({x: width/2, y: heigh/2-155});
		stars.graphics.ss(3).s("#070707").f("#202020").dp(-110, 0, 46, 5, 0.5, -90);
		stars.graphics.ss(3).s("#070707").f("#202020").dp(0, 0, 46, 5, 0.5, -90);
		stars.graphics.ss(3).s("#070707").f("#202020").dp(110, 0, 46, 5, 0.5, -90);
		
		goldStar1 = new createjs.Shape().set({scale: 0, x: width/2-110, y: heigh/2-155});
		goldStar1.graphics.ss(3, "square").s("#070707").f("#ffcf00").dp(0, 0, 46, 5, 0.5, -90);
		goldStar2 = new createjs.Shape().set({scale: 0, x: width/2, y: heigh/2-155});
		goldStar2.graphics.ss(3, "square").s("#070707").f("#ffcf00").dp(0, 0, 46, 5, 0.5, -90);
		goldStar3 = new createjs.Shape().set({scale: 0, x: width/2+110, y: heigh/2-155});
		goldStar3.graphics.ss(3, "square").s("#070707").f("#ffcf00").dp(0, 0, 46, 5, 0.5, -90);
		
		container.addChild(txt, button, button2, button3, stars, goldStar1, goldStar2, goldStar3);
	}
	
}