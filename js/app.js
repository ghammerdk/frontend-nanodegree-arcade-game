//constants
var config = function() {
	SRCWIDTH = 5;
	SRCHEIGHT = 6;
	ROADWIDTH = SRCWIDTH;
	ROADHEIGHT = 3;
	GRASSWIDTH = scrwidth;
	GRASSHEIGHT = 2;
	SCRXFACTOR = 101;
	SCRYFACTOR = 83;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.no = 0;
	this.x = -1;
	this.y = 1;
	this.speed = speed();
	this.state = '';
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	//
	// The following functions are for debugging purposes
	this.setno = function(no) { //provide each enemy with a number
		this.no = no;
	}
	this.setposition = function(x,y) { 
		this.x = x;
		this.y = y;
	}
	this.getx = function() {
		return this.x;
	}
	this.gety = function() {
		return this.y;
	}
	this.setx = function(x) {
		this.x = x;
	}
	this.sety = function(y) {
		this.y = y;
	}
	
	this.setState = function(state) {
		this.state = state;
	}
	this.getState = function() {
		return this.state;
	}
	this.setspeed = function(speed) {
		this.speed = speed;
	}
	this.reset = function() {
		this.x = -1;
		this.y = Math.random()*3;	
		this.state = '';
		this.speed = speed();
	}
}
	
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	// Enemy state handling - this is where enemy behaviour is controlled
	switch (this.state) {
		case "":
		case "waiting": // waiting for the player to appear on the road
			if(player.gety() < 4) { // player is on the road
				if (Math.random() > 0.3) { // start chasing (maybe)
					this.state = "chasing"
				};
			};
			break;
		case "chasing": // chasing the player 
			var diff = this.y - player.gety(); // close in on the player
			if(diff < 0) this.y++;
			if(diff > 0) this.y--; 
			if(this.y>3) this.y = 3; // check that only the road is used
			if(this.y<1) this.y = 1;
			if(this.x>4) this.state = 'offscreen'; // check for off screen'ess
			if (checkFreespace(this.x+1, this.y) == true) this.x++; // advance to the right
			break;			
		case 'offscreen': // run off the screen 
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			this.y = this.y - (this.y % 1);
			break;
		case 'gothim': // got the player
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			resetGame();
			break;
	}
	if (this.x < 5) { // don't display enemies outside the view
		ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt); 
		sleep(300/this.speed); // delay the enemy
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83);
}

// This is the player class
// It requires an update(), render() and
// a handleInput() method.
function Player(x, y) {
	this.sprite = 'images/char-boy.png';
	this.x = x;
	this.y = y;
	this.state = "waiting";
	
	alert('Start game using the arrow keys');
	this.getx = function() {
		return this.x;
	}
	this.gety = function() {
		return this.y;
	}
	this.setx = function(x) {
		this.x = x;
	}
	this.sety = function(y) {
		this.y = y;
	}
	this.getstate = function() {
		return this.state;
	}
	this.setstate = function(state) {
		this.state = state;
	}
	this.update = function(dt) {
		if (this.state == 'dead') resetGame();
		if (checkCollisions() == false) {
			checkWater();
		}
		return true;
	};
	this.render = function() {
		if (this.getstate() == 'dying') {
			ctx.drawImage(Resources.get('images/char-boy.png'), this.x*101, this.y*83); 
			console.log('player dying at x ' + this.x + ', y ' + this.y);
			this.setstate('dead');
			return true;
		}
		if (this.getstate() == 'dead') {
			console.log('player now dead at x ' + this.x + ', y ' + this.y);
			alert('Got you!!');	
			this.setstate('waiting');
			resetGame();
			return true;
		} // still alive
		ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83); 
		return true;
	};
	this.handleInput = function(key) { // keyboard input
		if (key == 'left') {this.x--;};
		if (key == 'up') {
			this.y--; if (this.state=='waiting' && this.y < 4) { 
				this.state='crossing';
				console.log('player now crossing at x ' + this.x + ', y ' + this.y);
			}; 
		}; 
		if (key == 'right') {this.x++;};
		if (key == 'down') {this.y++;};
		if (this.x<0) { this.x=0}; // check for boundary conditions
		if (this.y<0) { this.y=0};
		if (this.x>4) { this.x=4};
		if (this.y>5) { this.y=5};
		this.render(); // call render function right away
		console.log('player ' + key + ' x ' + this.x + ', y ' + this.y);
		return true;
	};
}

function sleep(time) { // poor man's sleep function (aka Unix)
	time += new Date().getTime();
	while (new Date() < time){}
	return true;
}

function laneno() { // randomly select one of 3 lanes
	var lane = Math.random()*3;
	lane = lane - (lane % 1);
	lane = lane + 1;
	return lane;
}

function speed() { // randomly select on of 3 speed factors
	return Math.random()*3;
}

function checkFreespace(x, y) { // checxk for free space to avoid enemies occupy the same spot
	allEnemies.forEach(function(enemy) {
		if (x == (enemy.getx()) && y == enemy.gety()) {
				return false;
		};
	});
	return true;
}

// The objects are instantiated
// The enemy objects are placed in an array
// We create a single instance
var enemy = new Enemy();
// Set up the array
var allEnemies = [];
var number_of_enemies = 2;
for (i = 0; i < number_of_enemies; i++) { 
	allEnemies.push(clone(enemy)); // and clone the enemies we need
	allEnemies[i].setno(i+1); // set the enemy number
}

// Place the player object in a variable called player
var player = new Player(2,5);  // start position parameters

// A listener is set up for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function checkEndofgame() { !!!!!!!!!!
	console.log('check fro End of game at x ' + player.getx() + ', y ' + player.gety());	
	var ctr = allEnemies.length;
	allEnemies.forEach(function(enemy) {
//		if (enemy.getstate() == 'offscreen') {
		if (enemy.getx() > 4) {
			ctr--;
		}
	});
	if (ctr == 0) resetGame();
}

function checkCollisions() { // check that the player has collided with one of the enemies
	var returnvalue = false;
	allEnemies.forEach(function(enemy) {
		if (player.getx() == enemy.getx() && player.gety() == enemy.gety()) {
			player.setstate('dying'); // the dying / dead states are used to make the collision visible (allowing for an extra screen refresh)
			console.log('collision: x ' + player.getx() + ', y ' + player.gety());
			returnvalue = true;
		};
	});
	return returnvalue;
};

function checkWater() { // check whether the player is in the water
	if (player.gety() < 1) {
		alert('You drowned!!');	
		console.log('the player drowned: x ' + player.getx() + ', y ' + player.gety());	
		resetGame();
		return true;
	}
	return false;
};

function resetGame() { // reset the game either because the player was caught or all the enemies are off the screen
	console.log('game reset');	
	allEnemies.forEach(function(enemy) {
		enemy.reset();
	});
	player.setx(2); // reset player
	player.sety(5);
	player.setstate('waiting');
	alert('Game reset');
};

function clone(obj) { // clone code inspired by internet search
  var copy = Object.create(Object.getPrototypeOf(obj));
  var propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });
  return copy;
}



