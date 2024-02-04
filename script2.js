const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const card = document.getElementById('card');
const cardScore = document.getElementById('card-score');

const startButton = document.getElementById('startButton');
const playAgain = document.getElementById('play_again');

function starts(){
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    function startGame(){
        presetTime = 1000;
        player = new Player(50, 475, 25, 'black');
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
        restartGame(this);});
    
    
    
    function drawBackgroundLine(a,b,c,d) {
        ctx.beginPath();
        // ctx.moveTo(0, 400);
        // ctx.lineTo(600, 400);
        ctx.moveTo(a, b);
        ctx.lineTo(c, d);
        ctx.lineWidth = 2;
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
            this.jumpHeight = 12;
            this.shouldJump = false;
            this.jumpCounter = 0;
            this.currentLane = 3;
            
        }
    
        jump() {
            if (this.shouldJump) {
                this.jumpCounter++;
        
                const reducedJumpHeight = this.jumpHeight / 2.3;
        
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
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
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
            this.y = 500 - size - (lane -1) *100;
            this.size = size;
            this.color = 'red';
            this.slideSpeed = speed;
        }
    
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    
        slide() {
            this.draw();
            this.x -= this.slideSpeed;
        }
    }
    
    
    
    function generateBlocks() {
        let timeDelay = randomNumberInterval(presetTime)/2;//To increase the difficulty, just increase /(number), it just decreases the time for setTimeout
        const randomLane = getRandnum(1,3);
        arrayBlockss.push(new AVoidBlock(42, enemySpeed, randomLane));
    
        setTimeout(generateBlocks, timeDelay);
    }
    
    function squaresColliding(player, block) {
        let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
        let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    
        s2.size = s2.size - 10;
        s2.x = s2.x + 10;
        s2.y = s2.y + 10;
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
    
        //CanvasLogic
        drawBackgroundLine(0,500,600,500);
        drawBackgroundLine(0,400,600,400);
        drawBackgroundLine(0,300,600,300);
        drawScore();
        player.draw();
    
        increaseSpeed();
    
        arrayBlockss.forEach((arrayBlock, index) => {
            arrayBlock.slide();
    
            if (squaresColliding(player, arrayBlock)) {
                cardScore.textContent = score;
                card.style.display = 'block';
                cancelAnimationFrame(animationId);
            }
    
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
        player.jumpCounter = 0;
        player.shouldJump = true;
    }else if (e.code === 'ArrowUp' && player.currentLane > 1 && !player.shouldJump) {
        player.moveUp();
    } else if (e.code === 'ArrowDown' && player.currentLane < 3 && !player.shouldJump) {
        player.moveDown();
    }else if(e.code === 'ArrowLeft'){
        player.moveLeft();
    }else if(e.code === 'ArrowRight'){
        player.moveRight();
    }
});


