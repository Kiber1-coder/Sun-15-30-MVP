const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let mode = 'cube';
let level = 1;
let gameRunning = true;

let player = { x: 100, y: 300, width: 30, height: 30, vy: 0, gravity: 0.8, jumpPower: -12 };
let obstacles = [];

function setMode(newMode) {
    mode = newMode;
    restartGame();
}

function restartGame() {
    level = 1;
    gameRunning = true;
    player.y = 300;
    player.vy = 0;
    generateObstacles();
    document.getElementById('level').innerText = `Уровень: ${level} / 100`;
}

function generateObstacles() {
    obstacles = [];
    let count = 5 + Math.floor(level / 10);
    for(let i = 0; i < count; i++) {
        obstacles.push({
            x: 300 + i * 150 + Math.random() * 50,
            y: mode === 'plane' ? 200 + Math.random() * 200 : 350,
            width: 20,
            height: mode === 'plane' ? 30 : 20,
            type: 'spike'
        });
    }
}

function update() {
    if(!gameRunning) return;

    // Физика в зависимости от режима
    if(mode === 'cube') {
        player.vy += player.gravity;
        player.y += player.vy;
        if(player.y > 350) { player.y = 350; player.vy = 0; }
        if(player.y < 0) player.y = 0;
    } else if(mode === 'plane') {
        if(keys['ArrowUp'] && player.y > 0) player.y -= 5;
        if(keys['ArrowDown'] && player.y < 370) player.y += 5;
    } else if(mode === 'arrow') {
        if(keys['ArrowUp'] && player.y > 0) player.y -= 8;
        if(keys['ArrowDown'] && player.y < 370) player.y += 8;
    }

    // Проверка столкновений
    for(let obs of obstacles) {
        if(player.x < obs.x + obs.width && player.x + player.width > obs.x &&
           player.y < obs.y + obs.height && player.y + player.height > obs.y) {
            gameRunning = false;
            alert(`Игра окончена! Вы достигли ${level} уровня`);
            restartGame();
            return;
        }
    }

    // Сдвиг мира
    for(let obs of obstacles) obs.x -= 3;
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    if(obstacles.length === 0) {
        level++;
        if(level > 100) {
            alert("Поздравляю! Вы прошли все 100 уровней!");
            restartGame();
        } else {
            document.getElementById('level').innerText = `Уровень: ${level} / 100`;
            generateObstacles();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, 800, 400);
    // Рисуем игрока
    ctx.fillStyle = mode === 'cube' ? '#44ff44' : (mode === 'plane' ? '#44aaff' : '#ffaa44');
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Рисуем препятствия
    ctx.fillStyle = '#ff4444';
    for(let obs of obstacles) ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
}

let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; if(e.key === ' ' && mode === 'cube' && player.y >= 350) player.vy = player.jumpPower; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

restartGame();
gameLoop();