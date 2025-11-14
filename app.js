/* ============================================
   MATRIX PUZZLE GAME - LÓGICA E INTERATIVIDADE
   ============================================ */

// ============================================
// ESTADO GLOBAL DO JOGO
// ============================================

// Definição dos 5 níveis com dificuldade gradual
const levels = [
    // Nível 1 (Simples): 2x2, resolvível com 1 operação (Trocar Linhas)
    {
        start: [
            [0, 1],
            [1, 0]
        ],
        target: [
            [1, 0],
            [0, 1]
        ]
    },
    // Nível 2 (Não tão Simples): 2x2, resolvível com 1 operação (Multiplicar Linha)
    {
        start: [
            [2, 4],
            [1, 1]
        ],
        target: [
            [1, 2],
            [1, 1]
        ]
    },
    // Nível 3 (Média): 2x2, resolvível com 2 operações (Multiplicar e depois Somar)
    {
        start: [
            [1, 2],
            [2, 3]
        ],
        target: [
            [1, 2],
            [0, -1]
        ]
    },
    // Nível 4 (Difícil): 3x3, resolvível com 2-3 operações
    {
        start: [
            [2, 4, 6],
            [1, 2, 3],
            [3, 1, 2]
        ],
        target: [
            [1, 2, 3],
            [0, 0, 0],
            [0, -5, -7]
        ]
    },
    // Nível 5 (Muito Difícil): 3x3, resolvível com 3+ operações
    {
        start: [
            [1, 2, 3],
            [2, 4, 6],
            [3, 5, 7]
        ],
        target: [
            [1, 0, -1],
            [0, 0, 0],
            [0, -1, -2]
        ]
    }
];

// Variáveis de estado do jogo
let g_currentLevelIndex = 0;
let moves = 0;
let currentMatrix = [];
let targetMatrix = [];
let moveHistory = [];

// Elementos do DOM
let startScreen = null;
let startGameBtn = null;
let gameContainer = null;
let movesCountEl = null;
let resetGameBtn = null;
let undoBtn = null;
let currentMatrixTable = null;
let targetMatrixTable = null;
let opSwapBtn = null;
let opAddBtn = null;
let opMultiplyBtn = null;
let opTransposeBtn = null;
let operationControlsDiv = null;
let gameMessageDiv = null;

// ============================================
// INICIALIZAÇÃO - PONTO DE PARTIDA
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Pegar apenas os elementos iniciais
    startScreen = document.getElementById('start-screen');
    startGameBtn = document.getElementById('start-game-btn');
    gameContainer = document.getElementById('game-container');

    // Adicionar listener apenas ao botão de iniciar
    startGameBtn.addEventListener('click', handleGameStart);
});

// ============================================
// FLUXO DE INÍCIO DO JOGO
// ============================================

function handleGameStart() {
    // Esconder tela de início
    startScreen.style.display = 'none';

    // Mostrar container do jogo
    gameContainer.style.display = 'flex';

    // Chamar função de setup
    setupGameAndListeners();
}

// ============================================
// SETUP DO JOGO E LISTENERS
// ============================================

function setupGameAndListeners() {
    // Pegar todos os elementos do jogo
    movesCountEl = document.getElementById('moves-count');
    resetGameBtn = document.getElementById('reset-game');
    undoBtn = document.getElementById('undo-move-btn');
    currentMatrixTable = document.getElementById('current-matrix');
    targetMatrixTable = document.getElementById('target-matrix');
    opSwapBtn = document.getElementById('op-swap-rows');
    opAddBtn = document.getElementById('op-add-rows');
    opMultiplyBtn = document.getElementById('op-multiply-row');
    opTransposeBtn = document.getElementById('op-transpose');
    operationControlsDiv = document.getElementById('operation-controls');
    gameMessageDiv = document.getElementById('game-message');

    // Adicionar listeners de clique
    resetGameBtn.addEventListener('click', () => initGame());
    undoBtn.addEventListener('click', handleUndo);
    opSwapBtn.addEventListener('click', () => showSwapControls());
    opAddBtn.addEventListener('click', () => showAddControls());
    opMultiplyBtn.addEventListener('click', () => showMultiplyControls());

    // Chamar função de inicialização do jogo
    initGame();
}

// ============================================
// FUNÇÕES PRINCIPAIS DO JOGO
// ============================================

function initGame() {
    g_currentLevelIndex = 0;
    moves = 0;
    loadLevel(0);
}

function loadLevel(levelIndex) {
    // Verificar se finalizou todos os níveis
    if (levelIndex >= levels.length) {
        showGameFinished();
        return;
    }

    g_currentLevelIndex = levelIndex;
    moves = 0;
    moveHistory = [];
    undoBtn.disabled = true;

    // Copiar matrizes do nível
    const levelData = levels[levelIndex];
    currentMatrix = JSON.parse(JSON.stringify(levelData.start));
    targetMatrix = JSON.parse(JSON.stringify(levelData.target));

    // Atualizar UI
    movesCountEl.textContent = '0';

    // Renderizar matrizes
    renderMatrix(currentMatrix, currentMatrixTable);
    renderMatrix(targetMatrix, targetMatrixTable);

    // Limpar controles e mensagens
    operationControlsDiv.innerHTML = '';
    gameMessageDiv.innerHTML = '';
}

function renderMatrix(matrix, tableElement) {
    tableElement.innerHTML = '';

    const rows = matrix.length;
    const cols = matrix[0].length;

    // Criar header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Célula de canto vazia
    const cornerCell = document.createElement('th');
    headerRow.appendChild(cornerCell);

    // Cabeçalhos de colunas
    for (let j = 0; j < cols; j++) {
        const th = document.createElement('th');
        th.textContent = `C${j + 1}`;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    tableElement.appendChild(thead);

    // Criar body com linhas
    const tbody = document.createElement('tbody');

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');

        // Cabeçalho de linha
        const rowHeader = document.createElement('th');
        rowHeader.textContent = `L${i + 1}`;
        tr.appendChild(rowHeader);

        // Células de dados
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            td.textContent = matrix[i][j];
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    tableElement.appendChild(tbody);
}

function checkWinCondition() {
    // Comparar matrizes
    if (matricesAreEqual(currentMatrix, targetMatrix)) {
        showWinScreen(false);
    }
}

function matricesAreEqual(matrix1, matrix2) {
    if (matrix1.length !== matrix2.length) return false;
    if (matrix1[0].length !== matrix2[0].length) return false;

    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[0].length; j++) {
            if (matrix1[i][j] !== matrix2[i][j]) return false;
        }
    }

    return true;
}

function showWinScreen(isGameFinished) {
    gameMessageDiv.innerHTML = '';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content win-message';

    if (isGameFinished) {
        messageContent.innerHTML = `
            <h2>🎉 Parabéns! 🎉</h2>
            <p>Você completou todos os 5 níveis!</p>
            <p>Movimentos totais: ${moves}</p>
        `;

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Voltar ao Início';
        nextBtn.addEventListener('click', () => {
            startScreen.style.display = 'flex';
            gameContainer.style.display = 'none';
        });

        gameMessageDiv.appendChild(messageContent);
        gameMessageDiv.appendChild(nextBtn);
    } else {
        messageContent.innerHTML = `
            <h2>✅ Nível ${g_currentLevelIndex + 1} Completo!</h2>
            <p>Movimentos: ${moves}</p>
        `;

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Próximo Nível';
        nextBtn.addEventListener('click', () => {
            loadLevel(g_currentLevelIndex + 1);
        });

        gameMessageDiv.appendChild(messageContent);
        gameMessageDiv.appendChild(nextBtn);
    }
}

function showGameFinished() {
    gameMessageDiv.innerHTML = '';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content win-message';
    messageContent.innerHTML = `
        <h2>🏆 Jogo Completo! 🏆</h2>
        <p>Você completou todos os níveis!</p>
        <p>Movimentos totais: ${moves}</p>
    `;

    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Jogar Novamente';
    restartBtn.addEventListener('click', () => initGame());

    gameMessageDiv.appendChild(messageContent);
    gameMessageDiv.appendChild(restartBtn);
}

function hideMessage() {
    gameMessageDiv.innerHTML = '';
}

function showError(message) {
    gameMessageDiv.innerHTML = '';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content error-message';
    messageContent.innerHTML = `<p>${message}</p>`;

    gameMessageDiv.appendChild(messageContent);

    setTimeout(() => {
        hideMessage();
    }, 3000);
}

// ============================================
// CONTROLES DE OPERAÇÕES - INTERFACE
// ============================================

function showSwapControls() {
    operationControlsDiv.innerHTML = '';

    const rows = currentMatrix.length;

    // Dropdown para primeira linha
    const label1 = document.createElement('label');
    label1.textContent = 'Linha 1:';

    const select1 = document.createElement('select');
    select1.id = 'swap-row1';
    for (let i = 0; i < rows; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `L${i + 1}`;
        select1.appendChild(option);
    }

    // Dropdown para segunda linha
    const label2 = document.createElement('label');
    label2.textContent = 'Linha 2:';

    const select2 = document.createElement('select');
    select2.id = 'swap-row2';
    for (let i = 0; i < rows; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `L${i + 1}`;
        if (i === 1) option.selected = true;
        select2.appendChild(option);
    }

    // Botão de confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Aplicar Troca';
    confirmBtn.addEventListener('click', handleSwap);

    operationControlsDiv.appendChild(label1);
    operationControlsDiv.appendChild(select1);
    operationControlsDiv.appendChild(label2);
    operationControlsDiv.appendChild(select2);
    operationControlsDiv.appendChild(confirmBtn);
}

function showAddControls() {
    operationControlsDiv.innerHTML = '';

    const rows = currentMatrix.length;

    // Dropdown para linha a somar
    const label1 = document.createElement('label');
    label1.textContent = 'Linha para somar:';

    const select1 = document.createElement('select');
    select1.id = 'add-row-source';
    for (let i = 0; i < rows; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `L${i + 1}`;
        select1.appendChild(option);
    }

    // Dropdown para linha destino
    const label2 = document.createElement('label');
    label2.textContent = 'Adicionar em:';

    const select2 = document.createElement('select');
    select2.id = 'add-row-dest';
    for (let i = 0; i < rows; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `L${i + 1}`;
        if (i === 1) option.selected = true;
        select2.appendChild(option);
    }

    // Input para multiplicador
    const label3 = document.createElement('label');
    label3.textContent = 'Multiplicador:';

    const input = document.createElement('input');
    input.id = 'add-multiplier';
    input.type = 'number';
    input.value = '1';

    // Botão de confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Aplicar Soma';
    confirmBtn.addEventListener('click', handleAdd);

    operationControlsDiv.appendChild(label1);
    operationControlsDiv.appendChild(select1);
    operationControlsDiv.appendChild(label2);
    operationControlsDiv.appendChild(select2);
    operationControlsDiv.appendChild(label3);
    operationControlsDiv.appendChild(input);
    operationControlsDiv.appendChild(confirmBtn);
}

function showMultiplyControls() {
    operationControlsDiv.innerHTML = '';

    const rows = currentMatrix.length;

    // Dropdown para linha
    const label1 = document.createElement('label');
    label1.textContent = 'Linha:';

    const select = document.createElement('select');
    select.id = 'multiply-row';
    for (let i = 0; i < rows; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `L${i + 1}`;
        select.appendChild(option);
    }

    // Input para multiplicador
    const label2 = document.createElement('label');
    label2.textContent = 'Multiplicador:';

    const input = document.createElement('input');
    input.id = 'multiply-value';
    input.type = 'number';
    input.value = '2';

    // Botão de confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Aplicar Multiplicação';
    confirmBtn.addEventListener('click', handleMultiply);

    operationControlsDiv.appendChild(label1);
    operationControlsDiv.appendChild(select);
    operationControlsDiv.appendChild(label2);
    operationControlsDiv.appendChild(input);
    operationControlsDiv.appendChild(confirmBtn);
}

// ============================================
// FUNÇÕES DE OPERAÇÕES - LÓGICA
// ============================================

function handleSwap() {
    const row1 = parseInt(document.getElementById('swap-row1').value);
    const row2 = parseInt(document.getElementById('swap-row2').value);

    // Validar
    if (row1 === row2) {
        showError('As linhas devem ser diferentes!');
        return;
    }

    // Salvar estado no histórico ANTES da mudança
    moveHistory.push(JSON.parse(JSON.stringify(currentMatrix)));
    undoBtn.disabled = false;

    // Trocar linhas
    const temp = currentMatrix[row1];
    currentMatrix[row1] = currentMatrix[row2];
    currentMatrix[row2] = temp;

    // Atualizar UI
    moves++;
    movesCountEl.textContent = moves;
    renderMatrix(currentMatrix, currentMatrixTable);
    operationControlsDiv.innerHTML = '';
    hideMessage();
    checkWinCondition();
}

function handleAdd() {
    const sourceRow = parseInt(document.getElementById('add-row-source').value);
    const destRow = parseInt(document.getElementById('add-row-dest').value);
    const multiplier = parseFloat(document.getElementById('add-multiplier').value);

    // Validar
    if (isNaN(multiplier)) {
        showError('Multiplicador deve ser um número válido!');
        return;
    }

    if (sourceRow === destRow) {
        showError('As linhas devem ser diferentes!');
        return;
    }

    // Salvar estado no histórico ANTES da mudança
    moveHistory.push(JSON.parse(JSON.stringify(currentMatrix)));
    undoBtn.disabled = false;

    // Somar linhas
    const cols = currentMatrix[0].length;
    for (let j = 0; j < cols; j++) {
        currentMatrix[destRow][j] += currentMatrix[sourceRow][j] * multiplier;
    }

    // Atualizar UI
    moves++;
    movesCountEl.textContent = moves;
    renderMatrix(currentMatrix, currentMatrixTable);
    operationControlsDiv.innerHTML = '';
    hideMessage();
    checkWinCondition();
}

function handleMultiply() {
    const row = parseInt(document.getElementById('multiply-row').value);
    const multiplier = parseFloat(document.getElementById('multiply-value').value);

    // Validar
    if (isNaN(multiplier)) {
        showError('Multiplicador deve ser um número válido!');
        return;
    }

    if (multiplier === 0) {
        showError('Multiplicador não pode ser 0!');
        return;
    }

    // Salvar estado no histórico ANTES da mudança
    moveHistory.push(JSON.parse(JSON.stringify(currentMatrix)));
    undoBtn.disabled = false;

    // Multiplicar linha
    const cols = currentMatrix[0].length;
    for (let j = 0; j < cols; j++) {
        currentMatrix[row][j] *= multiplier;
    }

    // Atualizar UI
    moves++;
    movesCountEl.textContent = moves;
    renderMatrix(currentMatrix, currentMatrixTable);
    operationControlsDiv.innerHTML = '';
    hideMessage();
    checkWinCondition();
}

// ============================================
// FUNÇÃO DE DESFAZER
// ============================================

function handleUndo() {
    // Verificar se há histórico
    if (moveHistory.length === 0) {
        showError('Não há movimentos para desfazer!');
        return;
    }

    // Pegar estado anterior
    const previousMatrix = moveHistory.pop();
    currentMatrix = previousMatrix;

    // Decrementar movimentos
    moves--;
    movesCountEl.textContent = moves;

    // Renderizar matriz restaurada
    renderMatrix(currentMatrix, currentMatrixTable);
    hideMessage();

    // Desabilitar botão se não houver mais histórico
    if (moveHistory.length === 0) {
        undoBtn.disabled = true;
    }

    // Verificar condição de vitória (opcional)
    checkWinCondition();
}
