document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const themeToggle = document.getElementById('theme-toggle');
    const resetBtn = document.getElementById('reset-btn');
    const themeIcon = document.getElementById('theme-icon');

    // --- Lógica de Geração ---
    const createEmptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (board[row][i] === num || board[i][col] === num || board[m][n] === num) return false;
        }
        return true;
    }

    function fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function generateNewGame() {
        const fullBoard = createEmptyBoard();
        fillBoard(fullBoard);
        // Deixa cerca de 40 números (ajuste para dificuldade)
        const gameBoard = fullBoard.map(row => row.map(cell => Math.random() > 0.5 ? cell : 0));
        renderBoard(gameBoard);
    }

    function renderBoard(board) {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const input = document.createElement('input');
                input.type = 'text'; // Text para melhor controle
                input.maxLength = 1;
                input.classList.add('cell');
                input.dataset.row = r;
                input.dataset.col = c;

                if (board[r][c] !== 0) {
                    input.value = board[r][c];
                    input.readOnly = true;
                    input.classList.add('fixed');
                } else {
                    input.addEventListener('input', (e) => {
                        e.target.value = e.target.value.replace(/[^1-9]/g, '');
                        validateAllCells();
                    });
                }
                boardElement.appendChild(input);
            }
        }
    }

    function validateAllCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(c => c.classList.remove('invalid'));

        cells.forEach(cell => {
            const val = parseInt(cell.value);
            if (val) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                if (hasConflict(row, col, val)) cell.classList.add('invalid');
            }
        });
    }

    function hasConflict(row, col, val) {
        const cells = document.querySelectorAll('.cell');
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        cells.forEach(c => board[c.dataset.row][c.dataset.col] = parseInt(c.value) || 0);

        for (let i = 0; i < 9; i++) {
            if (i !== col && board[row][i] === val) return true;
            if (i !== row && board[i][col] === val) return true;
        }
        const sR = Math.floor(row / 3) * 3, sC = Math.floor(col / 3) * 3;
        for (let r = sR; r < sR + 3; r++) {
            for (let c = sC; c < sC + 3; c++) {
                if ((r !== row || c !== col) && board[r][c] === val) return true;
            }
        }
        return false;
    }

    // --- Controles ---
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });

    resetBtn.addEventListener('click', () => {
        resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => resetBtn.style.transform = 'rotate(0deg)', 500);
        generateNewGame();
    });

    generateNewGame();
});