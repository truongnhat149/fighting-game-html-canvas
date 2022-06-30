const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
};

canvasContext.fillRect(0, 0, canvas.width, canvas.height);


const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: backgroundImg,
});

const shop = new Sprite({
    position : {
        x: 600,
        y: 128
    },
    imageSrc: shopImg,
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
    imageSrc: samuraiIdleImg,
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: { // animation
        idle: {
            imageSrc: samuraiIdleImg,
            framesMax: 8,
        },
        run: {
            imageSrc: samuraiRunImg,
            framesMax: 8,
        },
        jump: {
            imageSrc: samuraiJumpImg,
            framesMax: 2,
        },
        fall: {
            imageSrc: samuraiFallImg,
            framesMax: 2,
        },
        attack2: {
            imageSrc: samuraiAttack2Img,
            framesMax: 6,
        },
        takeHit: {
            imageSrc: samuraiTakeHitImg,
            framesMax: 4,
        },
        death: {
            imageSrc: samuraiDeathImg,
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50,
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
    imageSrc: kenjiIdleImg,
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: { // animation
        idle: {
            imageSrc: kenjiIdleImg,
            framesMax: 4,
        },
        run: {
            imageSrc: kenjiRunImg,
            framesMax: 8,
        },
        jump: {
            imageSrc: kenjiJumpImg,
            framesMax: 2,
        },
        fall: {
            imageSrc: kenjiFallImg,
            framesMax: 2,
        },
        attack2: {
            imageSrc: kenjiAttack1Img,
            framesMax: 4,
        },
        takeHit: {
            imageSrc: kenjiTakeHitImg,
            framesMax: 3,
        },
        death: {
            imageSrc: kenjiDeathImg,
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    },
});


function animate() {
    // background 
    window.requestAnimationFrame(animate);
    canvasContext.fillStyle = fillStyleBG;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = valueVelocityDefault;
    enemy.velocity.x = valueVelocityDefault;

    // player movement

    if (keys.a.pressed && player.lastKey === keyA) {
        
        player.velocity.x = leftVelocity;
        player.switchSprite(RUN);
    } else if (keys.d.pressed && player.lastKey === keyD) {
        player.velocity.x = rightVelocity;   
        player.switchSprite(RUN);
    } else {
        player.switchSprite(IDLE);
    };

    // player jump
    if (player.velocity.y < 0) {
        player.switchSprite(JUMP);
    } else if (player.velocity.y > 0) {
        player.switchSprite(FALL);
    };

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === arrowLeft) {
        enemy.velocity.x = leftVelocity;
        enemy.switchSprite(RUN);
    } else if (keys.ArrowRight.pressed && enemy.lastKey === arrowRight) {
        enemy.velocity.x = rightVelocity;
        enemy.switchSprite(RUN);
    } else {
        enemy.switchSprite(IDLE);
    }; 

    // enemy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite(JUMP);
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite(FALL);
    }

    // detect for collision player & enemy hit
    if (
        rectangularCollision({
            rectangle1 : player,
            rectangle2 : enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        // enemyHealth.style.width = enemy.health + '%';
        gsap.to('#enemy-health-before',
            {
                width: enemy.health + '%',
            }
        );
    };

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    // detect for collision enemy
    if (
        rectangularCollision({
            rectangle1 : enemy,
            rectangle2 : player
        }) && 
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        // playerHealth.style.width = player.health + '%';
        gsap.to('#player-health-before',
            {
                width: player.health + '%',
            }
        );
    };

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }


    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
};

  // event listeners
window.addEventListener('keydown', (event) => {
    // event player
    if (!player.dead) {
    switch (event.key.toLowerCase()) {
        case keyD:
            keys.d.pressed = true;
            player.lastKey = keyD;
        break;
        case keyA:
            keys.a.pressed = true;
            player.lastKey = keyA;
        break;
        case keyW:
            player.velocity.y = jumpVelocity;
        break;
        case keyZ:
            player.attack();
        break;
    };
    };

    // event enemy
    if (!enemy.dead) {
    switch (event.key) {
        case arrowRight:
            keys.ArrowRight.pressed = true;
            enemy.lastKey = arrowRight;
        break;
        case arrowLeft:
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = arrowLeft ;
        break;
        case arrowUp :
            enemy.velocity.y = jumpVelocity;
        break;
        case '/':
            enemy.attack();
        break;
    };
    };
});

window.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case keyD:
            keys.d.pressed = false;
            break;
        case keyA:
            keys.a.pressed = false;
            break;
        case keyW:
            keys.w.pressed = false;
            break;
    };

    switch (event.key) {
        case arrowRight:
            keys.ArrowRight.pressed = false;
            break;
        case arrowLeft:
            keys.ArrowLeft.pressed = false;
            break;
        case arrowUp:
            keys.ArrowUp.pressed = false;
            break;
    }
});

animate();
decreaseTimer();