const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
const valueVelocityDefault = 0;
const jumpVelocity  = -20;
const rightVelocity = 5;
const leftVelocity  = -5;
const healthBlood = 20;
const upFrame = 96; // standing on the frame
const playerHealth = document.querySelector('#player-health-before');
const enemyHealth = document.querySelector('#enemy-health-before');
const displayText = document.querySelector('#display-text');
const displayTime = document.querySelector('#timer');

let timer = 60;
let timerId;

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


const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/img/background.png',
});

const shop = new Sprite({
    position : {
        x: 600,
        y: 128
    },
    imageSrc: './assets/img/shop.png',
    scale: 2.75,
    framesMax: 6,
});

const player = new Fighter({
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
    imageSrc: './assets/img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: { // animation
        idle: {
            imageSrc: './assets/img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack2: {
            imageSrc: './assets/img/samuraiMack/Attack2.png',
            framesMax: 6,
        },
    },

});

const enemy = new Fighter({
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
    imageSrc: './assets/img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: { // animation
        idle: {
            imageSrc: './assets/img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/img/kenji/Fall.png',
            framesMax: 2,
        },
        attack2: {
            imageSrc: './assets/img/kenji/Attack1.png',
            framesMax: 4,
        },
    },
});


function animate() {
    // background 
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = valueVelocityDefault;
    enemy.velocity.x = valueVelocityDefault;

    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = leftVelocity;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = rightVelocity;   
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    };

    // player jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }


    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = leftVelocity;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = rightVelocity;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }; 

    // enemy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
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
        enemy.health -= healthBlood;
        enemyHealth.style.width = enemy.health + '%';
    };

    if (
        rectangularCollision({
            rectangle1 : enemy,
            rectangle2 : player
        }) && 
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= healthBlood;
        playerHealth.style.width = player.health + '%';
    };

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
};

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

animate();
decreaseTimer();