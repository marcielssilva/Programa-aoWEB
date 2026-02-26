// Configurações Globais
const CONFIG = {
    holes: 45, // Dificuldade (mais buracos = mais difícil)
    animations: true
};

// ... (mantenha as funções fillBoard e isValid)

function renderBoard(board) {
    const fragment = document.createDocumentFragment(); // Melhora performance de renderização
    boardElement.innerHTML = '';
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('input');
            input.type = 'text'; // Mudado para text para melhor controle de input
            input.inputMode = 'numeric';
            input.maxLength = 1;
            input.classList.add('cell');
            input.dataset.row = r;
            input.dataset.col = c;

            if (board[r][c] !== 0) {
                input.value = board[r][c];
                input.readOnly = true;
                input.classList.add('fixed');
            } else {
                input.addEventListener('keyup', handleInput);
            }
            fragment.appendChild(input);
        }
    }
    boardElement.appendChild(fragment);
}

function handleInput(e) {
    const input = e.target;
    // Remove qualquer coisa que não seja 1-9
    input.value = input.value.replace(/[^1-9]/g, '');
    
    validateAllCells();
    checkWinCondition();
}

function checkWinCondition() {
    const cells = document.querySelectorAll('.cell');
    const isFull = Array.from(cells).every(c => c.value !== "");
    const hasErrors = document.querySelectorAll('.invalid').length > 0;

    if (isFull && !hasErrors) {
        alert("Parabéns! Você resolveu o Sudoku! 🎉");
    }
}