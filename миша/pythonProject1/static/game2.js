const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player = { x: 50, y: 250, width: 30, height: 30, bullets: [] };
let boss = { x: 700, y: 200, width: 60, height: 60, health: 100, maxHealth: 100, bullets: [] };
let enemies = [];
let score = 0;
let gameSpeed = 3;
let gameRunning = true;

function restartGame() {
    score = 0;
    gameSpeed = 3;
    boss.health = 100;
    boss.maxHealth = 100;
    player.bullets = [];
    boss.bullets = [];
    enemies = [];
    gameRunning = true;
    updateUI();
}

function updateUI() {
    document.getElementById('score').innerText = `Уничтожено боссов: ${score}`;
    document.getElementById('bossHealth').innerText = `Здоровье босса: ${boss.health}`;
}

function shoot() {
    if(gameRunning) player.bullets.push({ x: player.x + player.width, y: player.y + 15, width: 5, height: 5 });
}

function bossShoot() {
    if(gameRunning && boss.health > 0) {
        boss.bullets.push({ x: boss.x, y: boss.y + 25, width: 8, height: 8 });
    }
}

function update() {
    if(!gameRunning) return;

    // Движение игрока
    if(keys['ArrowUp'] && player.y > 0) player.y -= 5;
    if(keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += 5;
    if(keys['ArrowLeft'] && player.x > 0) player.x -= 5;
    if(keys['ArrowRight'] && player.x < canvas.width/2) player.x += 5;
    if(keys[' ']) shoot();

    // Пули игрока
    for(let i=0; i<player.bullets.length; i++) {
        player.bullets[i].x += 7;
        if(player.bullets[i].x > canvas.width) player.bullets.splice(i,1);
        else if(player.bullets[i].x < boss.x + boss.width && player.bullets[i].x + player.bullets[i].width > boss.x &&
                player.bullets[i].y < boss.y + boss.height && player.bullets[i].y + player.bullets[i].height > boss.y) {
            boss.health -= 10;
            player.bullets.splice(i,1);
            updateUI();
            if(boss.health <= 0) {
                score++;
                gameSpeed += 1.5;
                boss.health = 100 + score * 20;
                boss.maxHealth = boss.health;
                updateUI();
                alert(`Босс уничтожен! Скорость увеличена до ${gameSpeed}`);
            }
        }
    }

    // Пули босса
    for(let i=0; i<boss.bullets.length; i++) {
        boss.bullets[i].x -= 5;
        if(boss.bullets[i].x < 0) boss.bullets.splice(i,1);
        else if(boss.bullets[i].x < player.x + player.width && boss.bullets[i].x + boss.bullets[i].width > player.x &&
                boss.bullets[i].y < player.y + player.height && boss.bullets[i].y + boss.bullets[i].height > player.y) {
            gameRunning = false;
            alert(`Игра окончена! Уничтожено боссов: ${score}`);
            restartGame();
        }
    }

    setInterval(bossShoot, 1000);
}

function draw() {
    ctx.clearRect(0,0,800,500);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    ctx.fillStyle = 'white';
    for(let b of player.bullets) ctx.fillRect(b.x, b.y, b.width, b.height);
    for(let b of boss.bullets) ctx.fillRect(b.x, b.y, b.width, b.height);
    // Полоска здоровья
    ctx.fillStyle = 'gray';
    ctx.fillRect(20, 20, 200, 20);
    ctx.fillStyle = 'red';
    ctx.fillRect(20, 20, 200 * (boss.health/boss.maxHealth), 20);
}

let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; if(e.key === ' ') e.preventDefault(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

setInterval(() => { if(gameRunning && boss.health > 0) bossShoot(); }, 1500);
function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
gameLoop();