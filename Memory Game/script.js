const symbols = ["🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍒", "🍒",
    "🍉", "🍉", "🥝", "🥝", "🍍", "🍍", "🍑", "🍑"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let totalPairs = symbols.length / 2;
let timer;
let timeLeft = 300; // 5 minutes in seconds

// shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    shuffle(symbols);
    const board = document.getElementById("game-board");
    board.innerHTML = "";
    symbols.forEach((sym, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = sym;
        card.dataset.index = index;
        card.textContent = "?";
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    // start timer
    timer = setInterval(updateTimer, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.textContent = this.dataset.symbol;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    document.getElementById("moves").textContent = moves;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        matches++;
        resetTurn();
        if (matches === totalPairs) {
            endGame();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "?";
            secondCard.textContent = "?";
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateTimer() {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function endGame(submitted = false) {
  clearInterval(timer);

  // Prevent multiple triggers
  if (document.getElementById("score-board").style.display === "block") return;

  const finalMovesEl = document.getElementById("final-moves");
  const ratingEl = document.getElementById("rating");
  const titleEl = document.querySelector("#score-board h2");

    // Case 1: Player won (all pairs matched)
    if (matches === totalPairs) {
        titleEl.textContent = "🎉 You Won!";
        finalMovesEl.textContent = moves;

        const minMoves = totalPairs;
        let extraMoves = moves - minMoves;
        let stars = 5 - Math.floor(extraMoves / 2);
        stars = Math.max(1, Math.min(stars, 5));

        ratingEl.textContent = "⭐".repeat(stars) + "☆".repeat(5 - stars);
    }
    // Case 2: Time is over
    else if (timeLeft <= 0) {
        titleEl.textContent = "⏰ Time's Up!";
        finalMovesEl.textContent = moves;
        ratingEl.textContent = "No Rating ❌";
    }
    // Case 3: Player submitted early
    else if (submitted = true) {
        titleEl.textContent = "✅ Game Submitted!";
        finalMovesEl.textContent = moves;

        // Rating based on % of correct matches found
        let progress = (matches / totalPairs) * 5; // scale to 5 stars
        let stars = Math.round(progress);

        if (stars === 0 && matches > 0) stars = 1; // give 1⭐ if at least 1 pair
        ratingEl.textContent = "⭐".repeat(stars) + "☆".repeat(5 - stars);
    }

  // Show score board and disable board
  document.getElementById("score-board").style.display = "block";
  document.getElementById("game-board").style.pointerEvents = "none";
}

startGame();