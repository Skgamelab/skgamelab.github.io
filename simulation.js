var chainlevel = 0;

function nomeStars() {
	var part = numberBalls/3;
	var num = 0;
	
	if (popCount > 0 && popCount <= part) {
		num = 1;
	} else if(popCount > part && popCount <= part*2) {
		num = 2;
	} else if(popCount > part*2 && popCount <= numberBalls) {
		num = 3;
	}
	return num;
}

function rotate(vX, vY, angle) {
	sinAngle = Math.sin(angle);
	cosAngle = Math.cos(angle);
	return {
		x: vX * cosAngle - vY * sinAngle,
		y: vX * sinAngle + vY * cosAngle
	};
}

function ballCollisionResponce(a, b) {
	a.x = a.xLast;
	a.y = a.yLast;
	b.x = b.xLast;
	b.y = b.yLast;
	
	dvx = a.velocity.x - b.velocity.x;
	dvy = a.velocity.y - b.velocity.y;
	dx = b.x - a.x;
	dy = b.y - a.y;

	if (dvx * dx + dvy * dy >= 0) {
		angle = -Math.atan2(dy, dx);
		u1 = rotate(a.velocity.x, a.velocity.y, angle);
		u2 = rotate(b.velocity.x, b.velocity.y, angle);
		a.velocity = rotate(u2.x, u1.y, -angle);
		b.velocity = rotate(u1.x, u2.y, -angle);
	}
}

function checkBallCollision(ball1, ball2) {
	var dx = ball1.x - ball2.x;
    var dy = ball1.y - ball2.y;
    return (ball1.radius*ball1.scaleX + ball2.radius*ball2.scaleX) * (ball1.radius*ball1.scaleX + ball2.radius*ball2.scaleX) > (dx * dx + dy * dy);
}

function checkWallCollision(ballArray) {
	for (var i=ballArray.length; i--;) {
		var ball = ballArray[i];
		
		if (ball.x + ball.radius >= canvas.width-62 || ball.x - ball.radius <= 62) {
			ball.velocity.x = -ball.velocity.x;
			ball.x = ball.xLast;
			ball.y = ball.yLast;
		}
		
		if (ball.y + ball.radius >= canvas.height-84 || ball.y - ball.radius <= 104) {
			ball.velocity.y = -ball.velocity.y;
			ball.x = ball.xLast;
			ball.y = ball.yLast;
		}
	}
}

// function ballCollisionResponce(ball1, ball2) {
	// ball1.x = ball1.xLast;
	// ball1.y = ball1.yLast;
	// ball2.x = ball2.xLast;
	// ball2.y = ball2.yLast;
	
	// var dx = ball2.x - ball1.x;
    // var dy = ball2.y - ball1.y;
	
	// var normalVector = normalise(dx, dy);
	// var tangentVector = {x: normalVector.y * -1, y: normalVector.x}
	
	// var ball1scalarNormal = dot(normalVector, ball1.velocity);
    // var ball2scalarNormal = dot(normalVector, ball2.velocity);
	
	// var ball1scalarTangential = dot(tangentVector, ball1.velocity);
	// var ball2scalarTangential = dot(tangentVector, ball2.velocity);
	
	// var ball1scalarNormalAfter_vector = multiply(normalVector, ball2scalarNormal);
	// var ball2scalarNormalAfter_vector = multiply(normalVector, ball1scalarNormal)
	
	// var ball1ScalarNormalVector = multiply(tangentVector, ball1scalarTangential);
    // var ball2ScalarNormalVector = multiply(tangentVector, ball2scalarTangential);
	
	// ball1.velocity = add(ball1ScalarNormalVector, ball1scalarNormalAfter_vector);
	// ball2.velocity = add(ball2ScalarNormalVector, ball2scalarNormalAfter_vector);
// }

function updateBallPos(ballArray) {
	for (var i=ballArray.length; i--;) {
		var ball = ballArray[i];
		
		ball.xLast = ball.x;
		ball.yLast = ball.y;
		ball.x += ball.velocity.x;
		ball.y += ball.velocity.y;
	}
}

function update(ballArray) {
	if (!flagEndGame) {
		updateBallPos(ballArray);
		checkWallCollision(ballArray);
		
		for (var i=ballArray.length; i--;) {
			var ball1 = ballArray[i];
			if (ball1.dead) continue;
			
			if (ball1.popped) {
					if (!ball1.anim) {
						stage.setChildIndex( ball1, stage.numChildren -1)
						stage.setChildIndex( ball1.txt, stage.numChildren -1)
						ball1.velocity.x = 0;
						ball1.velocity.y = 0;
						
						duingCount +=1;
						
						if (ball1.score) {
							var val = formatMoney(Math.floor(ball1.score));
							var scale = (val.length < 6 ? 1 : 0.9)
							ball1.txt.text = val;
							ball1.txt.x = ball1.x+1;
							ball1.txt.y = ball1.y+1;
							
							createjs.Tween.get(ball1.txt, {override:true})
							.to({ scaleX:scale, scaleY:scale}, 900, createjs.Ease.getElasticOut(1, 0.5)).wait(1000)
							.to({ scaleX:0, scaleY:0}, 500)
						}
						
						createjs.Tween.get(ball1, {override:true})
						.to({ scaleX:5, scaleY:5}, 900, createjs.Ease.getElasticOut(1, 0.5)).wait(900)
						.to({ scaleX:0, scaleY:0}, 500)
						.call(function() {
							this.dead = true;
							duingCount -= 1;
							if (duingCount == 0) {
								gameState = popCount >= levels[level][0] ? 1 : 2;
								if (gameState == 1) {
									gameLevelsState[level][0] = true;
									gameLevelsState[level][1] = nomeStars();
								} else {
									gameLevelsState[level][1] = 0;
								}
								flagEndGame = true;
								clearBalls();
								drawOverlay();
								moveOverlay();
							}
						});
						
					}
					ball1.anim = true;
			} else {
				for(let j=ballArray.length; j--;) {
					var ball2 = ballArray[j];
					if (ball1 === ball2 || ball2.dead) continue;
	
					if (checkBallCollision(ball1, ball2)) {
						if (ball2.popped) {
							createjs.Sound.play(punch);
							ball1.chainlevel = ball2.chainlevel+1;
							popCountTxt.text = (popCount += 1) + "/" + levels[level][0];
							ball1.popped = true;
							ball1.score = 10 * Math.pow(ball1.chainlevel, 2);
							levelScore += ball1.score
							scoreLevelTxt.text = "Очки уровня: " + levelScore;
							
							totalScore = totalScore + ball1.score;
							totalScoreTxt.text = "Всего очков: " + totalScore
						} else {
							createjs.Sound.play(punch_def);
							ballCollisionResponce(ball1, ball2);
						}
					}
				}
			}
		}
	}
}