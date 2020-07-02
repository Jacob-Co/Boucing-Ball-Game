// setup canvas

const header1 = document.querySelector('h1');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define Ball constructor

function Shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = true;
}

function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
}

function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20);
  this.color = 'white';
  this.size = 10;
}

// Collision EvilCircle

EvilCircle.prototype.collisionDetect = function(ball) {
    const dx = this.x - ball.x;
    const dy = this.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + ball.size) {
      ball.exists = false;
    }
};

// EvilCircle.prototype.collisionDetect = function() {
//   for(let j = 0; j < balls.length; j++) {
//       const dx = this.x - balls[j].x;
//       const dy = this.y - balls[j].y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       if (distance < this.size + balls[j].size) {
//         balls[j].exists = false;
//       }
//   }

//   balls = balls.filter((ball) => ball.exists);
// };

// Draw an EvilCircle

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// Move EvilCircle

EvilCircle.prototype.setControls = function() {
  let _this = this;
  window.onkeydown = function(press) {
    switch(press.key.toLowerCase()) {
      case 'w':
        _this.y -= _this.velY;
        break;
      case 's':
        _this.y += _this.velY;
        break;
      case 'a':
        _this.x -= _this.velX;
        break;
      case 'd':
        _this.x += _this.velX;
        break;
    }
  }
};

// Check if EvilCircle hit the edge

EvilCircle.prototype.checkBounds = function() {
  if ((this.size + this.x) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.size + this.y) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-9, 9),
    random(-9, 9),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}

// create evil circle

let evilBall = new EvilCircle(width / 2 - 10, height / 2 - 10);

// Implement score counter
let scoreCounter = document.createElement('p');


// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  // update remaining balls
  balls = balls.filter((ball) => ball.exists);

  //update scoreCounter
  scoreCounter.textContent = `Ball remaining: ${balls.length}`;
  header1.appendChild(scoreCounter);

  evilBall.setControls();
  evilBall.draw();
  evilBall.checkBounds();

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    evilBall.collisionDetect(balls[i]);
  }

  requestAnimationFrame(loop);
}

loop();