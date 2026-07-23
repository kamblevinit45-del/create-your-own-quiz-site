const loginScreen = document.getElementById('login-screen');
const categoryScreen = document.getElementById('category-screen');
const builderScreen = document.getElementById('builder-screen');
const quizScreen = document.getElementById('quiz-screen');
const finalScreen = document.getElementById('final-screen');
const loginForm = document.getElementById('login-form');
const playerName = document.getElementById('player-name');
const playerAge = document.getElementById('player-age');
const viewScoresButton = document.getElementById('view-scores-button');
const createQuizButton = document.getElementById('create-quiz-button');
const backToCategories = document.getElementById('back-to-categories');
const addCustomQuestionButton = document.getElementById('add-custom-question');
const startCustomQuizButton = document.getElementById('start-custom-quiz');
const customQuestionForm = document.getElementById('custom-question-form');
const customQuestionList = document.getElementById('custom-question-list');
const quizTitle = document.getElementById('quiz-title');
const quizDifficultyLabel = document.getElementById('quiz-difficulty');
const quizProgress = document.getElementById('quiz-progress');
const quizQuestionCard = document.getElementById('quiz-question-card');
const nextQuestionButton = document.getElementById('next-question-button');
const cancelQuizButton = document.getElementById('cancel-quiz-button');
const playAgainButton = document.getElementById('play-again-button');
const backHomeButton = document.getElementById('back-home-button');

const screens = {
  login: loginScreen,
  categories: categoryScreen,
  builder: builderScreen,
  quiz: quizScreen,
  final: finalScreen,
};

const state = {
  player: null,
  currentQuiz: null,
  customQuestions: [],
  usedQuestionIds: new Set(),
  lastScore: null,
  lastQuizSize: null,
  activeQuestionIndex: 0,
  selectedAnswer: null,
};

const templates = {
  math: {
    easy: [
      (age) => createMathQuestion('addition', age, 10, 1),
      (age) => createMathQuestion('subtraction', age, 10, 1),
      (age) => createMathQuestion('counting', age, 12, 1),
    ],
    medium: [
      (age) => createMathQuestion('multiplication', age, 12, 2),
      (age) => createMathQuestion('division', age, 12, 2),
      (age) => createMathQuestion('fraction', age, 10, 1),
    ],
    hard: [
      (age) => createMathQuestion('percent', age, 100, 2),
      (age) => createMathQuestion('equation', age, 20, 2),
      (age) => createMathQuestion('decimals', age, 10, 1),
    ],
  },
  gk: {
    easy: [
      () => buildQuestion('What color is the sky on a sunny day?', ['Blue', 'Green', 'Red', 'Yellow'], 0),
      () => buildQuestion('Which animal says "meow"?', ['Dog', 'Cat', 'Cow', 'Bird'], 1),
      () => buildQuestion('How many legs does a spider have?', ['6', '8', '4', '10'], 1),
    ],
    medium: [
      () => buildQuestion('What planet do we live on?', ['Mars', 'Earth', 'Venus', 'Jupiter'], 1),
      () => buildQuestion('What is the opposite of day?', ['Night', 'Rain', 'Sun', 'Wind'], 0),
      () => buildQuestion('Which shape has four equal sides?', ['Circle', 'Square', 'Triangle', 'Oval'], 1),
    ],
    hard: [
      () => buildQuestion('Who invented the telephone?', ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Albert Einstein'], 0),
      () => buildQuestion('What is the tallest animal on earth?', ['Elephant', 'Giraffe', 'Lion', 'Kangaroo'], 1),
      () => buildQuestion('Which continent has the most countries?', ['Africa', 'Asia', 'Europe', 'South America'], 0),
    ],
  },
  science: {
    easy: [
      () => buildQuestion('What does a plant need to grow?', ['Sunlight', 'Sand', 'Iron', 'Ice'], 0),
      () => buildQuestion('Which one is a liquid?', ['Water', 'Rock', 'Air', 'Glass'], 0),
      () => buildQuestion('What do we breathe in?', ['Oxygen', 'Chocolate', 'Sound', 'Light'], 0),
    ],
    medium: [
      () => buildQuestion('Water turns into ice when it is?', ['Heated', 'Frozen', 'Stirred', 'Painted'], 1),
      () => buildQuestion('What holds your skeleton together?', ['Muscles', 'Bones', 'Hair', 'Shoes'], 1),
      () => buildQuestion('Electricity comes from?', ['Batteries', 'Fruits', 'Books', 'Clouds'], 0),
    ],
    hard: [
      () => buildQuestion('What is the center of an atom called?', ['Nucleus', 'Planet', 'Molecule', 'Cell'], 0),
      () => buildQuestion('What force keeps you on the ground?', ['Magnetism', 'Gravity', 'Friction', 'Wind'], 1),
      () => buildQuestion('Which body part helps you digest food?', ['Eye', 'Stomach', 'Ear', 'Lung'], 1),
    ],
  },
  history: {
    easy: [
      () => buildQuestion('Who sailed the ship called the Mayflower?', ['Pilgrims', 'Astronauts', 'Pirates', 'Farmers'], 0),
      () => buildQuestion('Which day celebrates the country’s birthday?', ['Independence Day', 'Weekend', 'Birthday', 'Snow Day'], 0),
      () => buildQuestion('Who is known for flying the first airplane?', ['Wright brothers', 'Neil Armstrong', 'Albert Einstein', 'Isaac Newton'], 0),
    ],
    medium: [
      () => buildQuestion('The Great Pyramid is located in which country?', ['Mexico', 'Egypt', 'China', 'Italy'], 1),
      () => buildQuestion('Which famous wall was in China?', ['Berlin Wall', 'Great Wall', 'Hadrian’s Wall', 'Wall of China'], 1),
      () => buildQuestion('Who discovered America in 1492?', ['Christopher Columbus', 'Marco Polo', 'Albert Einstein', 'Thomas Edison'], 0),
    ],
    hard: [
      () => buildQuestion('Which invention helped send messages quickly in the 1800s?', ['Internet', 'Telegraph', 'Radio', 'Telephone'], 1),
      () => buildQuestion('The ancient Romans built a large city called?', ['Rome', 'Paris', 'Cairo', 'Athens'], 0),
      () => buildQuestion('Which explorer sailed around the world?', ['Ferdinand Magellan', 'Christopher Columbus', 'Marco Polo', 'Lewis Carroll'], 0),
    ],
  },
};

function createMathQuestion(type, age, maxNumber, precision) {
  const a = randomBetween(1, maxNumber);
  const b = randomBetween(1, Math.max(1, maxNumber - 2));
  let prompt = '';
  let correct = 0;

  if (type === 'addition') {
    correct = a + b;
    prompt = `What is ${a} + ${b}?`;
  } else if (type === 'subtraction') {
    correct = a;
    prompt = `What is ${a + b} - ${b}?`;
  } else if (type === 'multiplication') {
    correct = a * b;
    prompt = `What is ${a} × ${b}?`;
  } else if (type === 'division') {
    const product = a * b;
    correct = a;
    prompt = `What is ${product} ÷ ${b}?`;
  } else if (type === 'fraction') {
    return buildQuestion(`If you have ${a}/${b} of a pizza, what is the top number called?`, ['Numerator', 'Denominator', 'Fraction', 'Pizza'], 0);
  } else if (type === 'percent') {
    correct = 10 * a;
    prompt = `What is ${a * 10}% of 100?`;
  } else if (type === 'equation') {
    correct = a;
    prompt = `Solve: x + ${b} = ${a + b}`;
  } else if (type === 'decimals') {
    const x = (a + 0.5).toFixed(1);
    const y = (b + 0.5).toFixed(1);
    correct = parseFloat((parseFloat(x) + parseFloat(y)).toFixed(1));
    prompt = `What is ${x} + ${y}?`;
  }

  const options = createAnswerOptions(correct, type);
  return { prompt, options, correctIndex: options.indexOf(String(correct)) };
}

function createAnswerOptions(correct) {
  const answers = new Set([String(correct)]);
  while (answers.size < 4) {
    const offset = randomBetween(1, Math.max(2, Math.floor(Math.abs(correct) / 2) + 2));
    const candidate = String(Math.max(0, Number(correct) + (Math.random() > 0.5 ? offset : -offset)));
    answers.add(candidate);
  }
  return shuffle(Array.from(answers));
}

function buildQuestion(prompt, options, correctIndex) {
  const shuffled = shuffle(options.slice());
  const correctText = options[correctIndex];
  const finalIndex = shuffled.indexOf(correctText);
  return { prompt, options: shuffled, correctIndex: finalIndex };
}

function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficulty(age) {
  if (age <= 9) return 'easy';
  if (age <= 13) return 'medium';
  return 'hard';
}

function getCategoryLabel(categoryKey) {
  return {
    math: 'Maths',
    gk: 'General Knowledge',
    science: 'Science',
    history: 'History',
  }[categoryKey];
}

function showScreen(screenKey) {
  Object.values(screens).forEach((screen) => screen.classList.add('hidden'));
  screens[screenKey].classList.remove('hidden');
}

function login(event) {
  event.preventDefault();
  const username = loginForm.querySelector('#username').value.trim();
  const password = loginForm.querySelector('#password').value.trim();
  const ageValue = Number(loginForm.querySelector('#age').value);

  if (!username || !password) {
    return alert('Please enter a username and password.');
  }

  if (!ageValue || ageValue < 6 || ageValue > 17) {
    return alert('Please enter a valid age between 6 and 17.');
  }

  state.player = { name: username, age: ageValue };
  playerName.textContent = username;
  playerAge.textContent = ageValue;
  showScreen('categories');
}

function startQuiz(categoryKey, fixedQuestions = null) {
  const categoryLabel = getCategoryLabel(categoryKey);
  const difficulty = getDifficulty(state.player.age);
  quizTitle.textContent = `${categoryLabel} Quiz`;
  quizDifficultyLabel.textContent = `Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
  state.activeQuestionIndex = 0;
  state.selectedAnswer = null;

  if (fixedQuestions) {
    state.currentQuiz = fixedQuestions;
  } else {
    state.currentQuiz = generateQuiz(categoryKey, state.player.age, 7);
  }

  updateProgress();
  renderQuestion();
  showScreen('quiz');
}

function generateQuiz(categoryKey, age, count) {
  const difficulty = getDifficulty(age);
  const questions = [];
  const used = state.usedQuestionIds;
  const available = templates[categoryKey][difficulty];

  let attempts = 0;
  while (questions.length < count && attempts < count * 10) {
    const template = available[randomBetween(0, available.length - 1)];
    const question = template(age);
    const questionId = `${categoryKey}|${difficulty}|${question.prompt}`;
    if (!used.has(questionId)) {
      used.add(questionId);
      questions.push(question);
    } else if (questions.length + 1 > available.length) {
      questions.push(question);
    }
    attempts += 1;
  }

  return questions;
}

function renderQuestion() {
  const question = state.currentQuiz[state.activeQuestionIndex];
  quizQuestionCard.innerHTML = '';
  state.selectedAnswer = null;
  nextQuestionButton.classList.add('hidden');

  const title = document.createElement('h3');
  title.textContent = `Question ${state.activeQuestionIndex + 1} of ${state.currentQuiz.length}`;
  quizQuestionCard.appendChild(title);

  const prompt = document.createElement('p');
  prompt.textContent = question.prompt;
  quizQuestionCard.appendChild(prompt);

  const optionsGrid = document.createElement('div');
  optionsGrid.className = 'options';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-button';
    button.textContent = option;
    button.addEventListener('click', () => chooseAnswer(index, button));
    optionsGrid.appendChild(button);
  });

  quizQuestionCard.appendChild(optionsGrid);
}

function chooseAnswer(index, button) {
  if (state.selectedAnswer !== null) return;
  state.selectedAnswer = index;
  const question = state.currentQuiz[state.activeQuestionIndex];

  document.querySelectorAll('.option-button').forEach((btn, btnIndex) => {
    btn.classList.remove('selected');
    if (btnIndex === index) btn.classList.add('selected');
  });

  const isCorrect = index === question.correctIndex;
  const answerButtons = Array.from(document.querySelectorAll('.option-button'));
  answerButtons.forEach((btn, btnIndex) => {
    btn.disabled = true;
    if (btnIndex === question.correctIndex) {
      btn.classList.add('correct');
    }
  });

  if (!isCorrect) {
    button.classList.add('incorrect');
  }

  if (isCorrect) {
    question.answeredCorrectly = true;
  }

  showAnswerResult(isCorrect, question.options[question.correctIndex]);
  nextQuestionButton.classList.remove('hidden');
}

function showAnswerResult(isCorrect, correctAnswer) {
  const result = document.createElement('p');
  result.className = 'status';
  result.textContent = isCorrect ? 'Great job! That is correct.' : `Oops, that is wrong. Correct answer: ${correctAnswer}`;
  quizQuestionCard.appendChild(result);
}

function updateProgress() {
  const completed = state.activeQuestionIndex;
  const total = state.currentQuiz?.length || 1;
  quizProgress.innerHTML = `<span style="width: ${Math.round((completed / total) * 100)}%"></span>`;
}

function nextQuestion() {
  if (state.activeQuestionIndex < state.currentQuiz.length - 1) {
    state.activeQuestionIndex += 1;
    updateProgress();
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const correctCount = state.currentQuiz.reduce((count, question) => {
    return count + (question.answeredCorrectly ? 1 : 0);
  }, 0);

  state.lastScore = correctCount;
  state.lastQuizSize = state.currentQuiz.length;
  document.getElementById('final-score-text').textContent = `You scored ${correctCount} out of ${state.currentQuiz.length}.`;
  showScreen('final');
}

function cancelQuiz() {
  if (!confirm('Do you want to return to the categories screen? Your current quiz progress will be lost.')) {
    return;
  }
  showScreen('categories');
}

function addCustomQuestion() {
  const category = customQuestionForm.querySelector('#custom-category').value;
  const difficulty = customQuestionForm.querySelector('#custom-difficulty').value;
  const prompt = customQuestionForm.querySelector('#custom-question').value.trim();
  const options = [
    customQuestionForm.querySelector('#custom-option-1').value.trim(),
    customQuestionForm.querySelector('#custom-option-2').value.trim(),
    customQuestionForm.querySelector('#custom-option-3').value.trim(),
    customQuestionForm.querySelector('#custom-option-4').value.trim(),
  ];
  const correctIndex = Number(customQuestionForm.querySelector('#custom-correct').value) - 1;

  if (!prompt || options.some((opt) => !opt)) {
    return alert('Please complete the custom question and all four answer options.');
  }

  state.customQuestions.push({
    category,
    difficulty,
    prompt,
    options,
    correctIndex,
    id: `custom-${Date.now()}-${state.customQuestions.length}`,
  });

  renderCustomQuestionList();
  customQuestionForm.reset();
}

function renderCustomQuestionList() {
  if (state.customQuestions.length === 0) {
    customQuestionList.innerHTML = '<li>No custom questions added yet.</li>';
    return;
  }

  customQuestionList.innerHTML = state.customQuestions
    .map((question) => `<li><strong>${question.category.toUpperCase()}</strong> (${question.difficulty}) — ${question.prompt}</li>`)
    .join('');
}

function startCustomQuiz() {
  const selectedCategory = customQuestionForm.querySelector('#custom-category').value;
  const customQuestions = state.customQuestions.filter((question) => question.category === selectedCategory);

  if (customQuestions.length === 0) {
    return alert('Add at least one custom question in the selected category before starting the quiz.');
  }

  const quizQuestions = customQuestions.map((question) => ({
    prompt: question.prompt,
    options: shuffle(question.options.slice()),
    correctIndex: question.options.indexOf(question.options[question.correctIndex]),
  }));

  state.currentQuiz = shuffle(quizQuestions).slice(0, 7);
  state.activeQuestionIndex = 0;
  state.selectedAnswer = null;
  quizTitle.textContent = 'Custom Quiz';
  quizDifficultyLabel.textContent = 'Created by you';
  state.customQuestions = state.customQuestions.filter((question) => question.category !== selectedCategory);
  renderCustomQuestionList();
  updateProgress();
  renderQuestion();
  showScreen('quiz');
}

function viewLastScore() {
  if (state.lastScore === null) {
    alert('You have not finished a quiz yet.');
  } else {
    alert(`Your last score was ${state.lastScore} out of ${state.lastQuizSize}.`);
  }
}

function playAgain() {
  showScreen('categories');
}

function backHome() {
  showScreen('categories');
}

function attachEvents() {
  loginForm.addEventListener('submit', login);
  createQuizButton.addEventListener('click', () => showScreen('builder'));
  viewScoresButton.addEventListener('click', viewLastScore);
  backToCategories.addEventListener('click', () => showScreen('categories'));
  addCustomQuestionButton.addEventListener('click', addCustomQuestion);
  startCustomQuizButton.addEventListener('click', startCustomQuiz);
  nextQuestionButton.addEventListener('click', nextQuestion);
  cancelQuizButton.addEventListener('click', cancelQuiz);
  playAgainButton.addEventListener('click', playAgain);
  backHomeButton.addEventListener('click', backHome);
  document.querySelectorAll('.category-button').forEach((button) => {
    button.addEventListener('click', () => startQuiz(button.dataset.category));
  });
}

attachEvents();
