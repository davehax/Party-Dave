
/*

	AIM: Dave's giant head is partying. Make it party harder!
	
	Dave's head can:
		Shoot frickin laser beams
		Spray confetti
		Spawn disco balls

*/

// canvas help from https://github.com/lostdecade/simple_canvas_game/blob/master/js/game.js 
// confetti stolen from http://jsfiddle.net/vxP5q/61/

function TrueFalse () {
	return Math.random() > 0.5;
}

function Jitter() {
	return (Math.random() - 0.5) * 10;
}

// cross browser support for requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

// Handle keyboard controls
var controls = {
	spacebar: 32	
};
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


// Canvas
var canvas = document.getElementById("PartyTime");
canvas.height = 600;
canvas.width = 800;
var ctx = canvas.getContext("2d");

// Images
var ImageWrapper = function (src) {
	if (typeof src == "undefined") return null;

	var that = this;
	
	this.ready = false;
	this.img = new Image();
	this.img.onload = function () {
		console.log("Boss like");
		that.ready = true;
		
		
	}
	this.img.src = src;
	
	return that;
}

var bg = new ImageWrapper("img/background.png");
bg.x = 0;
bg.y = 0;

var dave = new ImageWrapper("img/dave-1.png");
dave.x = 272;
dave.y = 178;

var party1 = new ImageWrapper("img/party-time-1.png");
party1.x = 212;
party1.y = 110;

var party2 = new ImageWrapper("img/party-time-2.png");
party2.x = 242;
party2.y = 112;

var discoBall = new ImageWrapper("img/disco_ball.png");
var discoBall2 = new ImageWrapper("img/disco_ball2.png");
var discoBall3 = new ImageWrapper("img/disco_ball3.png");

var party = null;
var W;
var H;
var mp = 500; //max particles
var drawDave = 400;

var particles = [];
function fillConfetti () {
	W = canvas.width;
	H = canvas.height;
	
	for (var i = 0; i < mp; i++) {
		particles.push({
			x: Math.random() * W, //x-coordinate
	        y: Math.random() * H, //y-coordinate
	        r: randomFromTo(5, 50), //radius
	        d: (Math.random() * mp) + 10, //density
	        color: "rgba(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", 0.7)",
	        tilt: Math.floor(Math.random() * 10) - 10,
	        tiltAngleIncremental: (Math.random() * 0.07) + .05,
	        tiltAngle: 0
		})
		
	}
}


function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

var TiltChangeCountdown = 5;
//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;
var tiltAngle = 0;

function renderDiscoBalls() {
	if (discoBall.ready && discoBall2.ready && discoBall3.ready) {
		ctx.drawImage(discoBall2.img, -10 + Jitter(), -10 + Jitter());
		ctx.drawImage(discoBall3.img, 50 + Jitter(), -3 + Jitter());
		ctx.drawImage(discoBall.img, 80 + Jitter(), 5 + Jitter());
		ctx.drawImage(discoBall3.img, 150 + Jitter(), -1 + Jitter());
		ctx.drawImage(discoBall3.img, 250 + Jitter(), Jitter());
		ctx.drawImage(discoBall2.img, 360 + Jitter(), 4 + Jitter());
		ctx.drawImage(discoBall.img, 420 + Jitter(), -20 + Jitter());
		ctx.drawImage(discoBall2.img, 550 + Jitter(), 10 + Jitter());
		ctx.drawImage(discoBall3.img, 620 + Jitter(), 2 + Jitter());
		
		ctx.drawImage(discoBall2.img, 690 + Jitter(), Jitter());
		ctx.drawImage(discoBall.img, 720 + Jitter(), -70 + Jitter());
		ctx.drawImage(discoBall3.img, 790 + Jitter(), Jitter());
	
		//ctx.drawImage(discoBall.img, 70 + Jitter(), Jitter());
		//ctx.drawImage(discoBall.img, 560 + Jitter(), Jitter());
	}
}

function renderConfetti () {
	for (var i = 0; i < mp; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;  // Green path
        ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
        ctx.stroke();  // Draw it
        
        if (i == drawDave) {
        	renderDiscoBalls();
	        ctx.drawImage(party.img, party.x, party.y);
        }
    }
    
    updateConfetti();
}

function updateConfetti() {
	angle += 0.01;
    tiltAngle += 0.1;
    TiltChangeCountdown--;
    for (var i = 0; i < mp; i++) {
        
        var p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        //Updating X and Y coordinates
        //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
        //Every particle has its own density which can be used to make the downward movement different for each flake
        //Lets make it more random by adding in the radius
        p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) / 2;
        p.x += Math.sin(angle);
        //p.tilt = (Math.cos(p.tiltAngle - (i / 3))) * 15;
        p.tilt = (Math.sin(p.tiltAngle - (i / 3))) * 15;

        //Sending flakes back from the top when it exits
        //Lets make it a bit more organic and let flakes enter from the left and right also.
        if (p.x > W + 5 || p.x < -5 || p.y > H) {
            if (i % 5 > 0 || i % 2 == 0) //66.67% of the flakes
            {
                particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngle: p.tiltAngle, tiltAngleIncremental: p.tiltAngleIncremental };
            }
            else {
                //If the flake is exitting from the right
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                }
                else {
                    //Enter from the right
                    particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                }
            }
        }
    }
}

// Change Dave's face every 150ms... potentially
var bringTheParty = function () {
	
	var timestamp = Date.now();
	if (timestamp - lastParty > partyBreak) {
		if (TrueFalse()) {
			party = party1;
		}
		else {
			party = party2;
		}
		
		lastParty = timestamp;
	}
	
}

// The main render function. Will call all other rendering functions.
var render = function () {
	if (bg.ready) { ctx.drawImage(bg.img, bg.x, bg.y); }
	
	if (party != null && party.ready) {
		
		renderConfetti();
		
		//ctx.drawImage(party.img, party.x, party.y);
	}
	else if (dave.ready) {
		ctx.drawImage(dave.img, dave.x, dave.y);
	}
}

// main loop
var partyTime = function () {
	if (controls.spacebar in keysDown) {		
		bringTheParty();
	}
	else {
		party = null;
	}
	
	render();
	requestAnimationFrame(partyTime);
}

var then = Date.now();
var lastParty = Date.now();
var partyBreak = 250;

// begin the party
fillConfetti();
partyTime();

























