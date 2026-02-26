const boardElement = document.getElementById('sudoku-board');
const themeToggle = document.getElementById('theme-toggle');
const resetBtn = document.getElementById('reset-btn');

// Função para gerar um tabuleiro 9x9 vazio
const createEmptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

// Função para verificar se um número pode ser colocado em determinada posição
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        // Verifica linha, coluna e bloco 3x3
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
            return false;
        }
    }
    return true;
}

// Algoritmo de Backtracking para preencher o tabuleiro completamente
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

// Remove números para criar o desafio
function pokeHoles(board, holes = 40) {
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

let currentSolution = [];

function generateNewGame() {
    const fullBoard = createEmptyBoard();
    fillBoard(fullBoard);
    currentSolution = fullBoard.map(row => [...row]); // Salva a solução se quiser conferir depois
    const gameBoard = pokeHoles(fullBoard, 45); // 45 espaços vazios (dificuldade média)
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
                input.addEventListener('input', (e) => validateInput(e.target, board));
            }
            boardElement.appendChild(input);
        }
    }
}

function validateInput(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const val = parseInt(cell.value);

    cell.classList.remove('invalid');

    if (!val) return; // Se apagar o número, remove o vermelho

    if (val < 1 || val > 9) {
        cell.classList.add('invalid');
        return;
    }

    // Validação em tempo real comparando com o que está na tela
    if (hasConflict(row, col, val)) {
        cell.classList.add('invalid');
    }
}

function hasConflict(row, col, val) {
    const inputs = document.querySelectorAll('.cell');
    const boardState = Array.from({ length: 9 }, () => Array(9).fill(0));
    
    // Mapeia o estado atual dos inputs para uma matriz
    inputs.forEach(input => {
        const r = input.dataset.row;
        const c = input.dataset.col;
        boardState[r][c] = parseInt(input.value) || 0;
    });

    // Verifica linha e coluna
    for (let i = 0; i < 9; i++) {
        if (i !== col && boardState[row][i] === val) return true;
        if (i !== row && boardState[i][col] === val) return true;
    }

    // Verifica quadrante 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if ((r !== row || c !== col) && boardState[r][c] === val) return true;
        }
    }
    return false;
}

// Alternar Modo Noturno
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
});

// Botão Reiniciar agora gera um novo jogo
resetBtn.addEventListener('click', generateNewGame);

// Iniciar primeiro jogo
generateNewGame();