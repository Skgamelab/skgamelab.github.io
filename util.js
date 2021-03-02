var WIDTH_RATIO = 1;
var HEIGHT_RATIO = 1;

function resizeHandler() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var sw = canvas.width;
    var sh = canvas.height;
    var r = w / h;
    var sr = sw / sh;
    if (r > sr) {
        sw *= h / sh;
        sh = h;
    } else {
        sh *= w / sw;
        sw = w;
    }
	sw = sw*0.95
	sh = sh*0.95
    WIDTH_RATIO = canvas.width / sw;
    HEIGHT_RATIO = canvas.height / sh;
    canvas.style.width = Math.floor(sw) + "px";
    canvas.style.height = Math.floor(sh) + "px";
    canvas.style.left = Math.floor((w - sw) / 2) + "px";
    canvas.style.top = Math.floor((h - sh) / 2) + "px";
};

function Ball(x, y, color) {
	var ball = new createjs.Shape();
	ball.x = x;
    ball.y = y;
	ball.chainlevel = 1;
	ball.xLast = 0;
	ball.yLast = 0;
	ball.radius = 9;
	ball.popped = false;
	ball.anim = false;
	ball.dead = false;
	ball.score = 0;
    ball.direction = Math.random()*360;
	ball.speed = 2;
    ball.color = {
        r: Math.floor(Math.random() * 220),
        g: Math.floor(Math.random() * 220),
        b: Math.floor(Math.random() * 220)
    };
	ball.velocity = {
		x: Math.sin(ball.direction) * ball.speed,
		y: Math.cos(ball.direction) * ball.speed
	}
	
	if (color) {
		ball.color = {r: 120, g: 120, b: 120}
	}
	
	ball.graphics.f("rgb("+ball.color.r+","+ball.color.g+","+ball.color.b+")").dc(0, 0, ball.radius);
	ball.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	
	ball.txt = new createjs.Text("", "32px font", "white");
	ball.txt.textAlign = "center";
	ball.txt.x = x;
	ball.txt.y = y;
	ball.txt.scaleX = 0;
	ball.txt.scaleY = 0;
	
	stage.addChild(ball, ball.txt);
	
	return ball
}

function normalise(dx, dy) {
	var newX = dx;
	var newY = dy;
	
	var distance = Math.sqrt((newX * newX) + (newY * newY));
	
	return {
		x: newX * (1.0 / distance), 
		y: newY * (1.0 / distance)
	};
}

function dot(vector1, vector2) {
	return ((vector1.x * vector2.x) + (vector1.y * vector2.y));
}
	
function multiply(vector, scalar) {
	return {
		x: vector.x * scalar, 
		y: vector.y * scalar
	};
}
		
function add(vector1, vector2) {
	return {
		x: vector1.x + vector2.x, 
		y: vector1.y + vector2.y
	};
}

/* /////////////////////////////// */

function formatMoney(value) {
    let val = "" + value;
    let str = "";
    let k = 0;
    for (let i = val.length - 1; i >= 0; i--) {
        let c = val.charAt(i);
        str = c + str;
        k += 1;
    }
    return str;
}

function getRandomInt(min, max) {
	var min = Math.ceil(min);
	var max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2, r1, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return (r1 + r2) * (r1 + r2) > (dx * dx + dy * dy);
}