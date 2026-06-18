// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game state
const game = {
    score: 0,
    gameRunning: true,
    gamePaused: false,
    difficulty: 1,
    comboMultiplier: 1,
    lastHitTime: 0,
    comboTimeout: 2000,
};

// Car object
const car = {
    x: 0,
    y: 0,
    width: 60,
    height: 40,
    speed: 8,
    velocityX: 0,
    z: 0.9, // Depth in the 3D perspective
};

// Initialize car position
function initCar() {
    car.x = canvas.width / 2 - car.width / 2;
    car.y = canvas.height - 100;
}
initCar();

// Enemy objects (J and P characters)
const enemies = [];
const enemyTypes = ['J', 'P'];

class Enemy {
    constructor() {
        this.type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.x = Math.random() * (canvas.width - 30);
        this.y = -50;
        this.z = 0;
        this.width = 30;
        this.height = 30;
        this.speed = 3 + game.difficulty * 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.z += this.speed;
        this.y = (this.z / 1000) * (canvas.height - 100) - 50;
        this.rotation += this.rotationSpeed;
    }

    isOffScreen() {
        return this.z > 1000;
    }
}

// Spawn enemies
function spawnEnemy() {
    if (game.gameRunning && !game.gamePaused) {
        enemies.push(new Enemy());
    }
}

// Spawn rate based on difficulty
let spawnRate = 60;
let spawnCounter = 0;

// Input handling
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
        e.preventDefault();
        togglePause();
    }
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game functions
function togglePause() {
    game.gamePaused = !game.gamePaused;
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.classList.toggle('hidden', !game.gamePaused);
}

function resetGame() {
    game.score = 0;
    game.difficulty = 1;
    game.comboMultiplier = 1;
    game.gameRunning = true;
    game.gamePaused = false;
    enemies.length = 0;
    spawnCounter = 0;
    initCar();
    
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('pauseMenu').classList.add('hidden');
    
    gameLoop();
}

function updateCar() {
    // Movement
    car.velocityX = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        car.velocityX = -car.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        car.velocityX = car.speed;
    }

    car.x += car.velocityX;

    // Boundary checking
    if (car.x < 0) car.x = 0;
    if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();

        if (enemies[i].isOffScreen()) {
            enemies.splice(i, 1);
            continue;
        }

        // Collision detection
        if (checkCollision(car, enemies[i])) {
            addScore(enemies[i]);
            SoundManager.playCollect();
            enemies.splice(i, 1);
        }
    }
}

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function addScore(enemy) {
    const now = Date.now();
    
    // Update combo multiplier
    if (now - game.lastHitTime < game.comboTimeout) {
        game.comboMultiplier = Math.min(game.comboMultiplier + 1, 10);
    } else {
        game.comboMultiplier = 1;
    }
    
    game.lastHitTime = now;
    
    const baseScore = enemy.type === 'J' ? 10 : 15;
    const points = Math.floor(baseScore * game.comboMultiplier);
    
    game.score += points;
    game.difficulty = 1 + Math.floor(game.score / 500);
    spawnRate = Math.max(30, 60 - game.difficulty * 5);

    // Update UI
    document.getElementById('score').textContent = game.score;
    
    // Show multiplier
    if (game.comboMultiplier > 1) {
        const multiplierDisplay = document.getElementById('multiplier');
        multiplierDisplay.textContent = `x${game.comboMultiplier}`;
        multiplierDisplay.classList.add('active');
        setTimeout(() => {
            multiplierDisplay.classList.remove('active');
        }, 500);
    }
}

// Drawing functions
function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 30, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid/perspective lines
    drawPerspectiveGrid();

    // Draw enemies with 3D effect
    enemies.forEach((enemy) => {
        drawEnemy3D(enemy);
    });

    // Draw car
    drawCar();

    // Draw HUD elements
    drawHUD();
}

function drawPerspectiveGrid() {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i < canvas.width; i += 60) {
        const perspective = i / canvas.width;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i * 0.9 + canvas.width * 0.05, canvas.height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let z = 0; z < 1000; z += 100) {
        const y = (z / 1000) * canvas.height;
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.1 - z / 10000})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawEnemy3D(enemy) {
    const depth = enemy.z / 1000;
    const scale = depth * 2 + 0.3;
    const width = enemy.width * scale;
    const height = enemy.height * scale;
    
    const x = enemy.x + (canvas.width / 2 - enemy.x) * (1 - depth) * 0.1;
    const y = enemy.y;

    // Shadow
    ctx.fillStyle = `rgba(255, 0, 0, ${Math.max(0, 0.3 - depth * 0.3)})`;
    ctx.fillRect(x - width / 2, y + height + 5, width, 5);

    // 3D cube effect background
    ctx.fillStyle = `rgba(255, 100, 100, ${0.2 + depth * 0.4})`;
    ctx.fillRect(x - width / 2, y, width, height);

    // Border
    ctx.strokeStyle = `rgba(255, 50, 50, ${0.5 + depth * 0.5})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - width / 2, y, width, height);

    // Draw character with rotation
    ctx.save();
    ctx.translate(x, y + height / 2);
    ctx.rotate(enemy.rotation);
    
    ctx.fillStyle = `rgba(255, 200, 50, ${0.6 + depth * 0.4})`;
    ctx.font = `bold ${Math.floor(16 * scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(enemy.type, 0, 0);
    
    ctx.restore();

    // Glow effect for closer enemies
    if (depth > 0.7) {
        ctx.strokeStyle = `rgba(255, 100, 100, ${(depth - 0.7) * 2})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(x - width / 2 - 2, y - 2, width + 4, height + 4);
    }
}

function drawCar() {
    const x = car.x;
    const y = car.y;
    const width = car.width;
    const height = car.height;

    // Car body
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x, y, width, height);

    // Car windows
    ctx.fillStyle = '#0088ff';
    ctx.fillRect(x + 10, y + 5, 15, 10);
    ctx.fillRect(x + 35, y + 5, 15, 10);

    // Car wheels
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(x + 15, y + height, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width - 15, y + height, 8, 0, Math.PI * 2);
    ctx.fill();

    // Wheel details
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 15, y + height, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + width - 15, y + height, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Car outline
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Glowing effect
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
    ctx.shadowBlur = 0;
}

function drawHUD() {
    // Difficulty indicator
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`LVL: ${game.difficulty}`, 20, canvas.height - 20);

    // Combo indicator at bottom center
    if (game.comboMultiplier > 1 && Date.now() - game.lastHitTime < game.comboTimeout) {
        ctx.fillStyle = '#ffff00';
        ctx.font = 'bold 24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`${game.comboMultiplier}x COMBO!`, canvas.width / 2, canvas.height - 30);
    }
}

// Game loop
function gameLoop() {
    if (!game.gameRunning) {
        return;
    }

    if (!game.gamePaused) {
        // Update
        updateCar();
        updateEnemies();

        // Spawn enemies
        spawnCounter++;
        if (spawnCounter >= spawnRate) {
            spawnEnemy();
            spawnCounter = 0;
        }

        // Check for game over (enemies reaching the car zone)
        for (let enemy of enemies) {
            if (enemy.z > 1100) {
                endGame();
                return;
            }
        }
    }

    // Draw
    draw();

    requestAnimationFrame(gameLoop);
}

function endGame() {
    game.gameRunning = false;
    const gameOverScreen = document.getElementById('gameOver');
    const finalScoreDisplay = document.getElementById('finalScore');
    finalScoreDisplay.textContent = `Score Final: ${game.score}`;
    gameOverScreen.classList.remove('hidden');
    SoundManager.playGameOver();
}

// Start the game
gameLoop();