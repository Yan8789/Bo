let gems = 2000;
let collection = [];
let currentPack = null;

const cards = Array.from({length: 30}, (_, i) => ({
    id: i + 1,
    image: `public/picture/card${i + 1}.jpg`,
    rarity: Math.random() < 0.05 ? 'UR' : Math.random() < 0.2 ? 'SR' : 'R'
}));

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';

    if (pageId !== 'collection') {
        document.querySelector('.card-grid').innerHTML = '';
    }
    
    if (pageId === 'collection') {
        renderCollection();
    } else if (pageId === 'games') {
        renderGames();
    }
}

function renderGames() {
    document.getElementById('games').innerHTML = `
        <div class="game-grid">
            <div class="game-card" onclick="startMemoryGame()">
                <h3>配對遊戲</h3>
                <p>獎勵: 300 寶石</p>
            </div>
            <div class="game-card" onclick="startPuzzleGame()">
                <h3>圈圈叉叉</h3>
                <p>獎勵: 100 寶石</p>
            </div>
        </div>
    `;
}

function closeGameEnd() {
    const gameEnd = document.querySelector('.game-end');
    if (gameEnd) {
        gameEnd.remove();
    }
}

function continueDraw() {
    closeGameEnd();
    document.getElementById('revealedCards').style.display = 'none';
    startDraw();
}

function startDraw() {
    if (gems < 1000) {
        const notEnoughGems = document.createElement('div');
        notEnoughGems.className = 'game-end';
        notEnoughGems.innerHTML = `
            <h2>寶石不足！</h2>
            <button onclick="closeGameEnd()">關閉</button>
        `;
        document.getElementById('packs').appendChild(notEnoughGems);
        return;
    }
    gems -= 1000;
    updateGems();
    
    currentPack = generatePack();
    document.getElementById('drawButton').style.display = 'none';
    renderPackGrid();
}

function generatePack() {
    const packSize = 5;
    return Array.from({length: packSize}, () => {
        const rand = Math.random();
        let rarity = rand < 0.05 ? 'UR' : rand < 0.25 ? 'SR' : 'R';
        const possibleCards = cards.filter(card => card.rarity === rarity);
        return possibleCards[Math.floor(Math.random() * possibleCards.length)];
    });
}

function renderPackGrid() {
    const grid = document.getElementById('packGrid');
    grid.innerHTML = '';
    grid.style.display = 'grid';
    
    for (let i = 0; i < 15; i++) {
        const pack = document.createElement('div');
        pack.className = 'pack-card';
        pack.innerHTML = `<img src="public/picture/pack.jpg" alt="pack">`;
        pack.onclick = () => selectPack(i);
        grid.appendChild(pack);
    }
}

function selectPack(index) {
    document.getElementById('packGrid').style.display = 'none';
    const packReveal = document.getElementById('packReveal');
    packReveal.style.display = 'flex';
    setupRevealHandler(packReveal);
}

function setupRevealHandler(element) {
    let tapCount = 0;
    const cardContainer = element.querySelector('.card-container');
    cardContainer.style.transform = 'translate(-50%, -30%) scale(0.8)';

    cardContainer.addEventListener('click', () => {
        tapCount++;
        if (tapCount === 1) {
            cardContainer.style.transform = 'translate(-50%, -30%) scale(0.8) rotateY(-15deg)';
        }
        if (tapCount === 2) {
            cardContainer.style.transform = 'translate(-50%, -30%) scale(0.8) rotateY(-180deg)';
            setTimeout(revealCards, 800);
        }
    });
}

function revealCards() {
    document.getElementById('packReveal').style.display = 'none';
    const revealedCards = document.getElementById('revealedCards');
    revealedCards.style.display = 'grid';
    revealedCards.innerHTML = '';
    
    currentPack.forEach(card => {
        const div = document.createElement('div');
        div.className = `card ${card.rarity.toLowerCase()}-border`;
        div.innerHTML = `<img src="${card.image}" alt="card">`;
        revealedCards.appendChild(div);
    });
    
    collection = [...collection, ...currentPack];
    
    setTimeout(() => {
        document.getElementById('drawButton').style.display = 'block';
        const continueScreen = document.createElement('div');
        continueScreen.className = 'game-end';
        continueScreen.innerHTML = `
            <h2>抽卡完成！</h2>
            ${gems >= 1000 ? '<button onclick="continueDraw()">繼續抽卡</button>' : '<div class="warning">寶石不足！</div>'}
            <button onclick="closeGameEnd()">關閉</button>
        `;
        document.getElementById('packs').appendChild(continueScreen);
    }, 2000);
}

function startMemoryGame() {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'memory-game';
    gameBoard.innerHTML = `
        <div class="game-header">
            <button onclick="showPage('games')" class="exit-btn">退出遊戲</button>
        </div>
        <div class="game-content"></div>
    `;
    
    document.getElementById('games').innerHTML = '';
    document.getElementById('games').appendChild(gameBoard);
    
    const gameContent = gameBoard.querySelector('.game-content');
    const cards = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐱', '🐶', '🐭', '🐹', '🐰', '🦊'];
    let flipped = [];
    let matched = [];
 
    cards.sort(() => Math.random() - 0.5).forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<div class="back">?</div><div class="front">${emoji}</div>`;
        card.addEventListener('click', () => flipCard(card, emoji));
        gameContent.appendChild(card);
    });
 
    function flipCard(card, emoji) {
        if (flipped.length < 2 && !flipped.includes(card) && !matched.includes(emoji)) {
            card.classList.add('flipped');
            flipped.push(card);
            
            if (flipped.length === 2) {
                setTimeout(() => {
                    const [card1, card2] = flipped;
                    const emoji1 = card1.querySelector('.front').textContent;
                    const emoji2 = card2.querySelector('.front').textContent;
                    
                    if (emoji1 === emoji2) {
                        matched.push(emoji1);
                        if (matched.length === cards.length / 2) {
                            setTimeout(() => {
                                const endScreen = document.createElement('div');
                                endScreen.className = 'game-end';
                                endScreen.innerHTML = `
                                    <h2>遊戲完成！獲得300寶石</h2>
                                    <button onclick="closeGameEnd()">關閉</button>
                                `;
                                document.getElementById('games').appendChild(endScreen);
                                earnGems(300);
                            }, 500);
                        }
                    } else {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                    }
                    flipped = [];
                }, 1000);
            }
        }
    }
}

function startPuzzleGame() {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'tictactoe-game';
    gameBoard.innerHTML = `
        <div class="game-header">
            <button onclick="showPage('games')" class="exit-btn">退出遊戲</button>
        </div>
        <div class="board">
            ${Array(9).fill('').map((_, i) => `<div class="cell" data-index="${i}"></div>`).join('')}
        </div>
    `;
    
    document.getElementById('games').innerHTML = '';
    document.getElementById('games').appendChild(gameBoard);
    
    let currentPlayer = 'X';
    let board = Array(9).fill('');
    let gameActive = true;
    
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.dataset.index;
            if (board[index] === '' && gameActive && currentPlayer === 'X') {
                makeMove(index);
            }
        });
    });
    
    function makeMove(index) {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());
        
        if (checkWin()) {
            const endScreen = document.createElement('div');
            endScreen.className = 'game-end';
            if (currentPlayer === 'X') {
                endScreen.innerHTML = `
                    <h2>你獲勝！獲得100寶石</h2>
                    <button onclick="closeGameEnd()">關閉</button>
                `;
                earnGems(100);
            } else {
                endScreen.innerHTML = `
                    <h2>電腦獲勝！</h2>
                    <button onclick="closeGameEnd()">關閉</button>
                `;
            }
            document.getElementById('games').appendChild(endScreen);
            gameActive = false;
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            const endScreen = document.createElement('div');
            endScreen.className = 'game-end';
            endScreen.innerHTML = `
                <h2>平手！</h2>
                <button onclick="closeGameEnd()">關閉</button>
            `;
            document.getElementById('games').appendChild(endScreen);
            gameActive = false;
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    function computerMove() {
        if (!gameActive) return;
        
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            makeMove(randomIndex);
        }
    }
    
    function checkWin() {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[b] === board[c];
        });
    }
}

function renderCollection() {
    const grid = document.querySelector('.card-grid');
    grid.innerHTML = '';
    
    collection.forEach(card => {
        const div = document.createElement('div');
        div.className = `card ${card.rarity.toLowerCase()}-border`;
        div.innerHTML = `<img src="${card.image}" alt="card">`;
        div.addEventListener('click', () => showEnlargedCard(card));
        grid.appendChild(div);
    });
}

function showEnlargedCard(card) {
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    overlay.innerHTML = `
        <div class="enlarged-card ${card.rarity.toLowerCase()}-border">
            <img src="${card.image}" alt="card">
        </div>
    `;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
}

function earnGems(amount) {
    gems += amount;
    updateGems();
}

function updateGems() {
    document.getElementById('gemCount').textContent = gems;
}

showPage('collection');