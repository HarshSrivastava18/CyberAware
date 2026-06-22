let QUESTIONS = [];
let TOTAL = 0;

let current = 0;
let answers = [];
let visited = [];
let timerInterval;
let secondsLeft = 1200;
// ── Init ──────────────────────────────────────────────────────────────────────
function init() {
  buildNavGrid();
  renderQuestion();
  startTimer();
}

function buildNavGrid() {
  const grid = document.getElementById('navGrid');
  grid.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const btn = document.createElement('button');
    btn.className = 'qbtn';
    btn.textContent = i + 1;
    btn.onclick = () => goTo(i);
    grid.appendChild(btn);
  }
}

function updateNavGrid() {
  const btns = document.querySelectorAll('.qbtn');
  btns.forEach((btn, i) => {
    btn.className = 'qbtn';
    if (i === current) btn.classList.add('active');
    else if (answers[i] === -1) btn.classList.add('skipped');
    else if (answers[i] !== null) btn.classList.add('answered');
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderQuestion() {
  
  const q = QUESTIONS[current];
  visited[current] = true;
  document.getElementById('secBadge').textContent=q.section;
  document.getElementById('catBadge').textContent = q.category;
  document.getElementById('diffBadge').textContent = q.difficulty;
  document.getElementById('qNumber').textContent = `Q${current + 1}`;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('progressLabel').textContent = `Question ${current + 1} of ${TOTAL}`;
  document.getElementById('fill').style.width = `${((current + 1) / TOTAL) * 100}%`;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx);
    if (answers[current] === idx) btn.classList.add('selected');
    container.appendChild(btn);
  });

  updateNavGrid();
}

function selectOption(idx) {
  answers[current] = idx;
  document.querySelectorAll('.option').forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
  updateNavGrid();
}

// ── Navigation ────────────────────────────────────────────────────────────────
function navigate(dir) {
  const next = current + dir;
  if (next >= 0 && next < TOTAL) { current = next; renderQuestion(); }
}

function goTo(i) {
  current = i;
  renderQuestion();
}

function skipQuestion() {
  if (answers[current] === null) answers[current] = -1;
  if (current < TOTAL - 1) { current++; renderQuestion(); }
}

// ── Timer ─────────────────────────────────────────────────────────────────────
function startTimer() {
  const el = document.getElementById('timer');
  timerInterval = setInterval(() => {
    if (secondsLeft <= 0) { clearInterval(timerInterval); finishQuiz(); return; }
    secondsLeft--;
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    el.textContent = `⏱ ${m}:${s}`;
    if (secondsLeft <= 60) el.style.color = '#ff4444';
  }, 1000);
}

// ── Finish ────────────────────────────────────────────────────────────────────
function finishQuiz() {
  clearInterval(timerInterval);

  let correct = 0, skipped = 0, unattempted = 0;
  QUESTIONS.forEach((q, i) => {
    if (answers[i] === q.answer) correct++;
    else if (answers[i] === -1) skipped++;
    else if (answers[i] === null) unattempted++;
  });
  const wrong = TOTAL - correct - skipped - unattempted;
  const pct = Math.round((correct / TOTAL) * 100);

  document.getElementById('quizLayout').style.display = 'none';
  const panel = document.getElementById('resultPanel');
  panel.style.display = 'block';

  document.getElementById('scoreCircle').textContent = pct + '%';
  document.getElementById('resultSub').textContent =
    pct >= 80 ? '🌟 Excellent! Youre a cybersecurity pro.' :
    pct >= 50 ? '👍 Good effort — keep learning!' :
    '📚 Keep studying — youve got this!';

  document.getElementById('statsRow').innerHTML = `
    <div class="stat"><div class="stat-val" style="color:#2e7d32">${correct}</div><div class="stat-label">Correct</div></div>
    <div class="stat"><div class="stat-val" style="color:#c62828">${wrong}</div><div class="stat-label">Wrong</div></div>
    <div class="stat"><div class="stat-val" style="color:grey">${skipped}</div><div class="stat-label">Skipped</div></div>
    <div class="stat"><div class="stat-val">${unattempted}</div><div class="stat-label">Not Attempted</div></div>
    <div class="stat"><div class="stat-val">${Math.floor((1200 - secondsLeft) / 60)}m ${(1200 - secondsLeft) % 60}s</div><div class="stat-label">Time Taken</div></div>
  `;

    // SAVE RESULT TO DATABASE
    const user = JSON.parse(localStorage.getItem("user"));
    const resultData = {
        user_uid: user.uid,
        score: correct,
        total_questions: QUESTIONS.length,
        correct_answers: correct,
        skipped_que: skipped,
        not_attempted: unattempted,
        wrong_answers: wrong
    };

    fetch("https://cyberaware-vnpf.onrender.com/api/quiz/result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
    })
        .then(res => res.json())
        .then(data => {
            console.log("Result Saved:", data);
        })
        .catch(err => {
            console.error("Save Error:", err);
        });


  // Review
  const reviewEl = document.getElementById('reviewItems');
  reviewEl.innerHTML = '';
  QUESTIONS.forEach((q, i) => {
    const userAns = answers[i];
    const isCorrect = userAns === q.answer;
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <div class="rq">${i + 1}. ${q.q}</div>
      <div class="ra ${isCorrect ? 'correct-a' : 'wrong-a'}">
        ${userAns === null ? '⚠️ Not attempted' :
          userAns === -1 ? '⏭ Skipped' :
          isCorrect ? '✅ ' + q.options[userAns] :
          '❌ Your answer: ' + q.options[userAns]}
      </div>
      ${!isCorrect && userAns !== null && userAns !== -1
        ? `<div class="ra correct-a" style="margin-top:4px">✅ Correct: ${q.options[q.answer]}</div>` : ''}
    `;
    reviewEl.appendChild(div);
  });
}

function restartQuiz() {
  answers = new Array(TOTAL).fill(null);
  visited = new Array(TOTAL).fill(false);
  current = 0;
  secondsLeft = 1200;
  document.getElementById('timer').style.color = '#fff';
  document.getElementById('resultPanel').style.display = 'none';
  document.getElementById('quizLayout').style.display = 'flex';
  buildNavGrid();
  renderQuestion();
  startTimer();
}
/*load questions*/
async function loadQuestions() {

    try {

        const response = await fetch(
            "https://cyberaware-vnpf.onrender.com/api/quiz/questions"
        );

        QUESTIONS = await response.json();
        TOTAL = QUESTIONS.length;

        answers = new Array(TOTAL).fill(null);
        visited = new Array(TOTAL).fill(false);

        init();

    } catch (error) {

        console.error("Failed to load questions:", error);

    }
}
loadQuestions();
init();
