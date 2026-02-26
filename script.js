const gridElement = document.getElementById('grid');
let selectedCell = null;

// Tabuleiro inicial (0 representa vazio)
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

function initBoard() {
    gridElement.innerHTML = '';
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const val = initialBoard[row][col];
            
            if (val !== 0) {
                cell.textContent = val;
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => selectCell(cell));
            }
            gridElement.appendChild(cell);
        }
    }
}

function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    selectedCell.classList.add('selected');
}

function inputNumber(num) {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;
    
    if (num === 0) {
        selectedCell.textContent = '';
        selectedCell.classList.remove('input');
    } else {
        selectedCell.textContent = num;
        selectedCell.classList.add('input');
    }
}

function checkSolution() {
    // Uma validação real exigiria comparar com a solução completa
    // Aqui apenas damos um feedback visual simples de "preenchido"
    alert("Boa tentativa! Para uma validação real, precisaríamos implementar o algoritmo de backtracking.");
}

function resetGame() {
    initBoard();
}

initBoard();