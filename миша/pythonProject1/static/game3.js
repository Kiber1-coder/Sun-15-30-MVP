const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player = { x: 50, y: 250, width: 30, height: 30 };
let monster = { x: 700, y: 250, width: 40, height: 40, health: 50, attackCooldown: 0, speed: 2 };
let monsterCount = 1;
let gameRunning = true;

function restartGame() {
    monsterCount = 1;
    monster.health = 50;
    monster.speed = 2;
    monster.x = 700;
    monster.y = 250;
    player.x = 50;
    player.y = 250;
    gameRunning = true;
    updateUI();
}

function updateUI() {
    document.getElementById('monsterStatus').innerText = `Монстр ${monsterCount}/3`;
}

function shoot() {
    if(gameRunning) {
        let dx = monster.x - player.x;
        let dy = monster.y - player.y;
        let dist = Math.hypot(dx,dy);
        if(dist < 100) {
            monster.health -= 10;
            if(monster.health <= 0) {
                monsterCount++;
                if(monsterCount > 3) {
                    alert("Поздравляю! Вы уничтожили всех монстров и победили!");
                    restartGame();
                } else {
                    monster.health = 50 + monsterCount * 20;
                    monster.speed = 2 + monsterCount * 0.5;
                    updateUI();
                    alert(`Монстр ${monsterCount-1} уничтожен! Следующий сильнее!`);
                }
            }
        }
    }
}

function update() {
    if(!gameRunning) return;

    // Движение игрока
    if(keys['ArrowUp'] && player.y > 0) player.y -= 5;
    if(keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += 5;
    if(keys['ArrowLeft'] && player.x > 0) player.x -= 5;
    if(keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += 5;
    if(keys[' ']) shoot();

    // Движение монстра к игроку
    let dx = player.x - monster.x;
    let dy = player.y - monster.y;
    let dist = Math.hypot(dx,dy);
    if(dist > 0) {
        monster.x += (dx/dist) * monster.speed;
        monster.y += (dy/dist) * monster.speed;
    }

    // Атака монстра
    if(monster.attackCooldown <= 0 && dist < 50) {
        gameRunning = false;
        alert(`Вы погибли! Уничтожено монстров: ${monsterCount-1}`);
        restartGame();
        monster.attackCooldown = 30;
    } else { monster.attackCooldown--; }

    // Стены лабиринта (простые)
    if(player.x < 0) player.x = 0;
    if(player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    if(player.y < 0) player.y = 0;
    if(player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}

function draw() {
    ctx.clearRect(0,0,800,500);
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(monster.x, monster.y, monster.width, monster.height);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Здоровье монстра: ${monster.health}`, 20, 50);
}

let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; if(e.key === ' ') e.preventDefault(); });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }
gameLoop();