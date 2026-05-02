const users = JSON.parse(localStorage.getItem('users')) || [];
const playerName = localStorage.getItem('playerName');
let globalHighscore = localStorage.getItem('globalHighscore') || 0;

function sortUsersByName(users) {
    return users.sort((a, b) => a.name.localeCompare(b.name));
}

function displayLeaderboard(sortedUsers) {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    sortedUsers.forEach((user, index) => {
        const row = document.createElement('tr');

        if (user.name === playerName) {
            row.classList.add('highlight');
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.highscore}</td>
        `;

        leaderboardBody.appendChild(row);
    });
}

document.getElementById('sortButton').addEventListener('click', () => {
    const sortedUsers = sortUsersByName(users);
    displayLeaderboard(sortedUsers);
});

const sortedUsers = users.sort((a, b) => b.highscore - a.highscore);
displayLeaderboard(sortedUsers);
