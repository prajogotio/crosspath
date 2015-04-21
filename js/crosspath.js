var buffer = document.createElement("canvas");
var display = {};
var commands = {};
var world = {};
var gameLoop = null;
var announcement = null;
var CONSTANT = {
	PLAYER : {
		WIDTH : 64,
		HEIGHT : 64,
		SRC : {
			X : 0,
			Y : 0,
			WIDTH : 64,
			HEIGHT : 64,
		}
	},
	MONSTER : {
		WIDTH : 64,
		HEIGHT : 64,
		SRC : {
			X : 64,
			Y : 0,
			WIDTH : 64,
			HEIGHT : 64,
		}
	},
	POTION : {
		WIDTH : 64,
		HEIGHT : 64,
		SRC : {
			X : 128,
			Y : 0,
			WIDTH : 64,
			HEIGHT : 64,
		}
	},
	HIT_EFFECT_PERIOD : 400,
	LEVEL_UP_PERIOD : 1000,
};

function prepareSprite() {
	var g = buffer.getContext('2d');
	buffer.width = 1024;
	buffer.height = 640;
	// player
	g.fillStyle = "white";
	g.fillRect(4, 32, 56, 32);
	g.globalAlpha = 0.4;
	g.fillStyle = "green";
	g.fillRect(50, 32, 4, 32);
	g.fillRect(4, 32, 56, 4);
	g.globalAlpha = 1;
	g.fillStyle = "white";
	g.beginPath();
	g.arc(32, 32, 28, 0, Math.PI, true);
	g.fill();
	g.beginPath();
	g.fillStyle = "green";
	g.arc(44, 18, 4, 0, 2*Math.PI);
	g.fill();

	// attacked-player
	g.save();
	g.translate(0, 64);
	g.fillStyle = "red";
	g.fillRect(4, 32, 56, 32);
	g.globalAlpha = 0.4;
	g.fillStyle = "black";
	g.fillRect(50, 32, 4, 32);
	g.fillRect(4, 32, 56, 4);
	g.globalAlpha = 1;
	g.fillStyle = "red";
	g.beginPath();
	g.arc(32, 32, 28, 0, Math.PI, true);
	g.fill();
	g.beginPath();
	g.fillStyle = "black";
	g.arc(44, 18, 4, 0, 2*Math.PI);
	g.fill();
	g.restore();

	// player on rampage
	g.save();
	g.translate(0, 128);
	g.fillStyle = "orange";
	g.fillRect(4, 32, 56, 32);
	g.globalAlpha = 0.4;
	g.fillStyle = "yellow";
	g.fillRect(50, 32, 4, 32);
	g.fillRect(4, 32, 56, 4);
	g.globalAlpha = 1;
	g.fillStyle = "orange";
	g.beginPath();
	g.arc(32, 32, 28, 0, Math.PI, true);
	g.fill();
	g.beginPath();
	g.fillStyle = "yellow";
	g.arc(44, 18, 4, 0, 2*Math.PI);
	g.fill();
	g.restore();

	// monster
	g.save();
	g.translate(64, 0);
	g.fillStyle = "white";
	g.beginPath();
	g.arc(32, 32, 20, 0, 2 * Math.PI);
	g.fill();
	g.fillRect(16, 40, 32, 24);
	g.fillStyle = "red";
	g.beginPath();
	g.arc(42, 28, 2, 0, 2*Math.PI);
	g.fill();
	g.globalAlpha = 0.4;
	g.fillRect(30, 40, 4, 24);
	g.restore();

	// attacked-monster
	g.save();
	g.translate(64, 64);
	g.fillStyle = "red";
	g.beginPath();
	g.arc(32, 32, 20, 0, 2 * Math.PI);
	g.fill();
	g.fillRect(16, 40, 32, 24);
	g.fillStyle = "red";
	g.beginPath();
	g.arc(42, 28, 2, 0, 2*Math.PI);
	g.fill();
	g.globalAlpha = 0.4;
	g.fillRect(30, 40, 4, 24);
	g.restore();

	// monster lvl 1 name
	g.save();
	g.translate(64, 128);
	g.fillStyle = "white";
	g.font = "14px Times"
	g.fillText("Peon", 0, 10);
	g.restore();

	// potion
	g.save();
	g.translate(128, 0);
	g.fillStyle = "white";
	g.fillRect(24, 48, 16, 16);
	g.fillRect(30, 44, 4, 8);
	g.fillStyle = "rgb(0,255,0)";
	g.fillRect(26, 50, 12, 12);
	g.fillStyle = "black";
	g.fillRect(26, 50, 12, 2);
	g.restore();

	// war flask
	g.save();
	g.translate(128, 64);
	g.fillStyle = "orange";
	g.fillRect(24, 48, 16, 16);
	g.fillRect(30, 44, 4, 8);
	g.fillStyle = "yellow";
	g.fillRect(26, 50, 12, 12);
	g.fillStyle = "black";
	g.fillRect(26, 50, 12, 2);
	g.restore();

	// level up text
	g.save();
	g.translate(192, 0);
	g.fillStyle = "white";
	g.font = "14px Times"
	g.fillText("Level UP!", 0, 10);
	g.restore();

	// monster level 2
	g.save();
	g.translate(256, 0);
	g.fillStyle = "rgb(230,230,230)";
	g.fillRect(16, 16, 32, 32);
	g.beginPath();
	g.arc(16, 32, 16, 0, 2*Math.PI);
	g.fill();
	g.beginPath();
	g.arc(48, 32, 16, 0, 2*Math.PI);
	g.fill();
	g.fillStyle = "rgb(255, 0, 0)";
	g.fillRect(16, 16, 4, 32);
	g.beginPath();
	g.arc(48, 26, 6, 0, 2 * Math.PI);
	g.fill();
	g.beginPath();
	g.moveTo(30, 16);
	g.lineTo(20, 8);
	g.quadraticCurveTo(36, 8, 48, 16);
	g.fill();
	g.restore();

	// monster level 2 attacked
	g.save();
	g.translate(256, 64);
	g.fillStyle = "rgb(255,120,20)";
	g.fillRect(16, 16, 32, 32);
	g.beginPath();
	g.arc(16, 32, 16, 0, 2*Math.PI);
	g.fill();
	g.beginPath();
	g.arc(48, 32, 16, 0, 2*Math.PI);
	g.fill();
	g.fillStyle = "rgb(255, 0, 0)";
	g.fillRect(16, 16, 4, 32);
	g.beginPath();
	g.arc(48, 26, 6, 0, 2 * Math.PI);
	g.fill();
	g.beginPath();
	g.moveTo(30, 16);
	g.lineTo(20, 8);
	g.quadraticCurveTo(36, 8, 48, 16);
	g.fill()
	g.restore();
	
	// monster level 2 name
	g.save();
	g.translate(256, 128);
	g.fillStyle = "white";
	g.font = "14px Times"
	g.fillText("Omega", 0, 10);
	g.restore();

	// monster level 2 bullet
	g.save();
	g.translate(256, 192);
	g.fillStyle = "red";
	g.fillRect(8, 30, 40, 4);
	g.beginPath();
	g.moveTo(48, 34);
	g.lineTo(32, 22);
	g.quadraticCurveTo(48, 22, 64, 34);
	g.fill();
	g.restore();


	// monster level 3
	g.save();
	g.translate(320, 0);
	g.fillStyle = "rgb(230, 230, 20)";
	g.fillRect(4, 32, 56, 32);
	g.globalAlpha = 0.4;
	g.fillStyle = "red";
	g.fillRect(50, 32, 4, 32);
	g.fillRect(4, 32, 56, 4);
	g.globalAlpha = 1;
	g.fillStyle = "rgb(230, 230, 20)";
	g.beginPath();
	g.arc(32, 32, 28, 0, Math.PI, true);
	g.fill();
	g.beginPath();
	g.fillStyle = "red";
	g.arc(44, 18, 8, 0, 2*Math.PI);
	g.fill();
	g.restore();

	// monster level 3 attacked
	g.save();
	g.translate(320, 64);
	g.fillStyle = "rgb(230, 100, 20)";
	g.fillRect(4, 32, 56, 32);
	g.globalAlpha = 0.4;
	g.fillStyle = "black";
	g.fillRect(50, 32, 4, 32);
	g.fillRect(4, 32, 56, 4);
	g.globalAlpha = 1;
	g.fillStyle = "rgb(230, 100, 20)";
	g.beginPath();
	g.arc(32, 32, 28, 0, Math.PI, true);
	g.fill();
	g.beginPath();
	g.fillStyle = "black";
	g.arc(44, 18, 8, 0, 2*Math.PI);
	g.fill();
	g.restore();
	
	// monster level 3 name
	g.save();
	g.translate(320, 128);
	g.fillStyle = "white";
	g.font = "14px Times"
	g.fillText("Juggernaut", 0, 10);
	g.restore();

	// monster level 3 bullet
	g.save();
	g.translate(320, 192);
	g.fillStyle = "red";
	g.fillRect(4, 28, 60, 8);
	g.beginPath();
	g.restore();

	// terminator
	g.save();
	g.translate(384, 0);
	g.fillStyle = "rgb(255, 255, 255)";
	g.fillRect(0, 0, 64, 64);
	g.fillStyle = "red";
	g.beginPath();
	g.arc(16, 16, 5, 0, 2*Math.PI);
	g.fill();
	g.beginPath();
	g.arc(48, 48, 5, 0, 2*Math.PI);
	g.fill();
	g.restore();

	// terminator attacked
	g.save();
	g.translate(384, 64);
	g.fillStyle = "rgb(80, 80, 80)";
	g.fillRect(0, 0, 64, 64);
	g.fillStyle = "red";
	g.beginPath();
	g.arc(16, 16, 5, 0, 2*Math.PI);
	g.fill();
	g.beginPath();
	g.arc(48, 48, 5, 0, 2*Math.PI);
	g.fill();
	g.restore();

	// terminator name
	g.save();
	g.translate(384, 128);
	g.fillStyle = "white";
	g.font = "14px Times"
	g.fillText("???", 0, 10);
	g.restore();

	// terminator bullet
	g.save();
	g.save();
	g.translate(384, 192);
	g.fillStyle = "yellow";
	g.fillRect(4, 28, 60, 8);
	g.beginPath();
	g.restore();

}

function inputListenerRegistration() {
	document.addEventListener('keydown', function(e) {
		if (e.which == KeyEvent.DOM_VK_LEFT) {
			commands["MOVE_LEFT"] = true;
		}
		if (e.which == KeyEvent.DOM_VK_RIGHT) {
			commands["MOVE_RIGHT"] = true;
		}
		if (e.which == KeyEvent.DOM_VK_UP) {
			commands["JUMP"] = true;
		}
		if (e.which == KeyEvent.DOM_VK_DOWN) {
			commands["MOVE_DOWN"] = true;
		}
		if (e.which == KeyEvent.DOM_VK_SPACE) {
			commands["SHOOT"] = true;
		}
	});

	document.addEventListener('keyup', function(e) {
		if (e.which == KeyEvent.DOM_VK_LEFT) {
			commands["MOVE_LEFT"] = false;
		}
		if (e.which == KeyEvent.DOM_VK_RIGHT) {
			commands["MOVE_RIGHT"] = false;
		}
		if (e.which == KeyEvent.DOM_VK_UP) {
			commands["JUMP"] = false;
		}
		if (e.which == KeyEvent.DOM_VK_DOWN) {
			commands["MOVE_DOWN"] = false;
		}
		if (e.which == KeyEvent.DOM_VK_SPACE) {
			commands["SHOOT"] = false;
		}
	});
}

function initialize() {
	display = document.getElementById("display");
	prepareSprite();
	inputListenerRegistration();
}

document.addEventListener("DOMContentLoaded", function() {
	initialize();
	announcement = document.getElementById("announcement");
	announcement.delta = 0;
});

function startGame() {
	var g = display.getContext('2d');
	g.fillRect(0, 0, display.width, display.height);
	var map = new Map(2400, 2400);
	map.randomBuild();
	map.render(g, 0, 0, 1024, 640);
	var camera = new Camera(0, 0, map);
	var player = new Player(200, 200);
	player.render(g, 0, 0);

	world = new World(camera, map, player);
	gameLoop = setInterval(function() {
		g.fillRect(0, 0, display.width, display.height);
		world.update();
		world.render(g);
		announcement.delta--;
		if (announcement.delta < 0) announcement.delta = 0;
		announcement.style.setProperty("opacity", announcement.delta / 350);
	}, 1000/60)
}

function displayText(text) {
	announcement.innerHTML = text;
	announcement.delta = 350;
}
























function Camera(left, top) {
	this.left = left;
	this.top = top;
	this.width = display.width;
	this.height = display.height;
	this.speed = 0.8;
}

Camera.prototype.moveTo = function(left, top) {
	var dleft = left - this.left - display.width/2;
	var dtop = top - this.top - display.height/2;
	var moved = false;
	if (Math.abs(this.left - left - display.width/2) > 4*this.speed) {
		moved = true;
		this.left += dleft * 0.02;
	}
	if (Math.abs(this.top - top - display.height/2) > 4*this.speed) {
		moved = true;
		this.top += dtop * 0.1;
	}
}

Camera.prototype.render = function(g, renderable) {
	renderable.render(g, this.left, this.top, display.width, display.height);
}























function Map(width, height) {
	this.width = width;
	this.height = height;
	this.platforms = [];
	this.enemies = [];
	this.onCamera = [];
}

Map.prototype.randomBuild = function() {
	var tw = 64;
	var th = 128;
	for (var left = 0; left < this.width; left += tw) {
		for (var top = 0; top < this.height; top += th) {
			if (Math.random() < 0.525) {
				this.platforms.push(new Platform(left, top));
			}
		}
	}
	for(var i = 0; i < 40; ++i){
		var idx = Math.floor(Math.random() * this.platforms.length);
		this.enemies.push(new Peon(this.platforms[idx].left, this.platforms[idx].top - 80));
	}
}


Map.prototype.spawnItem = function(items) {
	if (Math.random() < 0.007) {
		var i = Math.floor(Math.random() * this.platforms.length);
		var potion = new Potion(this.platforms[i].left, this.platforms[i].top - 80);
		items.push(potion);
	}
	if (Math.random() < 0.002) {
		var i = Math.floor(Math.random() * this.platforms.length);
		var warFlask = new WarFlask(this.platforms[i].left, this.platforms[i].top - 80);
		items.push(warFlask);
	}
}

Map.prototype.render = function(g, left, top, width, height) {
	this.onCamera = [];
	for (var i = 0; i < this.platforms.length; ++i) {
		var p = this.platforms[i];
		if (p.left + p.width/2 + 100 < left || p.left - p.width/2 - 100 > left + width) continue;
		if (p.top + p.height/2 + 100 < top || p.top - p.width/2 - 100 > top + height) continue;
		p.render(g, left, top);
		this.onCamera.push(p);
	}
}






















function Platform(left, top) {
	this.left = left;
	this.top = top;
	this.width = 64;
	this.height = 16;
}

Platform.prototype.render = function(g, left, top) {
	g.save();
	g.translate(this.left - left, this.top - top);
	g.globalAlpha = 0.95;
	g.fillStyle = "rgb(230,225,214)";
	g.fillRect(-this.width/2, -this.height/2, this.width, this.height);
	g.restore();
}




























function Player(left, top) {
	this.left = left;
	this.top = top;
	this.width = CONSTANT.PLAYER.WIDTH;
	this.height = CONSTANT.PLAYER.HEIGHT;
	this.facing = "RIGHT";
	this.upThrust = 8.3;
	this.speed = 3;
	this.verticalVelocity = 0;
	this.horizontalVelocity = 0;
	this.canJump = false;
	this.health = 100;
	this.fullHealth = 100;
	this.regeneration = 0.03;
	this.alive = true;
	this.weapon = new Weapon(this);
	this.weapon.color = "rgb(100,255,200)";
	this.rampageDelta = 0;
}

Player.prototype.render = function(g, left, top, width, height) {
	var curTime = Date.now();
	g.save();
	g.translate(this.left - left, this.top - top);
	if (this.facing == "LEFT") g.scale(-1, 1);
	
	if (this.rampageDelta > 0) {
		g.drawImage(buffer, CONSTANT.PLAYER.SRC.X, CONSTANT.PLAYER.SRC.Y + 128,
		CONSTANT.PLAYER.SRC.WIDTH, CONSTANT.PLAYER.SRC.HEIGHT,
		-CONSTANT.PLAYER.WIDTH/2, -CONSTANT.PLAYER.HEIGHT/2, 
		CONSTANT.PLAYER.WIDTH, CONSTANT.PLAYER.HEIGHT);
	} else {
		g.drawImage(buffer, CONSTANT.PLAYER.SRC.X, CONSTANT.PLAYER.SRC.Y,
		CONSTANT.PLAYER.SRC.WIDTH, CONSTANT.PLAYER.SRC.HEIGHT,
		-CONSTANT.PLAYER.WIDTH/2, -CONSTANT.PLAYER.HEIGHT/2, 
		CONSTANT.PLAYER.WIDTH, CONSTANT.PLAYER.HEIGHT);
	}

	if (curTime - this.lastHit < CONSTANT.HIT_EFFECT_PERIOD) {
		g.drawImage(buffer, CONSTANT.PLAYER.SRC.X, CONSTANT.PLAYER.SRC.Y + 64,
		CONSTANT.PLAYER.SRC.WIDTH, CONSTANT.PLAYER.SRC.HEIGHT,
		-CONSTANT.PLAYER.WIDTH/2, -CONSTANT.PLAYER.HEIGHT/2, 
		CONSTANT.PLAYER.WIDTH, CONSTANT.PLAYER.HEIGHT);
	}

	g.restore();


	if (curTime - this.lastLevelUp < CONSTANT.LEVEL_UP_PERIOD) {
		g.save();
		g.translate(this.left - left, this.top - top);
		g.drawImage(buffer, 192, 0, 64, 64, -32, -62, 64, 64);
		g.restore();
	}

	this.renderHealthBar(g, left, top, width, height);
}

Player.prototype.renderHealthBar = function(g, left, top, width, height) {
	g.save();
	g.translate(this.left - left, this.top - top);
	g.fillStyle = "rgb(255,100,100)";
	g.globalAlpha = 1;
	g.fillRect(-CONSTANT.MONSTER.WIDTH/2 + 4, -CONSTANT.MONSTER.HEIGHT/2 - 10, CONSTANT.MONSTER.WIDTH - 8, 4);
	g.fillStyle = "rgb(120,200,255)";
	g.globalAlpha = 1;
	g.fillRect(-CONSTANT.MONSTER.WIDTH/2 + 4, -CONSTANT.MONSTER.HEIGHT/2 - 10, (this.health/this.fullHealth)*(CONSTANT.MONSTER.WIDTH - 8), 4);
	g.restore();
}


Player.prototype.update = function(world) {
	if(!this.alive) return;
	world.gravityEffect(this);
	if (commands["SHOOT"]) {
		this.shootCommandHandler(world);
	}
	if (commands["JUMP"] && this.canJump) {
		this.canJump = false;
		this.verticalVelocity = -this.upThrust;
	}
	if (commands["MOVE_LEFT"]) {
		this.facing = "LEFT";
		if(this.canJump) this.left -= this.speed;
		else {
			this.horizontalVelocity -= 0.8;
		}
	}
	else if (commands["MOVE_RIGHT"]) {
		this.facing = "RIGHT";
		if (this.canJump) this.left += this.speed;
		else {
			this.horizontalVelocity += 0.8;
		}
	}
	if (!this.canJump) {
		if(Math.abs(this.horizontalVelocity) > this.speed) {
			this.horizontalVelocity = (this.horizontalVelocity > 0 ? this.speed : -this.speed);
		}
		this.left += this.horizontalVelocity;
		this.horizontalVelocity *= 0.97;
	}
	if (commands["MOVE_DOWN"]) this.canJump = false;
	this.top += this.verticalVelocity;

	// regenerative
	this.health += this.regeneration;
	if (this.health >= this.fullHealth) this.health = this.fullHealth;

	if (this.top > world.map.height + 500) this.alive = false;
	if (this.rampageDelta > 0) this.rampageDelta--;
}

Player.prototype.setOnGround = function(top) {
	this.top = top;
	this.verticalVelocity = 0;
	this.horizontalVelocity = 0;
	this.canJump = true;
}

Player.prototype.shootCommandHandler = function(world) {
	var bLeft = (this.facing == "LEFT" ? this.left - this.width/2 - 10: this.left + this.width/2 + 10);
	var bTop = this.top;
	this.weapon.shoot(world, bLeft, bTop, this.facing);
}

Player.prototype.receiveDamage = function(damage) {
	if (this.rampageDelta > 0) return;
	this.lastHit = Date.now();

	this.health -= damage;
	if (this.health <= 0) {
		this.health = 0;
		this.alive = false;
	}

}

Player.prototype.killingReward = function() {
	this.lastLevelUp = Date.now();
	var ratio = this.health/this.fullHealth;
	this.fullHealth += 30;
	this.health = this.fullHealth * ratio;
	this.weapon.atk += 1;
	this.weapon.agi -= 10;
	if (this.weapon.agi < 100) this.weapon.agi = 100;
}





























function Bullet(left, top, velocity, timeToLive, color, damage, owner) {
	this.left = left;
	this.top = top;
	this.width = 40;
	this.height = 6;
	this.velocity = velocity;
	this.timeToLive = timeToLive;
	this.initialTimeToLive = timeToLive;
	this.color = color;
	this.damage = damage;
	this.owner = owner;
	this.alive = true;
}

Bullet.prototype.render = function(g, left, top, width, height) {
	if (!this.alive) return;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	g.fillStyle = this.color;
	g.globalAlpha = this.timeToLive / this.initialTimeToLive + 0.2;
	if (g.globalAlpha > 1) g.globalAlpha = 1;
	g.fillRect(-this.width/2, -this.height/2, this.width, this.height);
	g.restore();
}

Bullet.prototype.update = function(world) {
	if (!this.alive) return;
	this.left += this.velocity;
	this.timeToLive -= 1;
	if (this.timeToLive < 0) this.alive = false;
}

Bullet.prototype.checkCollision = function(sprite) {
	if (sprite == this.owner) return false;
	if ((this.owner instanceof Enemy) && (sprite instanceof Enemy)) return false;
	if (this.left - this.width/2 > sprite.left + sprite.width/2 || this.left + this.width/2 < sprite.left - sprite.width/2) return false;
	if (this.top - this.height/2 > sprite.top + sprite.height/2 || this.top + this.height/2 < sprite.top - sprite.height/2) return false;
	return true;
}

Bullet.prototype.getDamage = function() {
	var dmg = this.timeToLive / this.initialTimeToLive * this.damage;
	if (dmg < this.damage/3) dmg = this.damage / 3;
	return dmg;
}




























function Weapon(owner) {
	this.atk = 10;
	this.agi = 700;
	this.lastShot = 0;
	this.speed = 11.5;
	this.range = 100;
	this.owner = owner;
	this.color =  "white";
	this.WeaponBullet = Bullet;
}

Weapon.prototype.shoot = function(world, left, top, facing) {
	var curTime = Date.now();
	if (this.owner.rampageDelta <= 0 && curTime - this.lastShot < this.agi) return;
	this.lastShot = curTime;
	var bVel = this.speed;
	bVel *= (facing == "LEFT" ? -1 : 1);
	var bullet = new this.WeaponBullet(left, top, bVel, this.range, (this.owner.rampageDelta > 0 ? "orange" : this.color), this.atk, this.owner);
	bullet.facing = facing;
	world.bullets.push(bullet);
}



























function World(camera, map, me) {
	this.camera = camera;
	this.me = me;
	this.map = map;
	this.others = [];
	this.enemies = map.enemies;
	map.enemies = [];
	this.items = [];
	this.bullets = [];
	this.gravity = 0.23;
	this.deathRow = [];
	this.story = 0;
	this.storyShown = false;
	this.killCount = 0;
	this.completed = false;
	this.terminatorCount = 0;
}

World.prototype.addOther = function(other) {
	this.others.push(other);
}

World.prototype.update = function() {
	if (this.completed) {
		displayText("Congratulations, you've completed your quest.<br>The end.");
		return;
	}
	if (!this.me.alive) {
		displayText("You have died on your quest.");
		return;
	}
	this.storyLine();
	this.me.update(this);
	this.collisionHandler(this.me);

	var aliveBullet = [];
	for (var i = 0; i < this.bullets.length; ++i) {
		this.bullets[i].update(this);
		if (this.bullets[i].alive) aliveBullet.push(this.bullets[i]);
	}
	this.bullets = aliveBullet;

	var aliveEnemies = [];
	for (var i = 0; i < this.enemies.length; ++i) {
		this.enemies[i].update(this);
		this.collisionHandler(this.enemies[i]);
		if (this.enemies[i].decay > 0) aliveEnemies.push(this.enemies[i]);
		else if(this.enemies[i].evolution != null) this.deathRow.push(this.enemies[i]);
	}
	this.enemies = aliveEnemies;

	this.map.spawnItem(this.items);

	var aliveItems = [];
	for (var i = 0; i < this.items.length; ++i) {
		this.items[i].update(this);
		this.collisionHandler(this.items[i]);
		if (this.items[i].alive) aliveItems.push(this.items[i]);
	}
	this.items = aliveItems;


	if (Math.random() > 0.05 && this.deathRow.length > 0) {
		var respawn = this.deathRow.pop();
		var i = Math.floor(Math.random() * this.map.platforms.length);
		var left = this.map.platforms[i].left;
		var top = this.map.platforms[i].top;
		if(respawn.evolution == Terminator) {
			if (this.terminatorCount == 0) {
				this.enemies.push(new respawn.evolution(left, top - 80));
				this.updateStory(12);
				this.terminatorCount = 1;
			}
		} else {
			this.enemies.push(new respawn.evolution(left, top - 80));
		}
	}

}

World.prototype.gravityEffect = function(sprite) {
	sprite.verticalVelocity += this.gravity;
}

World.prototype.collisionHandler = function(sprite) {
	// collision handler with platform
	if ((sprite != this.me || !commands["MOVE_DOWN"]) && sprite.verticalVelocity >= 0) {
		for (var i = 0; i < this.map.onCamera.length; ++i) {
			var p = this.map.onCamera[i];
			if (p.left - p.width/2 > sprite.left + sprite.width/2.3 || p.left + p.width/2 < sprite.left - sprite.width/2.3) continue;
			if (p.top - p.height/2 > sprite.top + sprite.height/2 || p.top + p.height/2 < sprite.top - sprite.height/2) continue;
			if (sprite.top + sprite.height/2.5 < p.top){
				sprite.setOnGround(p.top - p.height/2 - sprite.height/2);
			}
			break;
		}
	}

	// collision handler for each bullet
	for (var i = 0; i < this.bullets.length; ++i) {
		var b = this.bullets[i];
		for (var j = 0; j < this.enemies.length; ++j) {
			var e = this.enemies[j];
			if(b.alive && e.alive && b.checkCollision(e)) {
				b.alive = false;
				e.receiveDamage(b.getDamage());
				if (!e.alive) {
					b.owner.killingReward();
					this.killCount++;
					if (e instanceof Terminator) {
						this.updateStory(20);
					}
				}
				break;
			}
		}
		if (b.alive) {
			if (b.checkCollision(this.me)) {
				b.alive = false;
				this.me.receiveDamage(b.getDamage());
			}
		}
	}

	for (var i = 0; i < this.items.length; ++i) {
		if(this.items[i].checkCollision(this.me)) {
			this.items[i].use(this.me);
			break;
		}
	}

}

World.prototype.collisionCheck = function(sprite) {
	for (var i = 0; i < this.map.onCamera.length; ++i) {
		var p = this.map.onCamera[i];
		if (p.left - p.width/2 > sprite.left + sprite.width/10 || p.left + p.width/2 < sprite.left - sprite.width/10) continue;
		if (p.top - p.height/2 > sprite.top + sprite.height/2 + 10 || p.top + p.height/2 < sprite.top - sprite.height/2) continue;
		return true;
	}
	return false;
}

World.prototype.render = function(g) {
	this.camera.moveTo(this.me.left, this.me.top);
	this.camera.render(g, this.map);
	this.camera.render(g, this.me);
	for (var i = 0; i < this.bullets.length; ++i) {
		this.camera.render(g, this.bullets[i]);
	}

	for (var i = 0; i < this.enemies.length; ++i) {
		this.camera.render(g, this.enemies[i]);
	}
	for (var i = 0; i < this.items.length; ++i) {
		this.camera.render(g, this.items[i]);
	}
}

World.prototype.storyLine = function() {
	if (this.story == 0) {
		this.showStory("I've seen the truth... But they haven't");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 1) {
		this.showStory("My friends.. I was one of you..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 2) {
		this.showStory("Oblivious that we are serving the dark");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 3) {
		this.showStory("I have to escape from this abysmal reality.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 4) {
		this.showStory("I have to cross this path..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 5) {
		this.showStory("and I must kill you all.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.killCount > 25) {
		this.story = Math.max(this.story, 7);
	}
	if (this.story == 7) {
		this.showStory("This blood on my hand.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 8) {
		this.showStory("On my path to the light..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 9) {
		this.showStory("Am I no different from them");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 10) {
		this.showStory("have I become the dark itself?");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}

	if (this.story == 12) {
		this.showStory("???: I am the sole creator of the universe.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 13) {
		this.showStory("???: I am omnipotent and omnipresent.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 14) {
		this.showStory("???: Abandon your quest now, and I will show mercy.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 15) {
		this.showStory("....");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 16) {
		this.showStory("I need no mercy..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 17) {
		this.showStory("not even from the god.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 18) {
		this.showStory("???: Challenge me and perish, young mortal.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}

	if (this.story == 20) {
		this.showStory("???: How..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 21) {
		if(!this.storyShown) {
			for (var i = 0; i < this.enemies.length; ++i) {
				this.enemies[i].alive = false;
				this.enemies[i].evolution = null;
			}
			this.deathRow = [];
		}
		this.showStory("???: does my own creation...");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}

	if (this.story == 22) {
		this.showStory("I have slaughtered all that remain..");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
		}
	}
	if (this.story == 23) {
		this.showStory("..of my kind.");
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
			this.completed = true;
		}
	}
	if (this.story == 24) {
		if (this.storyShown && announcement.delta <= 0) {
			this.story++;
			this.storyShown = false;
			this.completed = true;
		}
	}
}

World.prototype.showStory = function(story) {
	if (this.storyShown) return;
	displayText(story);
	this.storyShown = true;
}

World.prototype.updateStory = function(level) {
	if (this.story < level) {
		this.story = level;
		this.storyShown = false;
	}
}
























function Enemy(left, top, aggresiveDistance) {
	Player.call(this, left, top);
	this.speed = 1.4;
	this.width = 40;
	this.upThrust = 5;
	this.health = 40;
	this.fullHealth = 40;
	this.aggresiveDistance = aggresiveDistance;
	this.weapon.agi = 1700;
	this.weapon.atk = 15;
	this.weapon.range = 60;
	this.weapon.speed = this.speed + 8.5;
	this.regeneration = 0.0001;
	this.weapon.color = "rgb(255,57,52)";
	this.isEngaged = false;
	this.decay = 50;
	this.decayRate = 50;
	this.flyShiftTendency = 0.4;
}

Enemy.prototype = Object.create(Player.prototype);

Enemy.prototype.render = function(g, left, top, width, height) {
	if(this.decay == 0) return;
	var curTime = Date.now();
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	if(!this.alive) {
		this.decay--;
		g.rotate(Math.PI/2 * (this.decayRate-this.decay)/this.decayRate);
		g.globalAlpha = (this.decay)/this.decayRate;
	}
	if (this.facing == "LEFT") g.scale(-1, 1);
	this.renderBody(g, left, top, width, height);

	if (curTime - this.lastHit < CONSTANT.HIT_EFFECT_PERIOD) {
		this.renderAttackedBody(g, left, top, width, height);
	}

	g.restore();

	this.renderHealthBar(g, left, top, width, height);
	g.save();
	g.translate(this.left - left, this.top - top);
	this.renderName(g, left, top, width, height);
	g.restore();
}

Enemy.prototype.renderBody = function(g, left, top, width, height) {
	g.drawImage(buffer, CONSTANT.MONSTER.SRC.X, CONSTANT.MONSTER.SRC.Y,
		CONSTANT.MONSTER.SRC.WIDTH, CONSTANT.MONSTER.SRC.HEIGHT,
		-CONSTANT.MONSTER.WIDTH/2, -CONSTANT.MONSTER.HEIGHT/2, 
		CONSTANT.MONSTER.WIDTH, CONSTANT.MONSTER.HEIGHT);
}

Enemy.prototype.renderAttackedBody = function(g, left, top, width, height) {
	g.drawImage(buffer, CONSTANT.MONSTER.SRC.X, CONSTANT.MONSTER.SRC.Y + 64,
		CONSTANT.MONSTER.SRC.WIDTH, CONSTANT.MONSTER.SRC.HEIGHT,
		-CONSTANT.MONSTER.WIDTH/2, -CONSTANT.MONSTER.HEIGHT/2, 
		CONSTANT.MONSTER.WIDTH, CONSTANT.MONSTER.HEIGHT);
}

Enemy.prototype.renderName = function(g, left, top, width, height) {
	g.drawImage(buffer, CONSTANT.MONSTER.SRC.X, CONSTANT.MONSTER.SRC.Y + 128,
		CONSTANT.MONSTER.SRC.WIDTH, CONSTANT.MONSTER.SRC.HEIGHT,
		-CONSTANT.MONSTER.WIDTH/2 + 5, -CONSTANT.MONSTER.HEIGHT/2 - 24, 
		CONSTANT.MONSTER.WIDTH, CONSTANT.MONSTER.HEIGHT);
}

Enemy.prototype.update = function(world) {
	if(!this.alive) return;
	var curTime = Date.now();
	var left = world.camera.left;
	var top = world.camera.top;
	var width = world.camera.width;
	var height = world.camera.height;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	world.gravityEffect(this);
	var dist = this.distanceFrom(world.me);
	var dx = world.me.left - this.left;

	if (dist < this.aggresiveDistance) {
		if (Math.abs(dx) > this.width + 10) {
			if (dx < 0) this.facing = "LEFT";
			else this.facing = "RIGHT;"
			if(this.canJump) {
				this.left += (this.facing == "LEFT" ? -this.speed : this.speed);
				if (!world.collisionCheck(this)) {
					this.left -= (this.facing == "LEFT" ? -this.speed : this.speed);
				}
			} else {
				this.horizontalVelocity += (dx < 0 ? -this.flyShiftTendency : this.flyShiftTendency);
			}
		}
		if (this.isEngaged) this.shootCommandHandler(world);
		else {
			this.isEngaged = true;
			this.weapon.lastShot = curTime - 800;
		}
	} else {
		this.isEngaged = false;
	}

	if (Math.random() < 0.005 && this.canJump) {
		this.canJump = false;
		this.verticalVelocity = -this.upThrust;
	}
	if (!this.canJump) {
		if(Math.abs(this.horizontalVelocity) > this.speed) {
			this.horizontalVelocity = (this.horizontalVelocity > 0 ? this.speed : -this.speed);
		}
		this.left += this.horizontalVelocity;
		this.horizontalVelocity *= 0.77;
	}
	this.top += this.verticalVelocity;

	if (this.top > world.map.height + 80) {
		this.verticalVelocity = 0;
		var i = Math.floor(Math.random() * world.map.platforms.length);
		var p = world.map.platforms[i];
		this.left = p.left;
		this.top = p.top - 80;
	}

}

Enemy.prototype.distanceFrom = function(sprite) {
	var dx = sprite.left - this.left;
	var dy = sprite.top - this.top;
	return Math.sqrt(dx*dx + dy*dy);
}





























function Peon(left, top) {
	Enemy.call(this, left, top, 380);
	this.evolution = Omega;
}

Peon.prototype = Object.create(Enemy.prototype);





























function Omega(left, top) {
	Enemy.call(this, left, top, 420);
	this.width = 64;
	this.height = 60;


	this.speed = 2.4;
	this.upThrust = 6;
	this.health = 230;
	this.fullHealth = 230;
	this.weapon.agi = 1000;
	this.weapon.atk = 55;
	this.weapon.range = 80;
	this.regeneration = 0.003;
	this.weapon.WeaponBullet = OmegaBullet;
	this.isEngaged = false;
	this.decay = 50;
	this.decayRate = 50;
	this.flyShiftTendency = 0.5;
	this.evolution = Juggernaut;
}

Omega.prototype = Object.create(Enemy.prototype);

Omega.prototype.renderBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 256, 0, 64, 64, -32, -32, 64, 64);
}

Omega.prototype.renderAttackedBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 256, 64, 64, 64, -32, -32, 64, 64);
}

Omega.prototype.renderName = function(g, left, top, width, height) {
	g.fillStyle = "red";
	g.drawImage(buffer, 256, 128, 64, 64, -32 + 5, -32 - 24, 64, 64);
}






























function OmegaBullet(left, top, velocity, range, color, atk, owner) {
	Bullet.call(this, left, top, velocity, range, "black", atk, owner);
	this.width = 64;
	this.height = 40;
}

OmegaBullet.prototype = Object.create(Bullet.prototype);

OmegaBullet.prototype.render = function(g, left, top, width, height) {
	if (!this.alive) return;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	if (this.facing == "LEFT") g.scale(-1, 1);
	g.globalAlpha = this.timeToLive / this.initialTimeToLive + 0.2;
	if (g.globalAlpha > 1) g.globalAlpha = 1;
	g.drawImage(buffer, 256, 192, 64, 64, -32, -32, 64, 64);
	g.restore();
}




























function Juggernaut(left, top) {
	Enemy.call(this, left, top, 300);
	this.width = 64;
	this.height = 60;


	this.speed = 2.4;
	this.upThrust = 7.2;
	this.health = 2500;
	this.fullHealth = 2500;
	this.weapon.agi = 900;
	this.weapon.atk = 200;
	this.weapon.range = 80;
	this.regeneration = 0.001;
	this.weapon.WeaponBullet = JuggernautBullet;
	this.isEngaged = false;
	this.decay = 50;
	this.decayRate = 50;
	this.flyShiftTendency = 0.8;
	this.evolution = Terminator;
}

Juggernaut.prototype = Object.create(Enemy.prototype);

Juggernaut.prototype.renderBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 320, 0, 64, 64, -32, -32, 64, 64);
}

Juggernaut.prototype.renderAttackedBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 320, 64, 64, 64, -32, -32, 64, 64);
}

Juggernaut.prototype.renderName = function(g, left, top, width, height) {
	g.drawImage(buffer, 320, 128, 64, 64, -32 + 5, -32 - 24, 64, 64);
}





















function JuggernautBullet(left, top, velocity, range, color, atk, owner) {
	Bullet.call(this, left, top, velocity, range, "black", atk, owner);
	this.width = 64;
	this.height = 40;
}

JuggernautBullet.prototype = Object.create(Bullet.prototype);

JuggernautBullet.prototype.render = function(g, left, top, width, height) {
	if (!this.alive) return;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	if (this.facing == "LEFT") g.scale(-1, 1);
	g.globalAlpha = this.timeToLive / this.initialTimeToLive + 0.2;
	if (g.globalAlpha > 1) g.globalAlpha = 1;
	g.drawImage(buffer, 320, 192, 64, 64, -32, -32, 64, 64);
	g.restore();
}




























function Terminator(left, top) {
	Enemy.call(this, left, top, 500);
	this.width = 64;
	this.height = 60;


	this.speed = 2.4;
	this.upThrust = 7.2;
	this.health = 15000;
	this.fullHealth = 15000;
	this.weapon.agi = 800;
	this.weapon.atk = 500;
	this.weapon.range = 100;
	this.regeneration = 0.001;
	this.weapon.WeaponBullet = TerminatorBullet;
	this.isEngaged = false;
	this.decay = 50;
	this.decayRate = 50;
	this.flyShiftTendency = 0.8;
}

Terminator.prototype = Object.create(Enemy.prototype);

Terminator.prototype.renderBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 384, 0, 64, 64, -32, -32, 64, 64);
}

Terminator.prototype.renderAttackedBody = function(g, left, top, width, height) {
	g.drawImage(buffer, 384, 64, 64, 64, -32, -32, 64, 64);
}

Terminator.prototype.renderName = function(g, left, top, width, height) {
	g.drawImage(buffer, 384, 128, 64, 64, -32 + 5, -32 - 24, 64, 64);
}





















function TerminatorBullet(left, top, velocity, range, color, atk, owner) {
	Bullet.call(this, left, top, velocity, range, "black", atk, owner);
	this.width = 64;
	this.height = 64;
}

TerminatorBullet.prototype = Object.create(Bullet.prototype);

TerminatorBullet.prototype.render = function(g, left, top, width, height) {
	if (!this.alive) return;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	if (this.facing == "LEFT") g.scale(-1, 1);
	g.globalAlpha = this.timeToLive / this.initialTimeToLive + 0.2;
	if (g.globalAlpha > 1) g.globalAlpha = 1;
	g.drawImage(buffer, 384, 192, 64, 64, -32, -32, 64, 64);
	g.restore();
}


























function Potion(left, top) {
	Player.call(this, left, top);
	this.left = left;
	this.top = top;
	this.width = 40;
	this.height = 64;
	this.alive = true;
	this.verticalVelocity = 0;
	this.decay = 500;
}

Potion.prototype = Object.create(Player.prototype);

Potion.prototype.update = function(world) {
	if(!this.alive) return;
	this.decay --;
	if (this.decay == 0) this.alive = false;
	var left = world.camera.left;
	var top = world.camera.top;
	var width = world.camera.width;
	var height = world.camera.height;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	world.gravityEffect(this);
	this.top += this.verticalVelocity;
}

Potion.prototype.render = function(g, left, top, width, height) {
	if (!this.alive) return;
	if (this.left + this.width/2 < left || this.left - this.width/2 > left + width) return;
	if (this.top + this.height/2 < top || this.top - this.width/2 > top + height) return;
	g.save();
	g.translate(this.left - left, this.top - top);
	g.globalAlpha = this.decay/500 + 0.5;
	if (g.globalAlpha > 1) g.globalAlpha = 1;
	this.renderItem(g, left, top, width, height);

	g.restore();

}

Potion.prototype.renderItem = function(g, left, top, width, height) {
	g.drawImage(buffer, CONSTANT.POTION.SRC.X, CONSTANT.POTION.SRC.Y,
		CONSTANT.POTION.SRC.WIDTH, CONSTANT.POTION.SRC.HEIGHT,
		-CONSTANT.POTION.WIDTH/2, -CONSTANT.POTION.HEIGHT/2, 
		CONSTANT.POTION.WIDTH, CONSTANT.POTION.HEIGHT);
}


Potion.prototype.checkCollision = function(sprite) {
	if (sprite instanceof Enemy) return false;
	if (this.left - this.width/2 > sprite.left + sprite.width/2 || this.left + this.width/2 < sprite.left - sprite.width/2) return false;
	if (this.top - this.height/2 > sprite.top + sprite.height/2 || this.top + this.height/2 < sprite.top - sprite.height/2) return false;
	return true;
}

Potion.prototype.use = function(sprite) {
	if (!this.alive) return;
	sprite.health = sprite.fullHealth;
	this.alive = false;
}





























function WarFlask(left, top) {
	Potion.call(this, left, top);
}

WarFlask.prototype = Object.create(Potion.prototype);

WarFlask.prototype.use = function(sprite) {
	if(!this.alive) return;
	sprite.rampageDelta = 400;
	this.alive = false;
}

WarFlask.prototype.renderItem = function(g, left, top, width, height) {
	g.drawImage(buffer, CONSTANT.POTION.SRC.X, CONSTANT.POTION.SRC.Y + 64,
		CONSTANT.POTION.SRC.WIDTH, CONSTANT.POTION.SRC.HEIGHT,
		-CONSTANT.POTION.WIDTH/2, -CONSTANT.POTION.HEIGHT/2, 
		CONSTANT.POTION.WIDTH, CONSTANT.POTION.HEIGHT);
}