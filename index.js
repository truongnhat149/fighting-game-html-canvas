const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
const valueVelocityDefault = 0;
const jumpVelocity = -20;
const rightVelocity = 5;
const leftVelocity = -5;

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
};


canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        },
        this.color = color;
        this.isAttacking;
    }

    draw() {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking){
            canvasContext.fillStyle = 'green';
            canvasContext.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height,
            )
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking =  true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
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
    },
    offset: {
        x: 0,
        y: 0
    },
});

const enemy = new Sprite({
    position : {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    },
});

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
            rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
            rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
            rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        );
};

function animate() {
    // background 
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = valueVelocityDefault;
    enemy.velocity.x = valueVelocityDefault;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = leftVelocity;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = rightVelocity;   
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = leftVelocity;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = rightVelocity;
    }

    // detect for collision
    if (
        rectangularCollision({
            rectangle1 : player,
            rectangle2 : enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        console.log('player is attacking');
    };

    if (
        rectangularCollision({
            rectangle1 : enemy,
            rectangle2 : player
        }) && 
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        console.log('enemy is attacking');
    }
};

animate();

  // event listeners
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // event player
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;
        case 'w':
            player.velocity.y = jumpVelocity;
        break;
        case 'z':
            player.attack();
        break;

        // event enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;
        case 'ArrowUp':
            enemy.velocity.y = jumpVelocity;
        break;
        case '/':
            enemy.attack();
        break;
    };
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    };

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});