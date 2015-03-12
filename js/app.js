// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.no = 0;
	this.x = -1;
	this.y = 0;
	this.speed = 1;
	this.state = '';
	this.lane = -1;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
	//
	// The following functions are for debuging purposes
	this.setno = function(no) { //provide each enemy with a number
		this.no = no;
	}
	this.setposition = function(x,y) { //set position explicit
		this.x = x;
		this.y = y;
	}
	this.getx = function() { // get the x position
		return this.x;
	}
	this.gety = function() { // get the y position
		return this.y;
	}
	this.setspeed = function(speed) { // set the speed explicit
		this.speed = speed;
	}
}
	
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	//state handling - this is where the enemy behaviour is controlled
	if (this.state != 'endofgame') {
		console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
	}
	switch (this.state) {
		case "":
			//this.x = 0;
			if (this.y < 1) this.y = 1;
			if (player.getstate() != 'waiting') this.state = "waiting";
			break;
		case "waiting":
			//console.log();
			wannachase = Math.random();
			if (wannachase > 0.5) {
				this.state = "chasing"
			};
			break;
		case "chasing":
			this.x++;
			if (this.x > 6) { this.state = 'offscreen'} 
			//console.log();
			if (collision() == true) {
				this.state = "gothim"
			};
			break;
		case "offscreen":
			console.log();
			this.state = 'endofgame';
			break;
		case "gothim":
			console.log();
			this.state = "endofgame";
			break;
	}
	//setTimeout(function(){ ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt);  }, 3000);
	if (this.x >= 0) { // don't display enemies outside the view
		ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt); 
		sleep(300/this.speed); // delay
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
	this.x = x; // start pos
	this.y = y;
	this.getx = function() {
		return this.x;
	}
	this.gety = function() {
		return this.y;
	}
	this.state = "waiting";
	this.getstate = function() {
		return this.state;
	}
	this.update = function(dt) {
		return true;
	};
	this.render = function() {
		ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83); 
		return true;
	};
	this.handleInput = function(key) {
		//console.log(key + ' x ' + this.x + ', y ' + this.y);
		if (key == 'left') {this.x--;};
		if (key == 'up')   {this.y--; if (this.state='waiting') { this.state='crossing'}; };
		if (key == 'right') {this.x++;};
		if (key == 'down') {this.y++;};
		if (this.x<0) { this.x=0};
		if (this.y<0) { this.y=0};
		if (this.x>4) { this.x=4};
		if (this.y>5) { this.y=5};
		return true;
	};
}

function sleep(time) {
	time += new Date().getTime();
	while (new Date() < time){}
	return true;
}

function laneno() {
	var lane = Math.random()*3;
	console.log('laneno ' + lane);
	return lane;
}

function speed() {
	return Math.random()*3;
}

// Now instantiate the objects
// The enemy objects are placed in an array
// We create a single instance
var enemy = new Enemy();
// Set up the array
var allEnemies = [];
var number_of_enemies = 1;
for (i = 0; i < number_of_enemies; i++) { 
	allEnemies.push(clone(enemy)); // and clone the enemies we need
	allEnemies[i].setno(i); // setting the enemy number
}

// Place the player object in a variable called player
var player = new Player(2,5);

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

function collision() {
	allEnemies.forEach(function(enemy) {
		if (player.getx() == enemy.getx()) {
			if (player.gety() == enemy.gety()) {
				console.log('collision: x ' + player.getx() + ', y ' + player.gety());
				return true;
			};
		};
	});
	return false;
};

function clone(obj) {
  var copy = Object.create(Object.getPrototypeOf(obj));
  var propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });
  return copy;
}
