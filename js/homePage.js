const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");
const passwordInput = document.getElementById("playerPassword");
const popup = document.getElementById("popup2");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");
window.onload = function () {
    showPopup("the rules of the game: you need to press the keybord in right or left and help the dog to catch the bone and to run from the bads");
}
function startGame() {
    window.location.href = "game.html";
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = "flex";
    popup.classList.add("show");
}

popupClose.addEventListener("click", () => {
    popup.style.display = "none";
    popup.classList.remove("show");
});

startButton.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !password) {
        showPopup("Please enter both username and password.");
        return;
    }

    const users = getUsers();
    const existingUser = users.find(u => u.name == name);

    if (existingUser) {
        if (existingUser.password !== password) {
            showPopup("Wrong password.");
            return;
        }

        localStorage.setItem("playerName", name);
        startGame();
    } else {
        users.push({ name, password, highscore: 0 });
        saveUsers(users);
        localStorage.setItem("playerName", name);
        showPopup("Welcome, new user!");
        startGame();
    }
});


