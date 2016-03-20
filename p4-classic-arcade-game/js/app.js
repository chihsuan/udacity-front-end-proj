// Game constants
var SCREEN_LEFT = 0;
var SCREEN_TOP = -10;
var SCREEN_RRIGHT = 404;
var SCREEN_BOTTOM = 400;
var GRID_WIDTH = 101;
var GRID_HEIGHT = 83;
var HEIGHT_SCORE = 200;
var LOWER_HP = 20;

// Get DOM for resue
var hpDOM = document.getElementById('hp');
var scoreDOM = document.getElementById('score');

/**
 * @description Enemies our player must avoid
 * @constructor
*/
var Enemy = function() {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';

  // Set initial position & movement,
  var props = this._getRandomProps();
  this.x = props.x;
  this.y = props.y;
  this.movement = props.movement;
};

/*
 * @description Update the enemy's position, required method for game
 * @Param {number} dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
  // Multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += dt * this.movement;

  if (this.x > (SCREEN_RRIGHT + GRID_WIDTH)) {
    // Set offset x -25. delay show up
    this._resetEntity(-25, 0);
  }
};

/**
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * @description Reset the enemy position & movement
 * @param {number} offsetX
 * @param {number} offsetY
 */
Enemy.prototype._resetEntity = function(offsetX, offsetY) {
  var props = this._getRandomProps();
  this.x = 0 + offsetX;
  this.y = props.y + offsetY;
  this.movement = props.movement;
};

/* *
 * @description Generate random enemy's property
 * @returns {object} Property, including position & movement
 * */
Enemy.prototype._getRandomProps = function() {
  var minMoment = 60;

  // Set random y value -25 to vertical center the enemy in grid
  return {
    x: (1 + Math.round(Math.random() * 2)) * GRID_WIDTH,
    y: (1 + Math.round(Math.random() * 2)) * GRID_HEIGHT - 25,
    movement: minMoment + 400 * Math.random()
  };
};

/**
 * @description Represents a Player
 */
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.reset();
};

/*
 * @description Update user properties to DOM
 */
Player.prototype.update = function() {
  hpDOM.innerHTML = 'HP：' + this.hp;
  scoreDOM.innerHTML = 'Score：' + this.score;

  // Check hp not < 0
  // change class when player lower hp
  if (this.hp < 0) {
    this.hp = 0;
  } else if (this.hp < LOWER_HP) {
    hpDOM.className = 'lower-hp';
  } else {
    hpDOM.className = '';
  }

  if (this.score > HEIGHT_SCORE) {
    scoreDOM.className = 'height-score';
  }
};

/**
 * @description Draw the player on the screen, required method for game
 */
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Handle the user input
* @param {string} key
* */
Player.prototype.handleInput = function(key) {
  switch (key) {
    case 'left':
      this.x -= GRID_WIDTH;
      break;

    case 'up':
      this.y -= GRID_HEIGHT;
      break;

    case 'right':
      this.x += GRID_WIDTH;
      break;

    case 'down':
      this.y += GRID_HEIGHT;
      break;
  }

  this._checkPosition();
};

/**
* @description Call when player collision enemy to reset player position.
*/
Player.prototype.collisionEnemy = function() {
  this._resetPosition();
  this.hp -= 10;
};

Player.prototype.collisionTreasure = function(treasure) {
  switch(treasure.sprite) {
    case 'images/Heart.png':
      this.hp += 5;
      break;
    case 'images/Star.png':
      this.score += 10;
      break;
  }
};

/**
 * @description Check the player reach boundary or not
/* Ensure that player not out of boundary.
*/
Player.prototype._checkPosition = function() {
  if (this.x > SCREEN_RRIGHT)
    this.x = SCREEN_RRIGHT;

  if (this.x < SCREEN_LEFT)
    this.x = SCREEN_LEFT;

  if (this.y > SCREEN_BOTTOM)
    this.y = SCREEN_BOTTOM;

  // -13, player vertical center on water area
  if (this.y < SCREEN_TOP) {
    this.y = -13;
    this.hp -= 5;
  }
};

/**
 * @description Reset player position
* */
Player.prototype._resetPosition = function() {
  this.x = GRID_WIDTH * Math.round(Math.random()*4);
  this.y = SCREEN_BOTTOM;
};

/**
 * @description Reset player when game start or restart
* */
Player.prototype.reset = function() {
  this.hp = 100;
  this.score = 0;
  this.timeLeft = 60;
  this._resetPosition();
};


/*
* @description Treasure
* @constructor
* @param {string} sprite
* */
var Treasure = function(sprite) {
  this.sprite = sprite;
  this._resetPosition();
  this.lastUpdate = 60;
};

/**
* @description Draw the treasures on the screen, required method for game
 */
Treasure.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Update the treasures on the screen every 3s
* @param {number} diffSecond
 */
Treasure.prototype.update = function(diffSecond) {
  if (this.lastUpdate > (diffSecond + 3)) {
    this._resetPosition();
    this.lastUpdate = diffSecond;
  }
};

/**
* @description Dollision player, reset treasure position
* */
Treasure.prototype.collisionPlayer = function() {
  var that = this;
  // hide
  this.x = -100;
  this.y = -100;

  // show after around 3s
  setTimeout(function() {
    that._resetPosition();
  }, 3000);
};

/**
* @description Implement reset treasure position
* */
Treasure.prototype._resetPosition = function() {
  this.x = (1 + Math.round(Math.random() * 2)) * GRID_WIDTH;
  this.y = (1 + Math.round(Math.random() * 2)) * GRID_HEIGHT;
};

// New enemies, treasures and player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var allTreasures = [
  new Treasure('images/Heart.png'),
  new Treasure('images/Star.png'),
  new Treasure('images/Key.png')
];
var player = new Player();

// This listens for key presses and sends the keys to the
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
