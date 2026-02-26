const boardElement = document.getElementById('sudoku-board');
const themeToggle = document.getElementById('theme-toggle');
const resetBtn = document.getElementById('reset-btn');

// Tabuleiro Inicial (0 representa espaço vazio)
const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('cell');
            input.dataset.row = r;
            input.dataset.col = c;

            if (initialBoard[r][c] !== 0) {
                input.value = initialBoard[r][c];
                input.readOnly = true;
                input.classList.add('fixed');
            } else {
                input.addEventListener('input', (e) => validateInput(e.target));
            }
            boardElement.appendChild(input);
        }
    }
}

function validateInput(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const val = parseInt(cell.value);

    // Limpa erro anterior
    cell.classList.remove('invalid');

    if (isNaN(val) || val < 1 || val > 9) {
        if (cell.value !== "") cell.classList.add('invalid');
        return;
    }

    if (hasConflict(row, col, val)) {
        cell.classList.add('invalid');
    }
}

function hasConflict(row, col, val) {
    const cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < 81; i++) {
        const r = parseInt(cells[i].dataset.row);
        const c = parseInt(cells[i].dataset.col);
        const v = parseInt(cells[i].value);

        if (v === val && (r !== row || c !== col)) {
            // Mesma linha ou mesma coluna
            if (r === row || c === col) return true;

            // Mesmo quadrante 3x3
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            if (r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3) {
                return true;
            }
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

// Reiniciar
resetBtn.addEventListener('click', createBoard);

// Iniciar Jogo
createBoard();