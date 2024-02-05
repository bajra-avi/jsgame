const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const card = document.getElementById('card');
const cardScore = document.getElementById('card-score');

const startButton = document.getElementById('startButton');
const playAgain = document.getElementById('play_again');

const SCALE = 2;
const WIDTH = 16;
const HEIGHT = 18;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;

let scoreSFX = new Audio("https://archive.org/download/classiccoin/classiccoin.wav");
let gameOverSFX = new Audio("https://archive.org/download/smb_gameover/smb_gameover.wav");
let jumpSFX = new Audio("https://archive.org/download/jump_20210424/jump.wav");
let gameSFX = new Audio('mario.mp3');


//Enemy
// let img = new Image();
// img.src = 'bowser.png';
let blockSpriteImg1 = new Image();
blockSpriteImg1.src = 'frame-1.png';

let blockSpriteImg2 = new Image();
blockSpriteImg2.src = 'frame-2.png';



//player

let spriteImg = new Image();
spriteImg.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';

//prite details

const playerSprite = {
    x: 0, // Initial X position in the sprite sheet
    y: 0, // Fixed Y position for the player sprite
    frameWidth: 16, // Width of each frame in the sprite sheet
    frameHeight: 18, // Height of each frame in the sprite sheet
    numFrames: 3, // Number of frames in the sprite sheet
    currentFrame: 4, // Current frame index
};

const blockSprites = [blockSpriteImg1, blockSpriteImg2];
const blockSprite = {
    x: 0, // Initial X position in the sprite sheet
    y: 0, // Fixed Y position for the block sprite
    frameWidth: 16, // Width of each frame in the sprite sheet
    frameHeight: 16, // Height of each frame in the sprite sheet
    numFrames: blockSprites.length, // Number of frames in the sprite sheet
    currentFrame: 0, // Current frame index
};


function drawPlayerFrame(canvasX, canvasY) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        spriteImg,
        playerSprite.currentFrame * playerSprite.frameWidth, playerSprite.y, playerSprite.frameWidth, playerSprite.frameHeight,
        canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT
    );
}

function starts(){
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    gameSFX.play();

    document.body.appendChild(canvas)

    function startGame(){
        presetTime = 1000;
        player = new Player(50, 460, 5, 'black');
        arrayBlockss = [];
        enemySpeed = 5;
        score = 0;
        scoreIncrement = 0;
    
    }
    
    function restartGame(button){
        card.style.display = 'none';
        button.blur();
        startGame();
        requestAnimationFrame(animate);
    }
    playAgain.addEventListener('click',  function() {
        restartGame(this);
        gameSFX.play();
        gameOverSFX.pause();
        gameOverSFX.currentTime = 0;
    });
    
    
    
    function drawBackgroundLine(a,b,c,d) {
        ctx.beginPath();
        // ctx.moveTo(0, 400);
        // ctx.lineTo(600, 400);
        ctx.moveTo(a, b);
        ctx.lineTo(c, d);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
    
    function drawScore() {
        ctx.font = '80px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 280, 100);
    }
    
    function getRandnum(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function randomNumberInterval(timeInterval) {
        let returnTime = timeInterval;
        if (Math.random() < 0.5) {
            returnTime += getRandnum(presetTime / 3, presetTime * 1.5);
        } else {
            returnTime -= getRandnum(presetTime / 5, presetTime / 2);
        }
        return returnTime;
    }
    
    class Player {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.jumpHeight = 8;
            this.shouldJump = false;
            this.jumpCounter = 0;
            this.currentLane = 3;
            this.frameUpdateInterval = 5; // Adjust this value to control frame rate
            this.frameUpdateCounter = 0;
            
        }
    
        jump() {
            if (this.shouldJump) {
                this.jumpCounter++;
        
                const reducedJumpHeight = this.jumpHeight / 1.8;
        
                if (this.jumpCounter < 15) {
                    this.y -= reducedJumpHeight;
                } else if (this.jumpCounter > 14 && this.jumpCounter < 19) {
                    this.y += 0;
                } else if (this.jumpCounter < 33) {
                    this.y += reducedJumpHeight;
                }
        
                if (this.jumpCounter >= 32) {
                    this.shouldJump = false;
                }
            }
        }
        
    
        draw() {
            this.jump();
            if (this.frameUpdateCounter % this.frameUpdateInterval === 0) {
                playerSprite.currentFrame = (playerSprite.currentFrame + 1) % playerSprite.numFrames;
            }
    
            drawPlayerFrame(this.x, this.y);
    
            this.frameUpdateCounter++;
        }
        moveUp() {
            if (this.currentLane > 1) {
                this.currentLane--;
                this.y -= 100; // Move up by 100px
            }
        }
    
        moveDown() {
            if (this.currentLane < 3) {
                this.currentLane++;
                this.y += 100; // Move down by 100px
            }
        }
        moveLeft() {
            if (this.x - 20 >= 0) { 
                this.x -= 20;
            }
        } 
    
        moveRight() {
            if (this.x + this.size + 20 <= canvas.width) { 
                this.x += 20;
            }
        }
    }
    
    class AVoidBlock {
        constructor(size, speed, lane) {
            this.x = canvas.width + size;
            this.y = 500 - size - (lane - 1) * 100;
            this.size = size;
            this.color = 'red';
            this.slideSpeed = speed;
            this.currentSprite = 0; // Index to track the current sprite
            this.frameUpdateInterval = 10; // Adjust this value to control frame rate
            this.frameUpdateCounter = 0;
        }
    
        draw() {
            ctx.drawImage(
                blockSprites[this.currentSprite],
                0, 0, blockSprites[this.currentSprite].width, blockSprites[this.currentSprite].height,
                this.x, this.y, this.size, this.size
            );
        }
    
        slide() {
            this.draw();
            this.x -= this.slideSpeed;
        }
    }
    class coins{
        constructor(x, y, size, color, length) {
            this.x =x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.length = length;
    }
    
        drawFaultyWire(x, y, size, color, length) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, length, size);
        }
}
    
    
    
    
    
    
    function generateBlocks() {
        let timeDelay = randomNumberInterval(presetTime)/2;//To increase the difficulty, just increase /(number), it just decreases the time for setTimeout
        const randomLane = getRandnum(1,3);
        arrayBlockss.push(new AVoidBlock(60, enemySpeed, randomLane));
    
        setTimeout(generateBlocks, timeDelay);
    }
    
    function squaresColliding(player, block) {
        let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
        let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    
        s2.size = s2.size;
        s2.x = s2.x - 10;
        s2.y = s2.y - 15;

        return !(
            s1.x > s2.x + s2.size ||
            s1.x + s1.size < s2.x ||
            s1.y > s2.y + s2.size ||
            s1.y + s1.size < s2.y
        );
    }
    
    function increaseSpeed() {
        const nextThreshold = scoreIncrement + 10;
    
        if (score >= nextThreshold) {
            scoreIncrement = nextThreshold;
            enemySpeed++;
            presetTime >= 100 ? (presetTime -= 100) : (presetTime = presetTime / 2);
    
            arrayBlockss.forEach((block) => {
                block.slideSpeed = enemySpeed;
            });
        }
    }
    
    let animationId = null;
    
    
    function animate() {
        animationId = requestAnimationFrame(animate);
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // CanvasLogic
        drawBackgroundLine(0, 500, 600, 500);
        drawBackgroundLine(0, 400, 600, 400);
        drawBackgroundLine(0, 300, 600, 300);
    
        player.draw();
        drawScore();
    
        increaseSpeed();
    
        arrayBlockss.forEach((arrayBlock, index) => {
            arrayBlock.slide();
    
            if (squaresColliding(player, arrayBlock)) {
                gameSFX.pause();
                gameSFX.currentTime = 0;
                gameOverSFX.play();
                gameOverSFX.currentTime = 0;
                cardScore.textContent = score;
                card.style.display = 'block';
                cancelAnimationFrame(animationId);
            }
    
            // Update AVoidBlock sprite frame
            if (arrayBlock.frameUpdateCounter % arrayBlock.frameUpdateInterval === 0) {
                arrayBlock.currentSprite = (arrayBlock.currentSprite + 1) % blockSprites.length;
            }
    
            arrayBlock.frameUpdateCounter++;
    
            if (arrayBlock.x + arrayBlock.size <= 0) {
                setTimeout(() => {
                    arrayBlockss.splice(index, 1);
                }, 0);
            }
        });
    }
    
    
    
    
    
    startGame();
    animate();
    setTimeout(() => {
        generateBlocks();
    }, randomNumberInterval(presetTime));
    
    // Update score every second
    setInterval(() => {
        score += 1;
    }, 1000);
}
// eventListener

addEventListener('keydown', (e) => {
    if (e.code == 'Space' && !player.shouldJump) {
        jumpSFX.play();
        player.jumpCounter = 0;
        player.shouldJump = true;
    }else if (e.code === 'ArrowUp' && player.currentLane > 1 && !player.shouldJump) {
        // scoreSFX.play();
        player.moveUp();
    } else if (e.code === 'ArrowDown' && player.currentLane < 3 && !player.shouldJump) {
        // scoreSFX.play();
        player.moveDown();
    }else if(e.code === 'ArrowLeft'){
        // scoreSFX.play();
        player.moveLeft();
    }else if(e.code === 'ArrowRight'){
        // scoreSFX.play();
        player.moveRight();
    }
});


