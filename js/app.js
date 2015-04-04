// FROGGER
// Frogger is a simple arcade style game to be run in a browser.
// It features a single screen consisting of three parts, a strip of water, a 3 lane street and a piece of grass.  
// It is now the objective of the hero (here called the player) to cross the road to the water. 
// The tricky part is the road where there may bugs. 
//

//constants
var config = {
	FROGGER:'FROGGER',
//	SCRWIDTH:5, // screen is a 5 x 6 matrix
//	SCRHEIGHT:6,
//	SCRSPOS:0,
//	SCREPOS:5,
//	WATERSPOS:0,
//	WATEREPOS:0,
//	ROADSPOS:1,
//	ROADHEPOS:3,
//	GRASSSPOS:4,
//	GRASSEPOS:5,
//	PLSTARTPOSX:2,
//	PLSTARTPOSY:5,
//	NOOFENEMIES:4,
//	SCRXFACTOR:101,
//	SCRYFACTOR:83,
//	ENEMYDELAY:10

	SCRWIDTH:5*101, // screen is a 5 x 6 matrix
	SCRHEIGHT:6*83,
	SCRSPOS:0,
	SCREPOS:5*83,
	WATERSPOS:0,
	WATEREPOS:0,
	ROADSPOS:1*83,
	ROADEPOS:3*83,
	GRASSSPOS:4*83,
	GRASSEPOS:5*83,
	PLSTARTPOSX:2*101,
	PLSTARTPOSY:5*83,
	NOOFENEMIES:2,
	SCRXSTEP:101,
	SCRYSTEP:83,
	SCRXFACTOR:1,
	SCRYFACTOR:1,
	ENEMYDELAY:1
};

var player = new Player(config.PLSTARTPOSX, config.PLSTARTPOSY); // Declare the player with start position

// Enemies our player must avoid
var Enemy = function(no) {
	this.no = no;
	this.x = -1*config.SCRXSTEP;
	this.y = 1*config.SCRYSTEP;
	this.delay = config.ENEMYDELAY;
	this.remdelay = 0;
	this.speed = speed();
	this.state = '';
    this.sprite = 'images/enemy-bug.png';
};
//
// Enemy functions
//
Enemy.prototype.setNo = function(no) { //provide each enemy with a number
	this.no = no;
};
Enemy.prototype.setPosition = function(x,y) { 
	this.x = x;
	this.y = y;
};
Enemy.prototype.getX = function() {
	return this.x;
};
Enemy.prototype.getY = function() {
	return this.y;
};
Enemy.prototype.setX = function(x) {
	this.x = x;
};
Enemy.prototype.sety = function(y) {
	this.y = y;
};	
Enemy.prototype.setState = function(state) {
	this.state = state;
};
Enemy.prototype.getState = function() {
	return this.state;
};
Enemy.prototype.setSpeed = function(speed) {
	this.speed = speed;
};
Enemy.prototype.setLaneno = function() { // select a lane
	var lane = Math.trunc(Math.random()*3) + 1;
	lane = lane*config.SCRYSTEP;
	return lane;
};
function speed() { // select speed factor
	return Math.random()*2;
};

Enemy.prototype.resetGame = function() {
		this.x = -1*config.SCRXSTEP;
		this.y = Math.random()*3;	
		this.state = '';
		this.speed = speed();
};
Enemy.prototype.checkFreespace = function(no, x, y) { // check for free space
	returnvalue = true;
	allEnemies.forEach(function(enemy) {
		if (x == (enemy.getX()) && (y == enemy.getY()) && (no != enemy.no)) { // place taken
			console.log('checkFreespace: enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			returnvalue = false;
			return;
		};
	});
	return returnvalue;
};
	
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	if (--this.remdelay >0) return; //delay slowing the enemy down so that the player has a chance
	this.remdelay=this.delay;
	// Enemy state handling - this is where enemy behaviour is controlled
	switch (this.state) {
		case "":
		case "waiting": // wait for the player to appear on the road
			if(player.getY() < config.GRASSSPOS) { // player is on the road
				if (Math.random() < (1/config.NOOFENEMIES)) { // start chasing (maybe)
					this.state = "chasing"
					this.x = 0;
					this.y = Math.trunc(this.y)
					console.log('enemy# ' + this.no + ', state ' + this.state + ' at x ' + this.x + ' y ' +  this.y);
				};
			};
			break
		case "chasing": // chase the player 
			//console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			var diff = this.y - player.getY(); // close in on the player
			if(diff < 0) this.y = this.y + config.SCRYSTEP; // change to another lane
			if(diff > 0) this.y = this.y - config.SCRYSTEP; // change to another lane 
			if(diff == 0) this.x = this.x + 1; // go one step forward 
			if(this.y<config.ROADSPOS) this.y = config.ROADSPOS; // check that only the road is used
			if(this.y>config.ROADEPOS) this.y = config.ROADEPOS;
			if(this.x>=config.SCRWIDTH) this.state = 'offscreen'; // check for off screen
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			// Place taken?
			if (this.checkFreespace(this.no, this.x+config.SCRXSTEP, this.y) == true) {
				this.x++;
//				if(this.checkFreespace(this.no, this.x-SCRXSTEP,this.y) == true) {this.x = this.x-SCRXSTEP} else
//				if(this.checkFreespace(this.no, this.x,this.y-SCRYSTEP) == true) {this.y = this.y-SCRYSTEP} else
//				if(this.checkFreespace(this.no, this.x,this.y+SCRYSTEP) == true) {this.y = this.y+SCRYSTEP};
			}
			break;			
		case 'offscreen': // run off the screen 
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			this.y = this.y - (this.y % config.SCRYSTEP);
			break;
		case 'gothim': // got the player
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			restartGame();
			break;
	};
	if (this.x < config.SCRWIDTH - 1) { // don't display enemies outside the view
		ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt); 
	};
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*config.SCRXFACTOR, this.y*config.SCRYFACTOR);
};

// This is the player class
// It requires an update(), render() and
// a handleInput() method.
function Player(x, y) {
	this.sprite = 'images/char-boy.png'
	this.collision_sprite = 'images/char-boy-inv.png';
	this.x = x;
	this.y = y;
	this.state = "waiting";
	this.getX = function() {
		return this.x;
	};
	this.getY = function() {
		return this.y;
	};
	this.setX = function(x) {
		this.x = x;
	};
	this.sety = function(y) {
		this.y = y;
	};
	this.getState = function() {
		return this.state;
	};
	this.setState = function(state) {
		this.state = state;
	};
	this.update = function(dt) {
		if (this.state == 'dead') restartGame();
		if (this.state == 'winner') restartGame();
		if (checkCollisions() == false) {
			checkWater();
		};
		if (checkEndofgame() == true) restartGame();
		return true;
	};
	this.render = function() {
		if (this.getState() == 'dying') {
			ctx.drawImage(Resources.get('images/char-boy-inv.png'), this.x*config.SCRXFACTOR, this.y*config.SCRYFACTOR); 
			this.setState('dead');
			return true;
		};
		if (this.getState() == 'dead') {
			console.log('player now dead at x ' + this.x + ', y ' + this.y);
			this.setState('waiting');
			restartGame();
			return true;
		}; 
		// still alive
		ctx.drawImage(Resources.get(this.sprite), this.x*config.SCRXFACTOR, this.y*config.SCRYFACTOR); 
		return true;
	};
	this.handleInput = function(key) { // keyboard input
		if (key == 'left') {
			this.x = this.x - config.SCRXSTEP;
		};
		if (key == 'up') {
			this.y = this.y - config.SCRYSTEP; 
			if (this.state=='waiting' && this.y < config.GRASSSPOS) { 
				this.state='crossing';
				console.log('player now crossing at x ' + this.x + ', y ' + this.y);
			}; 
		}; 
		if (key == 'right') {
			this.x = this.x + config.SCRXSTEP;
		};
		if (key == 'down') {
			this.y = this.y + config.SCRYSTEP;
		};
		
		if (this.x<0) { this.x=0}; // check for boundary conditions
		if (this.y<0) { this.y=0};
		if (this.x>=config.SCRWIDTH-config.SCRXSTEP) {this.x=config.SCRWIDTH-config.SCRXSTEP};
		if (this.y>config.SCREPOS) {this.y=config.SCREPOS};
		this.render(); // call render function right away
		//console.log('player ' + key + ' x ' + this.x + ', y ' + this.y);
		return true;
	};
};

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
	player.render();
});

function checkEndofgame() { // are all the enemies off the screen?
	var ctr = allEnemies.length;
	allEnemies.forEach(function(enemy) {
		if (enemy.getState() == 'offscreen') {
			ctr--;
		};
	});
	if (ctr == 0) { return true } else { return false };
};

function checkCollisions() { // check that the player has collided with one of the enemies
	var returnvalue = false;
	allEnemies.forEach(function(enemy) {
		if (player.getX() == enemy.getX() && player.getY() == enemy.getY()) {
			player.setState('dying'); // the dying / dead states are used to make the collision visible (allowing for an extra screen refresh)
			console.log('collision: with enemy# ' + enemy.no + ' at x ' + player.getX() + ', y ' + player.getY());
			returnvalue = true;
		};
	});
	return returnvalue;
};

function checkWater() { // check whether the player is in the water
	if (player.getY() < 1) { // we are in the water
		//player.render();
		console.log('the player reached the water: x ' + player.getX() + ', y ' + player.getY());
		player.setState('winner');
		return true;
	};
	return false;
};

function restartGame() { // resetGame the game either because the player was caught or all the enemies are off the screen
	switch (player.getState()) {
			case "winner":
				alert('Congratulation!!');
				break;
			case "dead":
				alert('You are out!!');
				break;
			default:
				alert('Game over');
				break;
	}
	allEnemies.forEach(function(enemy) {
		enemy.resetGame();
	});
	player.setX(config.PLSTARTPOSX); // resetGame player
	player.sety(config.PLSTARTPOSY);
	player.setState('waiting');
};

//
// main body
//
// - objects are instantiated
// - enemy objects are placed in an array
var allEnemies = [];
var number_of_enemies = config.NOOFENEMIES;
for (i = 0; i < number_of_enemies; i++) { 
	allEnemies.push(new Enemy(i+1)); // create new enemy with enemy number
};
// Place the player object in a variable called player
var player = new Player(config.PLSTARTPOSX, config.PLSTARTPOSY);  // Player instance wit start position parameters

alert('Start the game using the arrow keys');
	




