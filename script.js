const canavsSize = 490;

//sound
let sound = document.getElementById("audio");

const canvas = document.getElementById("can");
canvas.width = canavsSize;
canvas.height = canavsSize;
canvas.style.border = "2px solid red";

const ctx = canvas.getContext("2d");

// UI
const HealthText = document.getElementById("Health");
const ScoreText = document.getElementById("Score");
const StartGame = document.getElementById("Start");
const Reset = document.getElementById("Reset");

let score = 0;
let Health = 3;
let gameloop;

// BOT SETTINGS
const botMovementRate = 0.3;
const botTurnRate = 0.3;
const botFiringRate = 0.1;

// PLAYER
const player = {
  position: { x: 200, y: 300, dir: "up" },
  color: "red",
  size: 20,
  speed: 5,
  bulletSize: 8,
  bulletColor: "green",
  bulletSpeed: 6,
  owner: "player",
  Health: 3,
};

// DRAW PLAYER
const drawplayer = (x, y, size, color, dir) => {
  ctx.fillStyle = color;
  if (dir === "up") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //centre
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size); //left
    ctx.fillRect(x + size / 2, y - size / 2, size, size); //right
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size); //top
    ctx.fillRect(x - 1.5 * size, y + size / 2, size, size); //left leg
    ctx.fillRect(x + size / 2, y + size / 2, size, size); //right leg
  } else if (dir === "down") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //centre
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size); //left
    ctx.fillRect(x + size / 2, y - size / 2, size, size); //right
    ctx.fillRect(x - size / 2, y + size / 2, size, size); //top
    ctx.fillRect(x - 1.5 * size, y - 1.5 * size, size, size); //left leg
    ctx.fillRect(x + size / 2, y - 1.5 * size, size, size); //right leg
  } else if (dir === "left") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //centre
    ctx.fillRect(x - 1.5 * size, y - size / 2, size, size); //left
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size); //top left
    ctx.fillRect(x + size / 2, y - 1.5 * size, size, size); //top right
    ctx.fillRect(x - size / 2, y + size / 2, size, size); // bottom left
    ctx.fillRect(x + size / 2, y + size / 2, size, size); // bottom right
  } else if (dir === "right") {
    ctx.fillRect(x - size / 2, y - size / 2, size, size); //centre
    ctx.fillRect(x - size / 2, y - 1.5 * size, size, size); //top left
    ctx.fillRect(x - size / 2, y + size / 2, size, size); //top right
    ctx.fillRect(x - 1.5 * size, y - 1.5 * size, size, size); // bottom left
    ctx.fillRect(x - 1.5 * size, y + size / 2, size, size); // bottom right
    ctx.fillRect(x + size / 2, y - size / 2, size, size); //centre neck
  }
};

// KEYBOARD
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") {
    player.position.dir = "up";
    player.position.y -= player.speed;
  }

  if (e.code === "KeyS") {
    player.position.dir = "down";
    player.position.y += player.speed;
  }

  if (e.code === "KeyA") {
    player.position.dir = "left";
    player.position.x -= player.speed;
  }
  if (e.code === "KeyD") {
    player.position.dir = "right";
    player.position.x += player.speed;
  }
  if (e.code === "Space") {
    bullets.push({
      x: player.position.x,
      y: player.position.y,
      dir: player.position.dir,
      size: player.bulletSize,
      speed: player.bulletSpeed,
      color: player.bulletColor,
      owner: "player",
    });
  }
});

// BULLETS
const bullets = [];

const drawBullets = () => {
  bullets.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size);
  });
};

// MOVE BULLETS
const moveBullets = () => {
  bullets.forEach((b, i) => {
    if (b.dir === "up") b.y -= b.speed;
    if (b.dir === "down") b.y += b.speed;
    if (b.dir === "left") b.x -= b.speed;
    if (b.dir === "right") b.x += b.speed;

    if (b.x < 0 || b.y < 0 || b.x > canavsSize || b.y > canavsSize || b.hit)
      bullets.splice(i, 1);
  });
};

// RANDOM
const Directions = ["up", "down", "left", "right"];
const Colors = ["red", "blue", "green", "purple", "orange"];

// enemies array
const enemies = [];

// create Enemy
const createEnemy = () => ({
  size: 15,
  color: Colors[Math.floor(Math.random() * Colors.length)],
  position: {
    x: Math.random() * canavsSize,
    y: Math.random() * canavsSize,
    dir: Directions[Math.floor(Math.random() * Directions.length)],
  },
  speed: 3,
  bulletSize: 8,
  bulletSpeed: 5,
  bulletColor: "brown",
});

enemies.push(createEnemy(), createEnemy());

// DRAW ENEMIES
const drawEnemies = () => {
  enemies.forEach((e) => {
    drawplayer(e.position.x, e.position.y, e.size, e.color, e.position.dir);
  });
};

// MOVE ENEMIES
const moveEnemies = () => {
  enemies.forEach((e) => {
    //for Movement
    const x = Math.random() * 10;
    if (x < botMovementRate) {
      if (e.position.dir === "up") {
        e.position.y -= e.speed;
      }
      if (e.position.dir === "down") {
        e.position.y += e.speed;
      }
      if (e.position.dir === "left") {
        e.position.x -= e.speed;
      }
      if (e.position.dir === "right") {
        e.position.x += e.speed;
      }
    }

    // For Turn Rate
    const y = Math.random() * 10;
    if (y < botTurnRate) {
      const z = Math.floor(Math.random() * 4);
      if (z < 1) {
        e.position.dir = "up";
      } else if (z < 2) {
        e.position.dir = "down";
      } else if (z < 3) {
        e.position.dir = "left";
      } else if (z < 4) {
        e.position.dir = "right";
      }
    }
    // bot Firing Rate
    const fire = Math.random() * 10;
    if (fire < botFiringRate) {
      bullets.push({
        x: e.position.x,
        y: e.position.y,
        dir: e.position.dir,
        size: e.bulletSize,
        speed: e.bulletSpeed,
        color: e.bulletColor,
        owner: "enemy",
      });
    }
    // Reverse Boundary Enemy
    if (e.position.x > canavsSize) {
      e.position.x = 0;
    }
    if (e.position.x < 0) {
      e.position.x = canavsSize;
    }
    if (e.position.y > canavsSize) {
      e.position.y = 0;
    }
    if (e.position.y < 0) {
      e.position.y = canavsSize;
    }
  });
};

// COLLISION
const checkBulletsHit = () => {
  bullets.forEach((b) => {
    // Player bullet -> enemy hit
    if (b.owner === "player") {
      enemies.forEach((e, i) => {
        if (
          Math.abs(b.x - e.position.x) < e.size + b.size / 2 &&
          Math.abs(b.y - e.position.y) < e.size + b.size / 2
        ) {
          b.hit = true;
          enemies.splice(i, 1);
          enemies.push(createEnemy());
          score = score + 1;
          ScoreText.innerText = "Score:" + score;

          if (sound) {
            sound.currentTime = 0;
            sound.play();
          }
        }
      });
    }
    // Enemy bullet -> player hit
    else if (
      b.owner === "enemy" &&
      Math.abs(b.x - player.position.x) < player.size + b.size / 2 &&
      Math.abs(b.y - player.position.y) < player.size + b.size / 2
    ) {
      b.hit = true;
      Health = Health - 1;
      HealthText.innerText = "Health:" + Health;
    }
  });
};

// GAME OVER
const checkGameOver = () => {
  if (Health <= 0) {
    clearInterval(gameloop);
    alert("Game Over");
  }
};

// GAME ENGINE
const gameEngine = () => {
  moveEnemies();
  moveBullets();
  checkBulletsHit();
  checkGameOver();
  // keep player on canvas (wrap around)
  if (player.position.x > canavsSize + player.size * 1.5) {
    player.position.x = -1.5 * player.size;
  } else if (player.position.x < -1.5 * player.size) {
    player.position.x = canavsSize + player.size * 1.5;
  } else if (player.position.y > canavsSize + player.size * 1.5) {
    player.position.y = -1.5 * player.size;
  } else if (player.position.y < -1.5 * player.size) {
    player.position.y = canavsSize + player.size * 1.5;
  }
  ctx.clearRect(0, 0, canavsSize, canavsSize);
  drawBullets();
  drawEnemies();
  drawplayer(
    player.position.x,
    player.position.y,
    player.size,
    player.color,
    player.position.dir,
  );
};

// BUTTONS
StartGame.onclick = () => {
  if (!gameloop) gameloop = setInterval(gameEngine, 20);
};

Reset.onclick = () => location.reload();
