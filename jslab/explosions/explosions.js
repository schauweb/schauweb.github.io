var DRAG = 0.8;
var MAX_AGE = 30;
var SPEED = 80;
var started = Date.now();
var canvas = document.getElementById("particles");
var ctx = canvas.getContext("2d");
var lastExplosion = 0;
var particles = [];
var screenH, screenW, reds, greens, blues, sizes;

function setWindowSize() {
	screenW = document.documentElement.clientWidth;
	screenH = document.documentElement.clientHeight;
	canvas.width = screenW;
	canvas.height = screenH;
}

setWindowSize();

window.addEventListener('resize', function () {
	setWindowSize();
});

function preCalculate() {
	reds = [];
	greens = [];
	blues = [];
	sizes = [];

	for (var i = 0; i < MAX_AGE; i++) {
		reds[i] = (255 - (i * (255 / MAX_AGE))) | 0;
		greens[i] = (230 - (i * (230 / MAX_AGE))) | 0;
		blues[i] = (128 - (i * (128 /  MAX_AGE))) | 0;
		sizes[i] = ((5 - (i * (5 / MAX_AGE))) | 0) + 1;
	}
}

function explode(x, y) {
	for (var i = 0; i < 100; i++) {
		var angle = Math.random() * 2 * Math.PI;
		var radius = Math.pow(Math.random(), 0.5);
		var vx = SPEED * radius * Math.sin(angle);
		var vy = SPEED * radius * Math.cos(angle);
		particles.push({
			x: x,
			y: y,
			vx: vx,
			vy: vy,
			age: 0,
		});
	}
}

function draw() {
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < particles.length; i++) {
		var p = particles[i];
		var a = p.age;
		ctx.fillStyle = "rgb(" + reds[a] + "," + greens[a] + "," + blues[a] + ")";
		ctx.fillRect(p.x, p.y, sizes[a], sizes[a]);
	}
}

function update(dt) {
	var newParticles = [];
	var drag = Math.pow(DRAG, dt);
	for (var i = 0; i < particles.length; i++) {
		var p = particles[i];

		if ((p.age + dt) > MAX_AGE) {
			continue;
		}

		p.vx *= drag;
		p.vy *= drag;
		p.x += p.vx * dt;
		p.y += p.vy * dt;
		p.age = (p.age + dt) | 0;
		newParticles.push(p);
	}

	particles = newParticles;
}

function loop() {
	window.requestAnimationFrame(loop);
	var timestamp = Date.now();
	if ((timestamp - lastExplosion) >= 1500) {
		var x = Math.random() * screenW;
		var y = Math.random() * screenH;
		explode(x, y);
		lastExplosion = timestamp;
	}

	var seconds = ((timestamp - lastExplosion) / 1000) | 0;

	update(seconds | 0);
	draw();
}

preCalculate();
loop();
