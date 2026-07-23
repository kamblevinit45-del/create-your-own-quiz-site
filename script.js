const questionText = document.getElementById('question-text');
const optionInputs = Array.from(document.querySelectorAll('.option-input'));
const correctOption = document.getElementById('correct-option');
const addQuestionButton = document.getElementById('add-question');
const startQuizButton = document.getElementById('start-quiz');
const questionListItems = document.getElementById('question-list-items');
const questionList = document.getElementById('question-list');
const builderPanel = document.getElementById('builder-panel');
const quizPanel = document.getElementById('quiz-panel');
const quizContent = document.getElementById('quiz-content');

let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;

function updateQuestionList() {
  questionListItems.innerHTML = '';

  if (questions.length === 0) {
    questionListItems.innerHTML = '<li>No questions added yet.</li>';
    return;
  }

  questions.forEach((question, index) => {
    const item = document.createElement('li');
    item.textContent = question.prompt;
    questionListItems.appendChild(item);
  });
}

function resetInputFields() {
  questionText.value = '';
  optionInputs.forEach((input) => (input.value = ''));
  correctOption.value = '1';
}

function showError(message) {
  alert(message);
}

function addQuestion() {
  const prompt = questionText.value.trim();
  const options = optionInputs.map((input) => input.value.trim());
  const firstEmpty = options.findIndex((option) => option === '');

  if (!prompt) {
    showError('Please enter the question text.');
    return;
  }

  if (firstEmpty !== -1) {
    showError(`Please fill in option ${firstEmpty + 1}.`);
    return;
  }

  questions.push({
    prompt,
    options,
    correctIndex: Number(correctOption.value) - 1,
  });

  resetInputFields();
  updateQuestionList();
}

function renderQuiz() {
  const question = questions[currentQuestionIndex];
  quizContent.innerHTML = '';
  selectedAnswer = null;

  const card = document.createElement('div');
  card.className = 'quiz-card';

  const title = document.createElement('h3');
  title.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  card.appendChild(title);

  const prompt = document.createElement('p');
  prompt.textContent = question.prompt;
  card.appendChild(prompt);

  const optionsGrid = document.createElement('div');
  optionsGrid.className = 'options';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.textContent = option;
    button.addEventListener('click', () => selectAnswer(index, button));
    optionsGrid.appendChild(button);
  });

  card.appendChild(optionsGrid);

  const actionRow = document.createElement('div');
  actionRow.className = 'builder-actions';

  const submitAnswer = document.createElement('button');
  submitAnswer.className = 'primary';
  submitAnswer.textContent = currentQuestionIndex < questions.length - 1 ? 'Submit answer' : 'Finish quiz';
  submitAnswer.addEventListener('click', submitAnswerSelection);
  actionRow.appendChild(submitAnswer);

  card.appendChild(actionRow);
  quizContent.appendChild(card);
}

function selectAnswer(index, button) {
  selectedAnswer = index;
  document.querySelectorAll('.option-button').forEach((btn) => btn.classList.remove('selected'));
  button.classList.add('selected');
}

function submitAnswerSelection() {
  if (selectedAnswer === null) {
    showError('Please choose an answer before submitting.');
    return;
  }

  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctIndex;

  if (isCorrect) {
    score += 1;
  }

  showResult(isCorrect);
}

function showResult(isCorrect) {
  quizContent.innerHTML = '';

  const resultCard = document.createElement('div');
  resultCard.className = 'quiz-card';

  const status = document.createElement('p');
  status.className = 'status';
  status.textContent = isCorrect ? 'Correct!' : 'Incorrect';
  resultCard.appendChild(status);

  const explanation = document.createElement('p');
  const question = questions[currentQuestionIndex];
  explanation.textContent = `Correct answer: ${question.options[question.correctIndex]}`;
  resultCard.appendChild(explanation);

  const actionRow = document.createElement('div');
  actionRow.className = 'builder-actions';

  const nextButton = document.createElement('button');
  nextButton.className = 'primary';
  nextButton.textContent = currentQuestionIndex < questions.length - 1 ? 'Next question' : 'See final score';
  nextButton.addEventListener('click', () => {
    currentQuestionIndex += 1;
    if (currentQuestionIndex < questions.length) {
      renderQuiz();
    } else {
      renderFinalScore();
    }
  });
  actionRow.appendChild(nextButton);

  resultCard.appendChild(actionRow);
  quizContent.appendChild(resultCard);
}

function renderFinalScore() {
  quizContent.innerHTML = '';

  const finalCard = document.createElement('div');
  finalCard.className = 'quiz-card';

  const title = document.createElement('h3');
  title.textContent = 'Quiz complete!';
  finalCard.appendChild(title);

  const summary = document.createElement('p');
  summary.textContent = `You scored ${score} out of ${questions.length}.`;
  finalCard.appendChild(summary);

  const restartButton = document.createElement('button');
  restartButton.className = 'primary';
  restartButton.textContent = 'Build a new quiz';
  restartButton.addEventListener('click', () => {
    quizPanel.classList.add('hidden');
    builderPanel.classList.remove('hidden');
    quizContent.innerHTML = '';
    currentQuestionIndex = 0;
    score = 0;
  });

  finalCard.appendChild(restartButton);
  quizContent.appendChild(finalCard);
}

function startQuiz() {
  if (questions.length === 0) {
    showError('Please add at least one question before starting the quiz.');
    return;
  }

  builderPanel.classList.add('hidden');
  quizPanel.classList.remove('hidden');
  currentQuestionIndex = 0;
  score = 0;
  renderQuiz();
}

addQuestionButton.addEventListener('click', addQuestion);
startQuizButton.addEventListener('click', startQuiz);
updateQuestionList();
