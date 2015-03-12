// Enemies our player must avoid
var Enemy = function(no, x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.enemyno = no;
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.state = '';
	this.lane = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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
	this.setspeed = function(speed) {
		this.speed = speed;
	}
}

function sleep(time) {
	time += new Date().getTime();
	while (new Date() < time){}
	return true;
}
	
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	//state handling
	if (this.state != 'endofgame') {
		console.log('enemy# ' + this.enemyno + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
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
	if (this.x >= 0) {
		ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt); 
		//alert('image redrawed');
		sleep(300/this.speed); // delay
	}
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83);
}

// Now write your own player class
// This class requires an update(), render() and
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemy = new Enemy(1, -1, 1, 1);
var enemy1 = new Enemy(2, -1, 2, 2);
var enemy2 = new Enemy(3, -1, 3, 3);
var enemy3 = new Enemy(4, -1, 3, 1);
var allEnemies = [];
allEnemies.push(enemy);
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);

var obj = Object.create(Enemy.prototype);
var obj = clone(enemy);
allEnemies.push(obj);
//allEnemies.push(Object.create(Enemy.prototype));
//allEnemies.push(Object.create(Enemy.prototype));
//allEnemies.push(Object.create(Enemy.prototype));

// Place the player object in a variable called player
var player = new Player(2,5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
