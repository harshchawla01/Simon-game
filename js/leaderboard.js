class Leaderboard {
    constructor() {
        this.leaderboardTable = document.getElementById('leaderboardTable');
        this.emptyLeaderboard = document.getElementById('emptyLeaderboard');
        this.clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');
        this.confirmClearBtn = document.getElementById('confirmClearBtn');
        this.initEventListeners();
        this.displayLeaderboard();
    }
    initEventListeners() {
        this.clearLeaderboardBtn.addEventListener('click', () => {
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
        });
        this.confirmClearBtn.addEventListener('click', () => {
            this.clearLeaderboard();
            bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
        });
    }
    displayLeaderboard() {
        const scores = JSON.parse(localStorage.getItem('simonScores')) || [];
        this.leaderboardTable.innerHTML = '';
        if(scores.length > 0) {
            this.emptyLeaderboard.classList.add('d-none');
            scores.forEach((score, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${score.playerName}</td>
                        <td>${score.score}</td>
                        <td>${score.difficulty}</td>
                        <td>${score.date}</td> `
                    ;
                this.leaderboardTable.appendChild(row);
            });
        } else {
            this.emptyLeaderboard.classList.remove('d-none'); // showing empty leaderboard
        }
    }
    clearLeaderboard() {
        localStorage.removeItem('simonScores');
        this.displayLeaderboard();
    }
}
document.addEventListener('DOMContentLoaded', () => new Leaderboard());