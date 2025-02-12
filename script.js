document.addEventListener("DOMContentLoaded", () => {
  // Landing Page Start Button
  document.getElementById("start-button").addEventListener("click", () => {
    showPage("memory-game");
    initializeMemoryGame();
    startTimer(document.getElementById("memory-timer"));
  });

  // Transition Page 1: Memory Match Complete
  document.getElementById("next-button-1").addEventListener("click", () => {
    showPage("trivia-game");
    initializeTriviaGame();
    startTimer(document.getElementById("trivia-timer"));
  });

  // Transition Page 2: Trivia Complete
  document.getElementById("next-button-2").addEventListener("click", () => {
    showPage("transition-3");
  });

  // Transition Page 3: Final Reveal
  document.getElementById("next-button-3").addEventListener("click", () => {
    showPage("transition-4");
  });
  document.getElementById("next-button-4").addEventListener("click", () => {
    showPage("grand-reveal");
  });

  // Grand Reveal: No Button Fun
  let yesCount = 1;
  document.getElementById("no-button").addEventListener("click", () => {
    yesCount++;
    const yesButton = document.getElementById("yes-button");
    yesButton.style.transform = `scale(${1 + yesCount * 0.1})`;
    yesButton.innerText = `Yes! x${yesCount}`;
  });

  // Grand Reveal: Yes Button Celebration
  document.getElementById("yes-button").addEventListener("click", () => {
    createConfetti();
    document.getElementById("celebration-text").classList.add("show");
});
});

/* =======================
  MEMORY GAME (Dog Match)
======================= */
const dogImages = ["🐶", "🐕", "🦮", "🐩", "🐕‍🦺", "🐾"];
const memoryCards = [...dogImages, ...dogImages];
let flippedCards = [];
let matchedCards = [];

function initializeMemoryGame() {
  const memoryGrid = document.querySelector(".memory-grid");
  memoryGrid.innerHTML = "";
  shuffleArray(memoryCards).forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.value = image;
    card.innerText = "❓";
    card.addEventListener("click", flipCard);
    memoryGrid.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length < 2 && !flippedCards.includes(this)) {
    this.innerText = this.dataset.value;
    this.classList.add("flip");
    flippedCards.push(this);

    if (flippedCards.length === 2) checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.value === card2.dataset.value) {
    matchedCards.push(card1, card2);
    if (matchedCards.length === memoryCards.length) {
      showMessage("Pawsome job! You unlocked the next game!", "transition-1");
    }
  } else {
    setTimeout(() => {
      card1.innerText = "❓";
      card2.innerText = "❓";
      card1.classList.remove("flip");
      card2.classList.remove("flip");
    }, 1000);
  }
  flippedCards = [];
}

/* =======================
   MCU TRIVIA GAME
======================= */
const triviaQuestions = [
  { question: "What is Captain America’s shield made of?", options: ["Vibranium", "Adamantium", "Titanium"], answer: "Vibranium" },
  { question: "Who is Thor’s adopted brother?", options: ["Loki", "Hela", "Odin"], answer: "Loki" },
  { question: "What is the name of Tony Stark’s AI assistant?", options: ["JARVIS", "FRIDAY", "ULTRON"], answer: "JARVIS" },
  { question: "What is the name of the planet in Guardians of the Galaxy?", options: ["Xandar", "Titan", "Knowhere"], answer: "Xandar" },
  { question: "Who is the main villain in The Avengers (2012)?", options: ["Loki", "Thanos", "Ultron"], answer: "Loki" },
  { question: "What is the name of Thor’s hammer?", options: ["Mjolnir", "Stormbreaker", "Gungnir"], answer: "Mjolnir" }
];

let currentQuestion = 0;
let score = 0;

function initializeTriviaGame() {
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  const question = triviaQuestions[currentQuestion];
  document.getElementById("trivia-question").innerText = question.question;
  const optionsDiv = document.getElementById("trivia-options");
  optionsDiv.innerHTML = "";

  shuffleArray(question.options).forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.addEventListener("click", () => checkAnswer(option));
    optionsDiv.appendChild(button);
  });
}

function checkAnswer(selectedOption) {
  if (selectedOption === triviaQuestions[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;

  if (currentQuestion < triviaQuestions.length) {
    loadQuestion();
  } else {
    if (score >= 5) {
      showMessage(`Quiz over! Score: ${score}/${triviaQuestions.length}. You unlocked the next page!`, "transition-3");
    } else {
      showMessage(`Quiz over! Score: ${score}/${triviaQuestions.length}. Try again!`, "trivia-game");
      initializeTriviaGame();
    }
  }
}

/* =======================
      UTILITIES
======================= */
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showMessage(message, nextPage) {
  const messageElement = document.querySelector(`#${nextPage} .message`);
  if (messageElement) messageElement.innerText = message;
  showPage(nextPage);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

function startTimer(timerElement) {
  let startTime = Date.now();
  setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = `Time: ${elapsedTime}s`;
  }, 1000);
}

function startBackgroundMusic() {
  const backgroundMusic = document.getElementById("background-music");
  backgroundMusic.play().catch(error => {
    console.log("Autoplay prevented:", error);
  });
}

// Confetti Animation - Rising from the Bottom & Covering Full Page
function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container');
  const types = ['🦋', '🌹', '💖', '✨']; // Added more variety

  setInterval(() => {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.innerText = types[Math.floor(Math.random() * types.length)];

    // Random positioning and styling
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.bottom = '0px'; // Start from the bottom
    confetti.style.fontSize = `${Math.random() * 40 + 20}px`; // Larger size
    confetti.style.animationDuration = `${Math.random() * 5 + 3}s`; // Longer float time
    confetti.style.opacity = `${Math.random() * 0.8 + 0.2}`; // Varying opacity

    confettiContainer.appendChild(confetti);

    // Remove confetti after animation ends
    setTimeout(() => {
      confetti.remove();
    }, 8000); // Adjust to match animation duration
  }, 200); // Continuous confetti generation
}

