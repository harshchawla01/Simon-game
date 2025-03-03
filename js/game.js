class SimonGame {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.isPlaying = false;
        this.soundEnabled = true;
        this.difficulty = 'easy';
        
        this.buttons = {
            green: document.getElementById('green'),
            red: document.getElementById('red'),
            yellow: document.getElementById('yellow'),
            blue: document.getElementById('blue')
        };
        
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.levelDisplay = document.getElementById('level');
        this.soundToggle = document.getElementById('soundToggle');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.playerNameInput = document.getElementById('playerName');
        this.gameStats = document.getElementById('gameStats');
        this.currentScoreDisplay = document.getElementById('currentScore');
        this.gameOverDisplay = document.getElementById('gameOverDisplay');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.finalDifficultyDisplay = document.getElementById('finalDifficulty');
        this.saveScoreBtn = document.getElementById('saveScoreBtn');
        this.dontSaveBtn = document.getElementById('dontSaveBtn');
        
        this.sounds = {
            green: new Audio('./assets/simonSound1.mp3'),
            red: new Audio('./assets/simonSound2.mp3'),
            yellow: new Audio('./assets/simonSound3.mp3'),
            blue: new Audio('./assets/simonSound4.mp3'),
            wrong: new Audio('./assets/simonSound4.mp3')
        };
        
        this.difficultySettings = {
            easy: { showVisuals: true, interval: 800, activeTime: 400 },
            medium: { showVisuals: true, interval: 600, activeTime: 300 },
            hard: { showVisuals: false, interval: 800, activeTime: 400 }
        };

        this.centerLevel = document.getElementById('centerLevel');
        
        this.callEventListeners();
    }
    
    callEventListeners() {
        for (const [color, button] of Object.entries(this.buttons)) {
            button.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.handleButtonPress(color);
                }
            });
        }
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.stopBtn.addEventListener('click', () => this.stopGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.soundToggle.addEventListener('change', () => this.soundEnabled = this.soundToggle.checked);
        this.difficultySelect.addEventListener('change', () => this.difficulty = this.difficultySelect.value);
        this.saveScoreBtn.addEventListener('click', () => this.saveScore());
        this.dontSaveBtn.addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.hideGameOver();
        this.gameStats.style.display = 'block';
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
        this.isPlaying = true;
        this.updateLevel(1);
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.restartBtn.disabled = false;
        
        if (this.difficulty === 'hard') {
            for (const button of Object.values(this.buttons)) {
                button.classList.add('hidden');
            }
        } else {
            for (const button of Object.values(this.buttons)) {
                button.classList.remove('hidden');
            }
        }
        
        this.nextRound();
    }
    
    stopGame() {
        this.isPlaying = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.restartBtn.disabled = false;
        
        if (this.level > 0) {
            this.showGameOver();
        } else {
            this.gameStats.style.display = 'none';
        }
    }
    
    resetGame() {
        this.hideGameOver();
        this.gameStats.style.display = 'none';
        this.sequence = [];
        this.playerSequence = [];
        this.level = 0;
    }
    
    restartGame() {
        this.hideGameOver();
        this.startGame();
    }
    
    nextRound() {
        this.playerSequence = [];
        this.addToSequence();
        setTimeout(() => this.playSequence(), 1000);
    }
    
    updateLevel(newLevel) {
        this.level = newLevel;
        this.levelDisplay.textContent = this.level;
        this.currentScoreDisplay.textContent = this.level;
        this.centerLevel.textContent = this.level;
    }
    
    addToSequence() {
        const colors = ['green', 'red', 'yellow', 'blue'];
        this.sequence.push(colors[Math.floor(Math.random() * 4)]);
    }
    
    playSequence() {
        const settings = this.difficultySettings[this.difficulty];
        let i = 0;
        const interval = setInterval(() => {
            if (!this.isPlaying || i >= this.sequence.length) {
                clearInterval(interval);
                return;
            }
            
            this.activateButton(this.sequence[i], settings.showVisuals);
            i++;
        }, settings.interval);
    }
    
    activateButton(color, showVisual = true) {
        const button = this.buttons[color];
        const settings = this.difficultySettings[this.difficulty];
        
        if (showVisual) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), settings.activeTime);
        }
        
        if (this.soundEnabled) {
            this.sounds[color].currentTime = 0;
            this.sounds[color].play();
        }
    }
    
    handleButtonPress(color) {
        this.playerSequence.push(color);
        this.activateButton(color, true);
        
        const currentIndex = this.playerSequence.length - 1;
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }
        
        if (this.playerSequence.length === this.sequence.length) {
            setTimeout(() => {
                this.updateLevel(this.level + 1);
                this.nextRound();
            }, 1000);
        }
    }
    
    gameOver() {
        this.isPlaying = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.restartBtn.disabled = false; // Also make sure restart is enabled
        
        if (this.soundEnabled) {
            this.sounds.wrong.play();
        }
        
        this.showGameOver();
    }
    
    showGameOver() {
        this.gameStats.style.display = 'none';
        this.finalScoreDisplay.textContent = this.level-1;
        
        this.finalDifficultyDisplay.textContent = this.difficulty;
        this.gameOverDisplay.classList.remove('d-none');
    }
    
    hideGameOver() {
        this.gameOverDisplay.classList.add('d-none');
    }
    
    saveScore() {
        const playerName = this.playerNameInput.value.trim() || 'Harsh';
        const scores = JSON.parse(localStorage.getItem('simonScores')) || [];
        
        scores.push({
            playerName,
            score: this.level-1,
            difficulty: this.difficulty,
            date: new Date().toLocaleDateString()
        });
        
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('simonScores', JSON.stringify(scores.slice(0, 10)));
        window.location.href = 'leaderboard.html';
    }
}

document.addEventListener('DOMContentLoaded', () => new SimonGame());