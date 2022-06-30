const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

// value figure
const gravity = 0.7;
const valueVelocityDefault = 0;
const jumpVelocity  = -20;
const rightVelocity = 5;
const leftVelocity  = -5;
const healthBlood = 10;
const upFrame = 96; // standing on the frame

// query ID
const playerHealth = document.querySelector('#player-health-before');
const enemyHealth = document.querySelector('#enemy-health-before');
const displayText = document.querySelector('#display-text');
const displayTime = document.querySelector('#timer');

// KEY 
const arrowRight = 'ArrowRight';
const arrowLeft = 'ArrowLeft';
const arrowUp = 'ArrowUp';
const keyD = 'd';
const keyA = 'a';

// animation
const JUMP = 'jump';
const FALL = 'fall';
const RUN = 'run';
const IDLE = 'idle';

// IMG
const backgroundImg = './assets/img/background.png';
const shopImg = './assets/img/shop.png';

const fillStyleBG = 'rgba(255, 255, 255, 0.15)'; // fill style background

const samuraiIdleImg = './assets/img/samuraiMack/Idle.png';
const samuraiRunImg = './assets/img/samuraiMack/Run.png';
const samuraiJumpImg = './assets/img/samuraiMack/Jump.png';
const samuraiFallImg = './assets/img/samuraiMack/Fall.png';
const samuraiAttack2Img = './assets/img/samuraiMack/Attack2.png';
const samuraiTakeHitImg = './assets/img/samuraiMack/Take Hit - white silhouette.png';
const samuraiDeathImg = './assets/img/samuraiMack/Death.png';

const kenjiIdleImg = './assets/img/kenji/Idle.png';
const kenjiRunImg = './assets/img/kenji/Run.png';
const kenjiJumpImg = './assets/img/kenji/Jump.png';
const kenjiFallImg = './assets/img/kenji/Fall.png';
const kenjiAttack1Img = './assets/img/kenji/Attack1.png';
const kenjiTakeHitImg = './assets/img/kenji/Take hit.png';
const kenjiDeathImg = './assets/img/kenji/Death.png';

// TIME
let timer = 60;
let timerId;