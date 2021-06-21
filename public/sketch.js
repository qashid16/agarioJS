// Keep track of our socket connection
var socket;
var blob;

var blobs = [];
var zoom = 1;

const MAPSIZE = 4;
const BALLSIZE = 7;

function setup() {
	createCanvas(1365, 580);
	imageMode(CENTER);

	// for (var i = 0; i < 50; i++) {
	// 	var x = random(-width*MAPSIZE, width*MAPSIZE);
	// 	var y = random(-height*MAPSIZE, height*MAPSIZE);
	// 	blobs.push(new Blob(x, y, BALLSIZE) );
	// }

	// Start a socket connection to the server
	// Some day we would run this server somewhere else
	socket = io.connect('http://localhost:3000');

	blob = new Blob(random(width), random(height), random(8, 24));
	// Make a little object with  and y
	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r
	};
	socket.emit('start', data);

	socket.on('heartbeat', function(data) {
		//console.log(data);
		blobs = data;

		// if (blobs.length<1000) {
		// 	var x = random(-width*MAPSIZE, width*MAPSIZE);
		// 	var y = random(-height*MAPSIZE, height*MAPSIZE);
		// 	blobs.push(new Blob(x, y, BALLSIZE+random(-2,18)) );
		// }
	});

	// for (var i = 0; i < 50; i++) {
	// 	var x = random(-width, width);
	// 	var y = random(-height, height);
	// 	blobs[i] = new Blob(x, y, BALLSIZE);
	// }
}

function draw() {
	background(128);
	console.log(blob.pos.x, blob.pos.y);

	translate(width / 2, height / 2);
	var newzoom = 64 / blob.r;
	zoom = lerp(zoom, newzoom, 0.1);
	scale(zoom);
	translate(-blob.pos.x, -blob.pos.y);

	for (var i = blobs.length - 1; i >= 0; i--) {
		var id = blobs[i].id;
		if (id.substring(2, id.length) !== socket.id) {
		fill(0, 0, 255);
		ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

		fill(255);
		textAlign(CENTER);
		textSize(4);
		text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r);
		}
		// blobs[i].show();
		// if (blob.eats(blobs[i])) {
		//   blobs.splice(i, 1);
		// }
	}

	blob.show();
	if (mouseIsPressed) {
		blob.update();
	}
	blob.constrain();

	var data = {
		x: blob.pos.x,
		y: blob.pos.y,
		r: blob.r
	};
	socket.emit('update', data);
}
