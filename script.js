const boardElement = document.getElementById('sudoku-board');
const themeToggle = document.getElementById('theme-toggle');
const resetBtn = document.getElementById('reset-btn');
const themeIcon = document.getElementById('theme-icon');

// --- LÓGICA DO JOGO ---

const createEmptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
            return false;
        }
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

function pokeHoles(board, holes = 45) {
    const newBoard = board.map(row => [...row]);
    let removed = 0;
    while (removed < holes) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (newBoard[r][c] !== 0) {
            newBoard[r][c] = 0;
            removed++;
        }
    }
    return newBoard;
}

function generateNewGame() {
    const fullBoard = createEmptyBoard();
    fillBoard(fullBoard);
    const gameBoard = pokeHoles(fullBoard);
    renderBoard(gameBoard);
}

function renderBoard(board) {
    boardElement.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('cell');
            input.dataset.row = r;
            input.dataset.col = c;

            if (board[r][c] !== 0) {
                input.value = board[r][c];
                input.readOnly = true;
                input.classList.add('fixed');
            } else {
                input.addEventListener('input', () => validateAllCells());
            }
            boardElement.appendChild(input);
        }
    }
}

function validateAllCells() {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(c => c.classList.remove('invalid'));

    allCells.forEach(cell => {
        const val = parseInt(cell.value);
        if (val) {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (hasConflict(row, col, val)) {
                cell.classList.add('invalid');
            }
        }
    });
}

function hasConflict(row, col, val) {
    const allCells = document.querySelectorAll('.cell');
    const boardState = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    allCells.forEach(input => {
        const r = parseInt(input.dataset.row);
        const c = parseInt(input.dataset.col);
        boardState[r][c] = parseInt(input.value) || 0;
    });

    for (let i = 0; i < 9; i++) {
        if (i !== col && boardState[row][i] === val) return true;
        if (i !== row && boardState[i][col] === val) return true;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if ((r !== row || c !== col) && boardState[r][c] === val) return true;
        }
    }
    return false;
}

// --- CONTROLES E EVENTOS (CORRIGIDOS) ---

// Função única para o tema
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Atualiza o ícone: se o novo tema for escuro, mostra o sol. Se for claro, a lua.
    if (themeIcon) {
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
});

// Função única para o reset
resetBtn.addEventListener('click', () => {
    // Animação de rotação
    resetBtn.style.transition = 'transform 0.5s ease';
    resetBtn.style.transform = 'rotate(360deg)';
    
    // Gera o jogo
    generateNewGame();

    // Reseta a posição do ícone após a animação
    setTimeout(() => {
        resetBtn.style.transition = 'none';
        resetBtn.style.transform = 'rotate(0deg)';
    }, 500);
});

// Inicialização
generateNewGame();