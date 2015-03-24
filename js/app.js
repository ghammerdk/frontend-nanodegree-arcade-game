// FROGGER
// Frogger is a simple arcade style game to be run in a browser.
// It features a single screen consisting of three parts, a strip of water, a 3 lane street and a piece of grass.  
// It is now the objective of the hero (here called the player) to cross the road to the water. 
// The tricky part is the road where there may bugs. 
//

//constants
var config = {
	FROGGER:'FROGGER',
	SCRWIDTH:5, // screen is a 5 x 6 matrix
	SCRHEIGHT:6,
	WATERROW:0,
	ROADWIDTH:5,
	ROADHEIGHT:3,
	ROADROW0:1,
	ROADROWN:3,
	GRASSWIDTH:5,
	GRASSHEIGHT:2,
	GRASSROW0:4,
	GRASSROWN:5,
	SCRXFACTOR:101,
	SCRYFACTOR:83,
	NOOFENEMIES:4,
	ENEMYDELAY:10
};

var player = new Player(2,5); // Declare the player with start position

// Enemies our player must avoid
var Enemy = function(no) {
	this.no = no;
	this.x = -1;
	this.y = 1;
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
	var lane = Math.random()*3;
	lane = lane - (lane % 1);
	lane = lane + 1;
	return lane;
};
function speed() { // select speed factor
	return Math.random()*2;
};

Enemy.prototype.resetGame = function() {
		this.x = -1;
		this.y = Math.random()*3;	
		this.state = '';
		this.speed = speed();
};
Enemy.prototype.checkFreespace = function(no, x, y) { // check for free space
	allEnemies.forEach(function(enemy) {
		if (x == (enemy.getX()) && y == enemy.getY() && no != enemy.no) { // place taken
			return false;
		};
	});
	return true;
};
Enemy.prototype.moveAhead = function() {
	if (this.checkFreespace(this.no, this.x+1, this.y) == true) { this.x++; return; };
	if (this.checkFreespace(this.no, this.x, this.y-1) == true) { this.y--; return; };
	if (this.checkFreespace(this.no, this.x, this.y+1) == true) { this.y++; return; };
};
	
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	if (--this.remdelay >0) return; //delay slowing the enemy down so that the player stand a chance
	this.remdelay=this.delay;
	// Enemy state handling - this is where enemy behaviour is controlled
	switch (this.state) {
		case "":
		case "waiting": // waiting for the player to appear on the road
			if(player.getY() < 4) { // player is on the road
				if (Math.random() > 1/config.NOOFENEMIES) { // start chasing (maybe)
					this.state = "chasing"
				};
			};
			break;
		case "chasing": // chasing the player 
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			var diff = this.y - player.getY(); // close in on the player
			if(diff < 0) this.y++; // change to another lane
			if(diff > 0) this.y--; // change to another lane 
			if(this.y>3) this.y = 3; // check that the road is used
			if(this.y<1) this.y = 1;
			if(this.x>4) this.state = 'offscreen'; // check for off screen'ess
			//if (this.checkFreespace(this.no, this.x+1, this.y) == true) this.x++; 
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			this.moveAhead(); // avoid collision with other enemies
			break;			
		case 'offscreen': // run off the screen 
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			this.y = this.y - (this.y % 1);
			break;
		case 'gothim': // got the player
			console.log('enemy# ' + this.no + ', state ' + this.state + ' x ' + this.x + ' y ' +  this.y);
			restartGame();
			break;
	};
	if (this.x < 5) { // don't display enemies outside the view
		ctx.drawImage(Resources.get(this.sprite), this.x*dt, this.y*dt); 
	};
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83);
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
			ctx.drawImage(Resources.get('images/char-boy-inv.png'), this.x*101, this.y*83); 
			console.log('player dying at x ' + this.x + ', y ' + this.y);
			this.setState('dead');
			return true;
		};
		if (this.getState() == 'dead') {
			console.log('player now dead at x ' + this.x + ', y ' + this.y);
			this.setState('waiting');
			restartGame();
			return true;
		}; // still alive
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
			console.log('collision: x ' + player.getX() + ', y ' + player.getY());
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
	player.setX(2); // resetGame player
	player.sety(5);
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
var player = new Player(2,5);  // Player instance wit start position parameters

alert('Start the game using the arrow keys');
	




