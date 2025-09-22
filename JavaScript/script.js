const configBox = document.querySelector(".config-container");
const quizBox = document.querySelector(".quiz-container");
const resultBox = document.querySelector(".result-pop-up");

const categoryBtns = document.querySelectorAll(".category-option");
const questionBtns = document.querySelectorAll(".question-option");
const startBtn = document.querySelector(".start-btn");
const nextBtn = document.querySelector(".next-que-btn");
const restartBtn = document.querySelector(".restart-quiz-btn");

const questionText = document.querySelector(".question-text");
const optionsList = document.querySelector(".ans-opt");
const statusText = document.querySelector(".que-status");
const timerText = document.querySelector(".time-duration");
const scoreText = document.querySelector(".score-text");

let selectedCategory = 0;
let totalQuestions = 10;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timePerQ = 15;

// choose category
categoryBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = idx;
  });
});

// choose number of questions
questionBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    questionBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    totalQuestions = parseInt(btn.textContent);
  });
});

// start quiz
startBtn.addEventListener("click", () => {
  configBox.style.display = "none";
  quizBox.style.display = "block";
  initQuiz();
});

function initQuiz() {
  score = 0;
  currentIndex = 0;
  const pool = questions[selectedCategory].questions.slice();
  shuffle(pool);
  currentQuestions = pool.slice(0, totalQuestions);
  loadQuestion();
}

// load question
function loadQuestion() {
  clearInterval(timer);
  startTimer();

  const q = currentQuestions[currentIndex];
  const correctIndex = q.answer ?? q.correctAnswer;

  questionText.textContent = q.question;
  optionsList.innerHTML = "";

  q.options.forEach((opt, i) => {
    const li = document.createElement("li");
    li.className = "option btn btn-outline-danger text-start my-2";
    li.textContent = opt;
    li.addEventListener("click", () => {
      clearInterval(timer);
      if (i === correctIndex) {
        li.classList.add("bg-success", "text-white");
        score++;
      } else {
        li.classList.add("bg-danger", "text-white");
        // show correct
        optionsList.children[correctIndex].classList.add("bg-success", "text-white");
      }
      // disable all
      Array.from(optionsList.children).forEach(el => el.classList.add("disabled"));
    });
    optionsList.appendChild(li);
  });

  statusText.innerHTML = `<b>${currentIndex + 1}</b> of <b>${totalQuestions}</b> Questions`;
}

// timer
function startTimer() {
  let time = timePerQ;
  timerText.textContent = `${time}s`;
  timer = setInterval(() => {
    time--;
    timerText.textContent = `${time}s`;
    if (time <= 0) {
      clearInterval(timer);
      showAnswerTimeout();
    }
  }, 1000);
}

function showAnswerTimeout() {
  const q = currentQuestions[currentIndex];
  const correctIndex = q.correctAnswer;
  optionsList.children[correctIndex].classList.add("bg-success", "text-white");
  Array.from(optionsList.children).forEach(el => el.classList.add("disabled"));
}

// next question
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < totalQuestions) {
    loadQuestion();
  } else {
    showResult();
  }
});

// show result
function showResult() {
  quizBox.style.display = "none";
  resultBox.style.display = "block";
  scoreText.innerHTML = `You answered <b>${score}</b> out of <b>${totalQuestions}</b> Questions Correctly.<br/> ${
    score === totalQuestions ? "Excellent!" : "Great effort!"
  }`;
}

// restart quiz
restartBtn.addEventListener("click", () => {
  resultBox.style.display = "none";
  configBox.style.display = "block";
});

// shuffle utility
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
