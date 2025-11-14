PROJETO: "Matrix Puzzle Game" (Matemática Discreta)
🎯 Objetivo do Projeto
Criar um jogo web interativo, em tela única, para a disciplina de Matemática Discreta. O jogador deve transformar uma "Matriz Atual" em uma "Matriz Objetivo" usando operações de linha. O jogo deve ter uma tela de início, 5 níveis de dificuldade gradual, um sistema de contagem de movimentos e uma função para desfazer o último movimento.

O projeto será composto por 3 arquivos: index.html, style.css, e app.js.

1. 📄 index.html (A Estrutura HTML)
Este arquivo conterá apenas a estrutura semântica do site.

Requisitos:

Padrão: Deve ser um arquivo HTML5 padrão (<!DOCTYPE html>, <head>, <body>).

Links:

Deve linkar o style.css dentro do <head>.

Deve linkar o app.js no final do <body>, antes de fechar a tag </body>.

Estrutura do <body>:

Tela de Início (Visível):

Um <div id="start-screen">.

Deve conter um <h1> (ex: "Matrix Puzzle Game"), um <p> (ex: "Um desafio de Matemática Discreta") e o botão principal: <button id="start-game-btn">Começar o Jogo!</button>.

Container do Jogo (Invisível):

Um <div class="container" id="game-container">. Este div envolve todo o jogo.

Dentro do #game-container:

Informações do Jogo (div.game-info):

Um div para o contador de movimentos: Movimentos: <span id="moves-count">0</span>.

NOVO: Um botão de desfazer: <button id="undo-move-btn">Desfazer</button>.

Um botão de reinício: <button id="reset-game">Novo Jogo</button>.

Área das Matrizes (div.matrix-display-area):

Matriz Atual (Esquerda): Um div.matrix-card contendo um <h3> ("Matriz Atual") e a tabela <table id="current-matrix" class="matrix-table"></table>.

Matriz Objetivo (Direita): Um div.matrix-card contendo um <h3> ("Matriz Objetivo") e a tabela <table id="target-matrix" class="matrix-table"></table>.

Área de Operações (div.operations-area):

Um <h2> ("Operações:").

Um div.operation-buttons contendo 4 botões:

<button id="op-swap-rows">Trocar Linhas</button>

<button id="op-add-rows">Somar Linhas</button>

<button id="op-multiply-row">Multiplicar Linha</button>

<button id="op-transpose" disabled>Transpor Matriz (v2)</button> (Deve estar desabilitado).

Um div#operation-controls (vazio) onde o JavaScript injetará os controles (dropdowns, inputs) para cada operação.

Área de Mensagem (div#game-message):

Um div vazio que será usado para exibir mensagens de vitória (nível/jogo) e erros.

2. 🎨 style.css (O Visual e Layout)
Este arquivo definirá todo o visual do jogo.

Requisitos:

Tema: Dark Mode, com um visual "tech" e limpo.

Paleta de Cores Principal:

Fundo (body): Azul escuro/carvão (ex: #2c3e50).

Containers (.container, .matrix-card): Azul-acinzentado (ex: #34495e).

Texto Principal: Branco/Cinza claro (ex: #ecf0f1).

Acento Principal (Títulos, Cabeçalhos L/C): Laranja vibrante (ex: #e67e22).

Acento Secundário (Botões de Operação): Azul claro (ex: #3498db).

Sucesso (Botão Iniciar, Mensagem de Vitória): Verde (ex: #27ae60).

Perigo/Reset (Botão Novo Jogo, Mensagem de Erro): Vermelho (ex: #e74c3c).

Informação (Contador de Movimentos): Amarelo (ex: #f1c40f).

NOVO (Botão Desfazer): Cinza neutro ou amarelo (ex: #f1c40f ou #7f8c8d).

Layout (O Ponto Crítico):

body deve usar display: flex, align-items: center, justify-content: center para centralizar a tela de início.

#start-screen: Deve estar visível por padrão (display: flex).

#game-container: Deve estar invisível por padrão (display: none).

div.game-info: Deve usar display: flex e justify-content: space-between para alinhar os botões e o contador.

Estado dos Botões (IMPORTANTE):

O botão #undo-move-btn deve ter um estilo para o estado disabled (ex: background-color: #576574; cursor: not-allowed;). Ele deve iniciar desabilitado.

Estilo das Matrizes:

As tabelas (.matrix-table) devem ter border-collapse: collapse.

As células (td) devem ter um fundo (ex: #3f5872), borda e texto centralizado.

Cabeçalhos (L/C): O JavaScript criará <th> para os cabeçalhos. Eles devem ser estilizados com a cor de acento principal (Laranja, #e67e22). A célula de canto (0,0) deve ter fundo transparente e sem borda.

3. 🧠 app.js (A Lógica e Interatividade)
Este é o cérebro do projeto. A lógica de inicialização é crucial.

Requisitos:

Ponto de Partida (A Lógica de Carregamento Correta):

O script deve usar window.addEventListener('DOMContentLoaded', ...).

Dentro deste listener, o único código a ser executado é:

Pegar os elementos #start-screen, #start-game-btn, e #game-container.

Adicionar um listener de clique apenas ao #start-game-btn.

Fluxo de Início do Jogo (O Clique em "Começar"):

O clique no #start-game-btn deve disparar uma função que:

Esconde #start-screen (ex: style.display = 'none').

Mostra #game-container (ex: style.display = 'block').

Chama uma função setupGameAndListeners().

Função setupGameAndListeners():

Esta é a primeira vez que o script "pega" os elementos do jogo.

Deve "pegar" todos os elementos do jogo (#moves-count, #reset-game, #undo-move-btn, tabelas, botões de operação) e salvá-los em variáveis globais.

Deve anexar todos os listeners de clique do jogo (ex: resetGameBtn.addEventListener(...), opSwapBtn.addEventListener(...), undoBtn.addEventListener('click', handleUndo)).

Deve chamar initGame() pela primeira vez.

Estado Global do Jogo:

const levels = [...]: Um array contendo 5 objetos, cada um com uma matriz start e target.

AJUSTE: Dificuldade Gradual: Os 5 níveis DEVEM seguir uma progressão de dificuldade:

Nível 1 (Simples): Uma matriz 2x2, resolvível com 1 operação (ex: Trocar Linhas).

Nível 2 (Não tão Simples): Uma matriz 2x2, resolvível com 1 operação diferente (ex: Multiplicar Linha).

Nível 3 (Média): Uma matriz 2x2 ou 3x3, resolvível com 2 operações (ex: Multiplicar e depois Somar).

Nível 4 (Difícil): Uma matriz 3x3, resolvível com 2-3 operações.

Nível 5 (Muito Difícil): Uma matriz 3x3, resolvível com 3+ operações, exigindo planejamento.

let g_currentLevelIndex = 0;

let moves = 0;

let currentMatrix = [];, let targetMatrix = [];

NOVO: let moveHistory = []; (Um array para guardar os estados anteriores da currentMatrix).

Variáveis para os elementos do DOM (ex: let movesCountEl;, let undoBtn;).

Funções Principais:

initGame(): Reseta g_currentLevelIndex para 0, moves para 0, e chama loadLevel(0).

loadLevel(levelIndex):

Verifica se levelIndex é maior ou igual a levels.length (fim do jogo).

Reseta moves = 0.

NOVO: Limpa o histórico: moveHistory = [];.

NOVO: Desabilita o botão desfazer: undoBtn.disabled = true;.

Copia as matrizes do nível usando JSON.parse(JSON.stringify(levelData.start)).

Chama renderMatrix() para as duas tabelas.

Limpa #operation-controls e #game-message.

renderMatrix(matrix, tableElement): (Mesma lógica anterior, com <thead> para C1/C2 e <tbody>/<th> para L1/L2).

checkWinCondition(): (Mesma lógica anterior).

showWinScreen(isGameFinished): (Mesma lógica anterior, criando o botão "Próximo Nível" dinamicamente).

Funções de Operação (Lógica):

handleSwap() / handleAdd() / handleMultiply():

Ler e validar os valores. Se inválido, mostrar erro.

NOVO (ANTES da mudança): Salvar o estado atual no histórico: moveHistory.push(JSON.parse(JSON.stringify(currentMatrix)));.

NOVO: Habilitar o botão desfazer: undoBtn.disabled = false;.

Modificar o array currentMatrix.

Incrementar moves e atualizar movesCountEl.textContent.

Chamar renderMatrix(currentMatrix, currentMatrixTable).

Chamar checkWinCondition().

NOVA Função: handleUndo():

Verifica se moveHistory.length > 0. Se for 0, não faz nada.

Pega o último estado: const previousMatrix = moveHistory.pop();.

Define a matriz atual: currentMatrix = previousMatrix; (não precisa de deep copy, já é um objeto limpo).

Decrementa os movimentos: moves--; e atualiza movesCountEl.textContent.

Renderiza a matriz restaurada: renderMatrix(currentMatrix, currentMatrixTable).

Limpa qualquer mensagem de erro: hideMessage().

NOVO: Verifica se o histórico está vazio e desabilita o botão: if (moveHistory.length === 0) { undoBtn.disabled = true; }.

(Opcional: Chamar checkWinCondition() se o jogador desfez para um estado vencedor).