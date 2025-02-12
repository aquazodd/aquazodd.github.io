// Landing Page
document.getElementById('start-button').addEventListener('click', () => {
    showPage('memory-game');
    initializeMemoryGame();
  });
  
  // Game 1: Dog Memory Match
  const dogImages = ['🐶', '🐕', '🦮', '🐩', '🐕‍🦺', '🐾'];
  const memoryCards = [...dogImages, ...dogImages];
  let flippedCards = [];
  let matchedCards = [];
  
  function initializeMemoryGame() {
    const memoryGrid = document.querySelector('.memory-grid');
    memoryGrid.innerHTML = '';
    shuffleArray(memoryCards).forEach((image, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.framework = image;
      card.innerText = '❓';
      card.addEventListener('click', flipCard);
      memoryGrid.appendChild(card);
    });
  }
  
  function flipCard() {
    if (flippedCards.length < 2 && !flippedCards.includes(this)) {
      this.innerText = this.dataset.framework;
      this.classList.add('flip');
      flippedCards.push(this);
      if (flippedCards.length === 2) {
        checkForMatch();
      }
    }
  }
  
  function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.framework === card2.dataset.framework) {
      matchedCards.push(card1, card2);
      if (matchedCards.length === memoryCards.length) {
        showMessage('Pawsome job! You unlocked the next game!', 'trivia-game');
        initializeTriviaGame(); // Initialize the trivia game after memory match is completed
      }
    } else {
      setTimeout(() => {
        card1.innerText = '❓';
        card2.innerText = '❓';
        card1.classList.remove('flip');
        card2.classList.remove('flip');
      }, 1000);
    }
    flippedCards = [];
  }
  
  // Game 2: MCU Trivia
  const triviaQuestions = [
    {
      question: "What is Captain America’s shield made of?",
      options: ["Vibranium", "Adamantium", "Titanium"],
      answer: "Vibranium"
    },
    {
      question: "Who is Thor’s adopted brother?",
      options: ["Loki", "Hela", "Odin"],
      answer: "Loki"
    },
    {
      question: "What is the name of Tony Stark’s AI assistant?",
      options: ["JARVIS", "FRIDAY", "ULTRON"],
      answer: "JARVIS"
    },
    {
      question: "What is the name of the planet in Guardians of the Galaxy?",
      options: ["Xandar", "Titan", "Knowhere"],
      answer: "Xandar"
    },
    {
      question: "Who is the main villain in The Avengers (2012)?",
      options: ["Loki", "Thanos", "Ultron"],
      answer: "Loki"
    },
    {
      question: "What is the name of Thor’s hammer?",
      options: ["Mjolnir", "Stormbreaker", "Gungnir"],
      answer: "Mjolnir"
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  
  function initializeTriviaGame() {
    currentQuestion = 0; // Reset the question index
    score = 0; // Reset the score
    loadQuestion();
  }
  
  function loadQuestion() {
    const question = triviaQuestions[currentQuestion];
    document.getElementById('trivia-question').innerText = question.question;
    const optionsDiv = document.getElementById('trivia-options');
    optionsDiv.innerHTML = '';
    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.innerText = option;
      button.addEventListener('click', () => checkAnswer(option));
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
        showMessage(`Quiz over! Your score is ${score}/${triviaQuestions.length}. You unlocked the next page!`, 'grand-reveal');
      } else {
        showMessage(`Quiz over! Your score is ${score}/${triviaQuestions.length}. Try again to unlock the next page!`, 'trivia-game');
        initializeTriviaGame(); // Restart the trivia game if the score is too low
      }
    }
  }
  
  // Grand Reveal Page
  let yesCount = 1;
  document.getElementById('no-button').addEventListener('click', () => {
    yesCount++;
    const yesButton = document.getElementById('yes-button');
    yesButton.style.transform = `scale(${1 + yesCount * 0.1})`;
    yesButton.innerText = `Yes! x${yesCount}`;
  });
  
  // Utility Functions
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function showMessage(message, nextPage) {
    const messageElement = document.querySelector(`#${nextPage} .message`);
    if (messageElement) {
      messageElement.innerText = message;
    }
    showPage(nextPage);
  }
  
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
  }

// Timers
let memoryStartTime, puzzleStartTime, triviaStartTime;

// Start Timer
function startTimer(timerElement) {
  let startTime = Date.now();
  setInterval(() => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = `Time: ${elapsedTime}s`;
  }, 1000);
}

// Confetti
function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container');
  const types = ['🦋', '🌹'];
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.innerText = types[Math.floor(Math.random() * types.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.fontSize = `${Math.random() * 20 + 10}px`;
    confettiContainer.appendChild(confetti);
  }
}

// Grand Reveal Page
document.getElementById('next-button-3').addEventListener('click', () => {
  showPage('grand-reveal');
  startBackgroundMusic();
  startCountdown();
});

// Background Music
function startBackgroundMusic() {
  const backgroundMusic = document.getElementById('background-music');
  backgroundMusic.play();
}

// Countdown Timer
function startCountdown() {
  const countdown = () => {
    const valentinesDay = new Date(new Date().getFullYear(), 1, 14).getTime(); // February 14 of the current year
    const now = new Date().getTime();
    const timeLeft = valentinesDay - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById('timer').innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      document.getElementById('timer').innerText = "It's Valentine's Day!";
    }
  };

  setInterval(countdown, 1000);
  countdown(); // Initial call to avoid delay
}

// Grand Reveal Page Logic
document.getElementById('yes-button').addEventListener('click', () => {
    createConfetti();
    const celebrationText = document.getElementById('celebration-text');
    celebrationText.classList.add('show');
  });
  
  // Transition Page 4: Final Puzzle
  document.getElementById('next-button-3').addEventListener('click', () => {
    showPage('transition-3');
  });
  
  document.getElementById('next-button-4').addEventListener('click', () => {
    showPage('grand-reveal');
    startBackgroundMusic();
  });
  
  // Randomize Trivia Answers
  function loadQuestion() {
    const question = triviaQuestions[currentQuestion];
    document.getElementById('trivia-question').innerText = question.question;
    const optionsDiv = document.getElementById('trivia-options');
    optionsDiv.innerHTML = '';
  
    // Shuffle the options
    const shuffledOptions = shuffleArray(question.options);
    shuffledOptions.forEach((option, index) => {
      const button = document.createElement('button');
      button.innerText = option;
      button.addEventListener('click', () => checkAnswer(option));
      optionsDiv.appendChild(button);
    });
  }