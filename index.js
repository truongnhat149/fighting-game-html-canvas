const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
const gravity = 0.2;

canvas.width = 1024;
canvas.height = 576;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
    }

    draw() {
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }
}

const player = new Sprite({
    position : {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
});

console.log(player);

const enemy = new Sprite({
    position : {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
});

function animate() {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
  }
  
  animate()