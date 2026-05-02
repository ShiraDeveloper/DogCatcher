const popup = document.getElementById("popup1");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");
const restartBtn = document.getElementById("restartGame");
const exitBtn = document.getElementById("exitGame");

restartBtn.addEventListener("click", () => {
    location.reload();
});

document.getElementById("viewLeaderboard").addEventListener("click", function () {
    document.getElementById("popupIframe").classList.add("show");
});

document.getElementById("closeIframe").addEventListener("click", function () {
    document.getElementById("popupIframe").classList.remove("show");
});


exitBtn.addEventListener("click", () => {
    window.location.href = "homePage.html";
});

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
    popup.classList.add("show");
}
const player = document.getElementById("player");
let playerX = 170;
let blocks = [];
let score = 0;
let level = 1;
let speed = 5;
let gameInterval;
let blockInterval;
let timerInterval;
let timeLeft = 60;
let isGameOver = false;

const currentPlayer = localStorage.getItem("playerName") || "";
let users = JSON.parse(localStorage.getItem("users") || "[]");
const userIndex = users.findIndex(u => u.name === currentPlayer);
let globalHighscore = parseInt(localStorage.getItem("globalHighscore") || "0");
let userHighscore = (users[userIndex].highscore) || 0;
document.getElementById("playerDisplay").textContent = "player: " + currentPlayer;
document.getElementById("highscore").textContent = userHighscore;
document.getElementById("globalHighscore").textContent = globalHighscore;
window.onload = function () {
    player.style.left = playerX + 'px';
    player.style.top = '550px';
    isGameOver = false;
    gameInterval = setInterval(updateGame, 30);
    blockInterval = setInterval(createBlock, 1000);
    timerInterval = setInterval(updateTimer, 1000);
};

function movePlayer(direction) {
    if (direction === 'left' && playerX > 0) playerX -= 10;
    if (direction === 'right' && playerX < 340) playerX += 10;
    player.style.left = playerX + 'px';
}

function createBlock() {
    const block = document.createElement("div");
    block.classList.add("block");
    block.classList.add(Math.random() < 0.2 ? "bad-block" : "good-block");
    block.style.left = Math.floor(Math.random() * 360) + "px";
    block.style.top = "0px";
    document.getElementById("gameArea").appendChild(block);
    blocks.push(block);
}

function moveBlocks() {
    blocks.forEach((block, index) => {
        let top = parseInt(block.style.top);
        block.style.top = top + speed + "px";

        if (top >= 510 && checkCollision(block)) {
            const isBad = block.classList.contains("bad-block");
            if (isBad) {
                endGame("💥 The dog touched the obstacle! The game is over.");
                return;
            } else {
                document.getElementById("gameArea").removeChild(block);
                blocks.splice(index, 1);
                score++;
                if (score % 10 === 0) {
                    level++;
                    speed += 0.5;
                }
            }
        } else if (top > 600) {
            document.getElementById("gameArea").removeChild(block);
            blocks.splice(index, 1);
        }
    });
}

function checkCollision(block) {
    const playerRect = player.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    const hitbox = {
        top: playerRect.top + 15,
        bottom: playerRect.bottom - 10,
        left: playerRect.left + 10,
        right: playerRect.right - 10
    };

    const isColliding = !(
        hitbox.right < blockRect.left ||
        hitbox.left > blockRect.right ||
        hitbox.bottom < blockRect.top ||
        hitbox.top > blockRect.bottom
    );

    return isColliding;
}

function updateGame() {
    moveBlocks();
    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;
}

function updateTimer() {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame("⏰ Time is up! Score: " + score);
    }
}

function endGame(message) {
    if (isGameOver) return;
    isGameOver = true;

    clearInterval(gameInterval);
    clearInterval(blockInterval);
    clearInterval(timerInterval);

    let encouragement = "";
    let isNewPersonalBest = score > userHighscore;
    let isNewGlobalBest = score > globalHighscore;

    if (isNewPersonalBest) {
        users[userIndex].highscore = score;
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("highscore").textContent = score;
        encouragement += "🎉 New personal highscore!\n";
    }

    if (userIndex !== -1 && score > (users[userIndex].highscore || 0)) {
        users[userIndex].highscore = score;
        localStorage.setItem("users", JSON.stringify(users));
    }

    if (isNewGlobalBest) {
        localStorage.setItem("globalHighscore", score);
        document.getElementById("globalHighscore").textContent = score;
        encouragement += "🏆 You beat the global highscore!\n";
    }

    showPopup((encouragement || "") + message);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") movePlayer('left');
    if (e.key === "ArrowRight") movePlayer('right');
});
