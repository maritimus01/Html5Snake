var canvas = null;
var context = null;
var width = 0;
var height = 0;
var pos = [];
var dir = [];
var tailPos = [];
var foodPos = [];
var gridSize = 24;
var vectorBuffer = [];
var intervalID = 0;
var frameID = 0;
var updateRate = 80;
var score = 0;
var moved = false;
	
var Snake =
{
	init: function()
	{
		canvas = document.getElementById("canvas");
		if (!canvas) return;
		
		context = canvas.getContext("2d");
		width = canvas.width;
		height = canvas.height;
		
		/* Keyboard handler */
		document.onkeydown = function(e)
		{
			if (frameID == 1 && !moved)
			{
				var byte = e.keyCode;
				
				if ((byte == 37 || byte == 65) && dir[0] != 1) {
					dir[0] = -1;
					dir[1] = 0;
					moved = true;
				}
				else if ((byte == 39 || byte == 68) && dir[0] != -1) {
					dir[0] = 1;
					dir[1] = 0;
					moved = true;
				}
				
				if ((byte == 38 || byte == 87) && dir[1] != 1) {
					dir[0] = 0;
					dir[1] = -1;
					moved = true;
				}
				else if ((byte == 40 || byte == 83) && dir[1] != -1) {
					dir[0] = 0;
					dir[1] = 1;
					moved = true;
				}
			}
		}
		
		/* Left-click handler */
		document.onclick = function()
		{
			if (frameID == 0)
			{
				for (var i = 0; i < 3; i++) {
					vectorBuffer.push([pos[0],pos[1]+(i*gridSize)]);
				}
				intervalID = setInterval("Snake.framePlay()",updateRate);
			}
		}

		Snake.frameStart();
	},
	
	clear: function()
	{
		context.fillStyle = "#000";
		context.fillRect(0,0,width,height);
	},
	
	frameStart: function()
	{
		dir = [0,-1];
		pos = [
			Math.floor((width/gridSize)/2)*gridSize,
			Math.floor((height/gridSize)/2)*gridSize
		];
		vectorBuffer.length = 0;
		foodPos = randvec();
		score = 0;
		frameID = 0;
		
		Snake.clear();
		
		context.fillStyle = "#FFF";
		context.font = "bold 64px Georgia";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText("Snake",width/2,height/2);
		context.font = "28px Georgia";
		context.fillText("click to continue",width/2,(height/2)+100);
	},
	
	framePlay: function()
	{
		frameID = 1;
		Snake.clear();
		
		if (!vectorBuffer)
			return;
		
		/* Create snake movement */
		pos[0] = vectorBuffer[0][0] + (dir[0] * gridSize);
		if (pos[0] < 0) pos[0] = width - gridSize;
		else if (pos[0] >  width - gridSize) pos[0] = 0
		
		pos[1] = vectorBuffer[0][1] + (dir[1] * gridSize);
		if (pos[1] < 0) pos[1] = height - gridSize;
		else if (pos[1] >  height - gridSize) pos[1] = 0
		
		vectorBuffer.splice(0, 0, [pos[0], pos[1]]);
		tailPos = vectorBuffer.pop();
		
		/* Set draw properties */
		context.lineWidth = 2;
		context.fillStyle = "rgb(0,200,0)";
		context.strokeStyle = "#FFF";
		
		/* Iterate through vectorBuffer */
		for (var k in vectorBuffer)
		{
			if (k > 0 && vectorBuffer[k][0] == pos[0] && vectorBuffer[k][1] == pos[1])
				Snake.frameEnd();
			context.fillRect(vectorBuffer[k][0], vectorBuffer[k][1], gridSize, gridSize);
			context.strokeRect(vectorBuffer[k][0], vectorBuffer[k][1], gridSize, gridSize);
		}
		
		/* Check if snake got food */
		if (pos[0] == foodPos[0] && pos[1] == foodPos[1])
		{
			vectorBuffer.push(tailPos);
			foodPos = randvec();
			score++;
		}

		/* Draw food */
		context.fillStyle = "rgb(255,0,0)";
		context.fillRect(foodPos[0]+1,foodPos[1]+1,gridSize-2,gridSize-2);
		
		/* Draw score */
		context.fillStyle = "#FFF";
		context.font = "16px Georgia";
		context.textAlign = "left";
		context.textBaseline = "top";
		context.fillText("Score = " + score,2,1);
		
		/* Allow direction change */
		moved = false;
	},
	
	frameEnd: function()
	{
		clearInterval(intervalID);
		alert("Game over!");
		Snake.frameStart();
	}
};

function randvec()
{
	return [
		gridSize*Math.floor(Math.random()*(width/gridSize)),
		gridSize*Math.floor(Math.random()*(height/gridSize))
	];
}

window.onload = function() {
	Snake.init();
}