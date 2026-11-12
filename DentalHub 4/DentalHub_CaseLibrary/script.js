const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");
const logoutButton = document.getElementById("logoutButton");
const toast = document.getElementById("toast");
const dashboardPage = document.getElementById("dashboardPage");
const caseLibraryPage = document.getElementById("caseLibraryPage");
const caseLibraryContent = document.getElementById("caseLibraryContent");
const myProgressPage = document.getElementById("myProgressPage");
const myProgressContent = document.getElementById("myProgressContent");
const modulePage = document.getElementById("modulePage");
const moduleContent = document.getElementById("moduleContent");
const BOOKMARK_KEY = "dentalhub_bookmarks_v1";
const NOTES_KEY = "dentalhub_notes_v1";
const LESSON_KEY = "dentalhub_lessons_v1";
const CHALLENGE_KEY = "dentalhub_daily_challenge_v1";
let bookmarks = readStore(BOOKMARK_KEY, []);
let notes = readStore(NOTES_KEY, []);
let completedLessons = readStore(LESSON_KEY, []);
let challengeState = readStore(CHALLENGE_KEY, {});
let activeQuiz = null;

let toastTimeout;
let activeCase = null;
let currentQuestion = 0;
let selectedAnswers = [];
let libraryFilters = { search: "", category: "All cases", difficulty: "All levels" };
const PROGRESS_KEY = "dentalhub_case_progress_v1";
let caseProgress = loadCaseProgress();
let hintVisible = false;
let activeAttemptId = null;

const caseData = [
  {
    id: 1, title: "Caries detection", category: "Restorative dentistry", difficulty: "Beginner", duration: "3–5 min", tint: "blue", icon: "◉",
    summary: "Recognize common signs of dental caries and connect clinical symptoms with a likely finding.",
    objectives: ["Identify common caries risk clues", "Recognize a typical early lesion", "Choose an appropriate next step"],
    patient: "A 19-year-old patient reports sensitivity when drinking cold beverages. They mention frequent sugary snacks and irregular brushing.",
    history: "No significant medical history reported. The patient has not had a dental check-up in over a year.",
    findings: "A small chalky-white area is visible near the gingival margin of a posterior tooth. No swelling is reported.",
    questions: [
      { prompt: "Which finding can be an early sign of enamel demineralization?", options: ["A chalky-white spot", "A completely healthy pink gingiva", "A normal, intact enamel surface with no opacity", "A missing tooth with healed tissue"], correct: 0, explanation: "An early non-cavitated carious lesion may appear as a chalky-white opacity because mineral loss changes the way enamel reflects light." },
      { prompt: "Which factor in this history increases caries risk?", options: ["Drinking plain water", "Frequent sugary snacks", "Regular dental check-ups", "Brushing consistently with fluoride toothpaste"], correct: 1, explanation: "Frequent exposure to fermentable carbohydrates can increase acid attacks on tooth surfaces and contribute to caries risk." },
      { prompt: "What is the most appropriate general next step?", options: ["Ignore the finding", "Make a diagnosis from the description alone", "Arrange a proper dental assessment and risk evaluation", "Start antibiotics immediately"], correct: 2, explanation: "A qualified dental professional should assess the tooth, confirm the finding, and consider risk-based preventive or restorative care." }
    ]
  },
  {
    id: 2, title: "Periapical lesions", category: "Endodontics", difficulty: "Intermediate", duration: "4–6 min", tint: "purple", icon: "◎",
    summary: "Review symptoms and findings that may indicate disease around a tooth root apex.",
    objectives: ["Connect symptoms with periapical findings", "Understand the role of pulp testing", "Select a sensible assessment step"],
    patient: "A 32-year-old patient presents with discomfort when biting on a previously restored lower molar.",
    history: "The discomfort began several days ago. The patient reports that the tooth had a deep restoration in the past.",
    findings: "For this teaching scenario, the radiographic description notes a radiolucent area near the root apex. Further clinical tests are needed.",
    questions: [
      { prompt: "What does a radiolucent area near the root apex generally suggest?", options: ["A finding that needs clinical correlation", "Definitive proof of one specific diagnosis", "A normal feature in every tooth", "That no further examination is needed"], correct: 0, explanation: "A periapical radiolucency can have several causes. It must be interpreted alongside symptoms, pulp tests, examination, and imaging quality." },
      { prompt: "Which test may help assess pulpal status?", options: ["A vision test", "A pulp sensibility test", "A hearing test", "A blood pressure reading alone"], correct: 1, explanation: "Pulp sensibility testing, interpreted with other findings, can help assess the response of the pulp." },
      { prompt: "Why should the radiograph not be used alone?", options: ["Radiographs never show bone", "Every dark area is the same condition", "Imaging findings need clinical context", "Radiographs replace patient history"], correct: 2, explanation: "Diagnosis combines history, clinical examination, appropriate tests, and imaging rather than relying on a single finding." }
    ]
  },
  {
    id: 3, title: "Impacted third molar", category: "Oral surgery", difficulty: "Intermediate", duration: "4–5 min", tint: "teal", icon: "⌁",
    summary: "Explore third-molar position, symptoms, and the information needed before treatment planning.",
    objectives: ["Recognize common third-molar concerns", "Identify relevant history and examination", "Understand why imaging must be interpreted carefully"],
    patient: "A 21-year-old patient reports intermittent discomfort at the back of the lower jaw.",
    history: "The patient describes occasional tenderness around the area but has no reported fever or facial swelling.",
    findings: "The teaching image description suggests a lower third molar that has not fully erupted. Its position and relationship to nearby structures need assessment.",
    questions: [
      { prompt: "What does the term impacted third molar mean?", options: ["A third molar that has not erupted into its expected position", "A tooth that has always been absent", "A tooth that has already been extracted", "A normal baby tooth"], correct: 0, explanation: "An impacted tooth is prevented from erupting normally, often because of its position or lack of space." },
      { prompt: "Which detail is important when assessing a lower third molar?", options: ["The patient's favorite food", "Its relationship to nearby anatomical structures", "The color of the patient's clothes", "The time of the last meal only"], correct: 1, explanation: "Position and proximity to important structures can influence risk assessment and treatment planning." },
      { prompt: "What should guide management?", options: ["A universal rule to remove every third molar", "The radiograph alone, without examination", "Symptoms, clinical findings, risks, and appropriate imaging", "The patient's age alone"], correct: 2, explanation: "Management is individualized using symptoms, examination, pathology risk, patient factors, and appropriate imaging." }
    ]
  },
  {
    id: 4, title: "Periodontal bone loss", category: "Periodontics", difficulty: "Advanced", duration: "5–7 min", tint: "orange", icon: "⌗",
    summary: "Practice interpreting a simplified description of periodontal findings and bone-level changes.",
    objectives: ["Recognize common periodontal assessment clues", "Relate bone levels to the full clinical picture", "Choose appropriate periodontal measurements"],
    patient: "A 46-year-old patient reports bleeding during brushing and a persistent bad taste.",
    history: "The patient has not had periodontal maintenance for several years and reports smoking history.",
    findings: "The educational scenario describes generalized gingival inflammation and reduced alveolar bone levels on radiographs.",
    questions: [
      { prompt: "Which measurement is especially useful in periodontal assessment?", options: ["Pocket probing depth", "Hand span", "Visual acuity", "Shoe size"], correct: 0, explanation: "Periodontal probing depth, clinical attachment level, bleeding on probing, and other findings help assess periodontal status." },
      { prompt: "What is the best interpretation of radiographic bone loss?", options: ["It always gives the full diagnosis by itself", "It should be combined with clinical periodontal findings", "It is unrelated to periodontal health", "It removes the need for probing"], correct: 1, explanation: "Radiographs show hard-tissue changes but should be interpreted with clinical measurements and the patient's history." },
      { prompt: "Which factor in the history is relevant to periodontal risk?", options: ["Wearing glasses", "Preferring cold drinks", "Smoking history", "Being left-handed"], correct: 2, explanation: "Smoking is an important modifiable risk factor associated with periodontal disease and can affect treatment outcomes." }
    ]
  },
  {
    id: 5, title: "Tooth sensitivity", category: "Restorative dentistry", difficulty: "Beginner", duration: "3–4 min", tint: "blue", icon: "✳",
    summary: "Distinguish common sensitivity triggers and identify when further assessment is needed.",
    objectives: ["Identify typical sensitivity triggers", "Avoid assuming one cause from one symptom", "Recognize the value of a dental assessment"],
    patient: "A 25-year-old patient reports brief sensitivity when having cold drinks and when brushing.",
    history: "The patient recently changed to a firm-bristled toothbrush and brushes with substantial pressure.",
    findings: "No diagnosis has been established. The symptom description alone is not enough to determine the cause.",
    questions: [
      { prompt: "What is the most responsible interpretation of this symptom?", options: ["It confirms one specific disease", "It may have several causes and needs assessment", "It always means the tooth needs extraction", "It never requires attention"], correct: 1, explanation: "Sensitivity may be associated with exposed dentin, caries, cracks, restoration issues, or other causes. Assessment helps distinguish them." },
      { prompt: "Which habit could contribute to tooth surface wear or gum recession over time?", options: ["Using a soft brush gently", "Regular professional advice", "Brushing aggressively with a firm brush", "Drinking water"], correct: 2, explanation: "Aggressive brushing can contribute to abrasion and gingival recession. Technique and brush choice should be discussed with a dental professional." },
      { prompt: "What should the patient do if sensitivity persists?", options: ["Seek a dental assessment", "Start leftover antibiotics", "Ignore worsening symptoms", "Stop all oral hygiene"], correct: 0, explanation: "Persistent, worsening, or unexplained sensitivity should be assessed by a qualified dental professional." }
    ]
  },
  {
    id: 6, title: "Oral mucosal changes", category: "Oral medicine", difficulty: "Advanced", duration: "5–7 min", tint: "purple", icon: "◇",
    summary: "Consider why persistent oral mucosal changes need a structured history and examination.",
    objectives: ["Describe a lesion systematically", "Identify relevant history questions", "Recognize when referral or review is needed"],
    patient: "A 40-year-old patient notices a patch on the inside of the cheek that has not resolved.",
    history: "The duration and recent changes need clarification. The patient has not previously had this patch examined.",
    findings: "The scenario intentionally provides limited information: appearance, duration, risk factors, and examination findings still need to be documented.",
    questions: [
      { prompt: "Which description is most useful when documenting an oral lesion?", options: ["Only whether it looks unusual", "Site, size, color, surface, duration, and symptoms", "Only the patient's age", "Only whether it hurts today"], correct: 1, explanation: "Structured documentation includes location, dimensions, appearance, duration, symptoms, and relevant associated findings." },
      { prompt: "What is the safest approach to a persistent unexplained oral patch?", options: ["Assume it is harmless", "Try to diagnose from color alone", "Arrange timely assessment by a qualified dental professional", "Ignore it unless it hurts"], correct: 2, explanation: "Persistent unexplained oral lesions should be assessed promptly. A description alone cannot establish a diagnosis." },
      { prompt: "Why is a detailed history important?", options: ["It can clarify duration, change, symptoms, and risk factors", "It replaces all examination", "It guarantees a diagnosis without tests", "It is only relevant for children"], correct: 0, explanation: "History adds context and helps guide examination, differential diagnosis, and decisions about review or referral." }
    ]
  }
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function updateDashboardStats() {
  const lessons = readStore(LESSON_KEY, []);
  const savedCases = readStore(BOOKMARK_KEY, []);
  const progress = loadCaseProgress();
  const completedCases = Object.values(progress).filter(x => x && Array.isArray(x.attempts) && x.attempts.length).length;
  const set = (id, value, unit) => { const el = document.getElementById(id); if (el) el.innerHTML = `${String(value).padStart(2,"0")} <span class="stat-unit">${unit}</span>`; };
  set("statCourses", 3, "courses"); set("statLessons", lessons.length, "lessons"); set("statCases", completedCases, "cases"); set("statBookmarks", savedCases.length, "saved");
}

function getStudentName(email) {
  const username = email.split("@")[0];
  return username.replace(/[._-]+/g, " ").replace(/\d+/g, "").trim().split(" ").filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "Student";
}

function openDashboard(email) {
  const name = getStudentName(email);
  const firstName = name.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();
  document.getElementById("sidebarName").textContent = name;
  document.getElementById("sidebarAvatar").textContent = initial;
  document.getElementById("topAvatar").textContent = initial;
  document.getElementById("welcomeHeading").innerHTML = `Let's make today <span>count.</span>`;
  loginScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date());
  updateDashboardStats();
  showPage("Dashboard");
}

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email || !passwordInput.value) {
    loginMessage.textContent = "Please enter your email and password.";
    return;
  }
  if (!emailInput.validity.valid) {
    loginMessage.textContent = "Please enter a valid email address.";
    return;
  }
  loginMessage.textContent = "";
  openDashboard(email);
});

togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";
  togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

function logout() {
  loginForm.reset();
  loginMessage.textContent = "";
  passwordInput.type = "password";
  togglePassword.textContent = "Show";
  appShell.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  showToast("You have logged out.");
}
logoutButton.addEventListener("click", logout);

function showPage(page) {
  document.getElementById("currentPage").textContent = page;
  document.querySelectorAll(".nav-link[data-page]").forEach(button => button.classList.toggle("active", button.dataset.page === page));
  const isDashboard = page === "Dashboard";
  const isCaseLibrary = page === "Case Library";
  const isProgress = page === "My Progress";
  dashboardPage.classList.toggle("hidden", !isDashboard);
  caseLibraryPage.classList.toggle("hidden", !isCaseLibrary);
  myProgressPage.classList.toggle("hidden", !isProgress);
  modulePage.classList.toggle("hidden", isDashboard || isCaseLibrary || isProgress);
  if (isCaseLibrary) renderCaseLibrary();
  else if (isProgress) renderMyProgress();
  else if (!isDashboard) renderModule(page);
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    const page = button.dataset.page;
    if (page) showPage(page);
  });
});

document.querySelectorAll("[data-course]").forEach(button => {
  button.addEventListener("click", () => { showPage("My Learning"); renderLearningCourse(button.dataset.course); });
});

document.getElementById("notificationButton").addEventListener("click", () => showToast("You're all caught up! No new notifications."));
function showAccountOptions() { showToast("To leave your workspace, select Log out in the sidebar."); }
document.getElementById("profileMenu").addEventListener("click", showAccountOptions);
document.getElementById("topAvatar").addEventListener("click", showAccountOptions);

document.querySelectorAll("[data-answer]").forEach(button => {
  button.addEventListener("click", () => {
    const options = document.querySelectorAll("[data-answer]");
    options.forEach(option => { option.disabled = true; });
    const feedback = document.getElementById("challengeFeedback");
    if (button.dataset.answer === "A") {
      button.classList.add("correct");
      feedback.textContent = "Correct! Enamel is the hard outermost layer of a tooth.";
    } else {
      button.classList.add("incorrect");
      document.querySelector('[data-answer="A"]').classList.add("correct");
      feedback.textContent = "Not quite. Enamel forms the tooth's outermost layer.";
    }
  });
});

function loadCaseProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch { return {}; }
}

function saveCaseProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(caseProgress)); }
  catch { showToast("Progress could not be saved in this browser session."); }
}

function renderMyProgress() {
  const completed = Object.values(caseProgress).filter(entry => entry && Array.isArray(entry.attempts) && entry.attempts.length);
  const attempts = completed.flatMap(entry => entry.attempts);
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const average = totalQuestions ? Math.round(totalCorrect / totalQuestions * 100) : 0;
  const rows = completed.map(entry => {
    const item = caseData.find(c => c.id === Number(entry.caseId));
    if (!item) return "";
    const latest = entry.attempts[entry.attempts.length - 1];
    return `<article class="progress-case-row"><div class="progress-case-icon case-tint-${item.tint}">${item.icon}</div><div class="progress-case-info"><h3>${escapeHTML(item.title)}</h3><p>${entry.attempts.length} attempt${entry.attempts.length === 1 ? "" : "s"} · Last completed ${new Date(latest.completedAt).toLocaleDateString()}</p><div class="progress-mini-track"><span style="width:${latest.percentage}%"></span></div></div><div class="progress-case-score"><strong>${latest.percentage}%</strong><span>${latest.score}/${latest.total} correct</span><button class="text-button" data-progress-review="${item.id}">Review case →</button></div></article>`;
  }).join("");
  myProgressContent.innerHTML = `<div class="case-library-intro"><div><span class="eyebrow">YOUR LEARNING JOURNEY</span><h1>My Progress<span>.</span></h1><p>Track completed cases, revisit scores, and see how your clinical reasoning practice is developing.</p></div><div class="case-library-stat"><strong>${completed.length.toString().padStart(2, "0")}</strong><span>CASES COMPLETED</span></div></div>
    <div class="progress-summary-grid"><article class="progress-summary-card"><span>CASES COMPLETED</span><strong>${completed.length}<small> / ${caseData.length}</small></strong><p>Unique cases attempted</p></article><article class="progress-summary-card"><span>AVERAGE ACCURACY</span><strong>${average}%</strong><p>Across all saved attempts</p></article><article class="progress-summary-card"><span>TOTAL ATTEMPTS</span><strong>${attempts.length}</strong><p>Completed case sessions</p></article></div>
    <section class="progress-history-panel"><div class="progress-history-heading"><div><h2>Completed cases</h2><p>Your latest score is shown for each case.</p></div><button class="secondary-button" id="progressToLibrary">Explore Case Library</button></div>
    ${completed.length ? `<div class="progress-case-list">${rows}</div>` : `<div class="case-empty"><span>↗</span><h3>Your progress starts here</h3><p>Complete a case to see your scores and review your previous attempts here.</p><button class="primary-button" id="progressToLibraryEmpty">Browse cases →</button></div>`}</section>
    ${attempts.length ? `<section class="progress-history-panel attempt-history"><div class="progress-history-heading"><div><h2>Recent attempts</h2><p>Most recent completions first.</p></div></div><div class="attempt-table-wrap"><table class="attempt-table"><thead><tr><th>Case</th><th>Date</th><th>Score</th><th>Result</th></tr></thead><tbody>${completed.flatMap(entry => { const item = caseData.find(c => c.id === Number(entry.caseId)); return item ? entry.attempts.map(a => ({title:item.title, ...a})): []; }).sort((a,b) => new Date(b.completedAt)-new Date(a.completedAt)).slice(0,12).map(a => `<tr><td>${escapeHTML(a.title)}</td><td>${new Date(a.completedAt).toLocaleDateString()}</td><td>${a.score}/${a.total} (${a.percentage}%)</td><td><span class="difficulty-pill ${a.percentage >= 67 ? "difficulty-beginner" : "difficulty-advanced"}">${a.percentage >= 67 ? "Completed" : "Keep practising"}</span></td></tr>`).join("")}</tbody></table></div></section>` : ""}`;
  ["progressToLibrary", "progressToLibraryEmpty"].forEach(id => { const btn = document.getElementById(id); if (btn) btn.addEventListener("click", () => showPage("Case Library")); });
  document.querySelectorAll("[data-progress-review]").forEach(btn => btn.addEventListener("click", () => openCase(Number(btn.dataset.progressReview))));
}

function caseCardMarkup(item) {
  const tintClass = `case-tint-${item.tint}`;
  return `<article class="case-library-card">
    <div class="case-card-art ${tintClass}"><span class="case-art-eyebrow">CLINICAL CASE / ${String(item.id).padStart(2, "0")}</span><span class="case-art-symbol">${item.icon}</span><span class="case-art-foot">DENTALHUB CASE FILE</span></div>
    <div class="case-card-body"><div class="case-card-meta"><span class="case-category-pill">${item.category}</span><span class="case-time">◷ ${item.duration}</span></div>
      <h3>${item.title}</h3><p>${item.summary}</p>
      <div class="case-card-bottom"><span class="difficulty-pill difficulty-${item.difficulty.toLowerCase()}">${item.difficulty}</span><div class="module-actions"><button class="secondary-button bookmark-toggle" data-bookmark="${item.id}">${bookmarks.includes(item.id) ? "★ Saved" : "☆ Save"}</button><button class="case-open-button" data-open-case="${item.id}">Explore case <span>→</span></button></div></div>
    </div>
  </article>`;
}

function renderCaseLibrary() {
  const filtered = caseData.filter(item => {
    const searchText = `${item.title} ${item.category} ${item.summary} ${item.difficulty}`.toLowerCase();
    const searchMatch = searchText.includes(libraryFilters.search.toLowerCase());
    const categoryMatch = libraryFilters.category === "All cases" || item.category === libraryFilters.category;
    const difficultyMatch = libraryFilters.difficulty === "All levels" || item.difficulty === libraryFilters.difficulty;
    return searchMatch && categoryMatch && difficultyMatch;
  });
  caseLibraryContent.innerHTML = `
    <div class="case-library-intro"><div><span class="eyebrow">LEARN THROUGH CLINICAL REASONING</span><h1>Case Library<span>.</span></h1><p>Work through realistic teaching scenarios, test your thinking, and learn from each explanation.</p></div><div class="case-library-stat"><strong>${caseData.length.toString().padStart(2, "0")}</strong><span>LEARNING CASES</span></div></div>
    <section class="case-library-banner"><div><span class="case-banner-label">YOUR NEXT STEP</span><h2>Think like a clinician.</h2><p>Review the patient story, study the findings, and choose the best answer. Each case includes explanations to support your learning.</p></div><div class="case-banner-mark" aria-hidden="true">✳</div></section>
    <div class="case-library-toolbar"><div class="case-search-wrap"><span>⌕</span><input id="caseSearch" type="search" value="${escapeHTML(libraryFilters.search)}" placeholder="Search cases, topics, or categories" aria-label="Search cases"></div>
      <label class="case-filter-label">CATEGORY<select id="caseCategory">${["All cases", ...new Set(caseData.map(item => item.category))].map(v => `<option ${libraryFilters.category === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <label class="case-filter-label">DIFFICULTY<select id="caseDifficulty">${["All levels", "Beginner", "Intermediate", "Advanced"].map(v => `<option ${libraryFilters.difficulty === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
    </div>
    <div class="case-results-heading"><div><h2>Explore cases</h2><p>${filtered.length} ${filtered.length === 1 ? "case" : "cases"} match your filters</p></div><span class="case-results-note">Educational scenarios · Frontend demo</span></div>
    <div class="case-library-grid">${filtered.map(caseCardMarkup).join("")}</div>
    ${filtered.length ? "" : `<div class="case-empty"><span>⌕</span><h3>No cases found</h3><p>Try a different search term or reset your filters.</p><button class="primary-button" id="resetCaseFilters">Reset filters</button></div>`}
    <p class="case-disclaimer">These are illustrative educational scenarios, not real patient records or clinical advice. Clinical decisions should be made by qualified professionals using a complete assessment.</p>`;

  document.getElementById("caseSearch").addEventListener("input", event => { libraryFilters.search = event.target.value; renderCaseLibrary(); const input = document.getElementById("caseSearch"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
  document.getElementById("caseCategory").addEventListener("change", event => { libraryFilters.category = event.target.value; renderCaseLibrary(); });
  document.getElementById("caseDifficulty").addEventListener("change", event => { libraryFilters.difficulty = event.target.value; renderCaseLibrary(); });
  document.querySelectorAll("[data-open-case]").forEach(button => button.addEventListener("click", () => openCase(Number(button.dataset.openCase))));
  document.querySelectorAll("[data-bookmark]").forEach(button => button.addEventListener("click", () => toggleBookmark(Number(button.dataset.bookmark))));
  const reset = document.getElementById("resetCaseFilters");
  if (reset) reset.addEventListener("click", () => { libraryFilters = { search: "", category: "All cases", difficulty: "All levels" }; renderCaseLibrary(); });
}


function readStore(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value === null ? fallback : value; } catch { return fallback; } }
function writeStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { showToast("Your browser could not save this change."); return false; } }
function toggleBookmark(id) { bookmarks = bookmarks.includes(id) ? bookmarks.filter(x => x !== id) : [...bookmarks, id]; writeStore(BOOKMARK_KEY, bookmarks); updateDashboardStats(); if (document.getElementById("currentPage").textContent === "Bookmarks") renderBookmarks(); else renderCaseLibrary(); }
function moduleHeader(kicker, title, description) { return `<div class="module-hero"><div><span class="eyebrow">${kicker}</span><h1>${title}<span>.</span></h1><p>${description}</p></div></div>`; }
function renderModule(page) {
  if (page === "My Learning") renderLearning();
  else if (page === "X-Ray Trainer") renderXrayTrainer();
  else if (page === "AI Study Tools") renderStudyTools();
  else if (page === "Bookmarks") renderBookmarks();
  else if (page === "Study Notes") renderNotes();
  else if (page === "Daily Challenge") renderDailyChallenge();
  else if (page === "Settings") renderSettings();
  else moduleContent.innerHTML = `${moduleHeader("WORKSPACE", page, "This workspace is ready for your learning activity.")}<div class="module-panel"><p>Choose a module from the sidebar to continue.</p></div>`;
}

const courses = [
 {name:"Dental Anatomy",topic:"Foundations",description:"Explore tooth structure, form, and function.",lessons:["Tooth structure and tissues","Tooth surfaces and terminology","Types of teeth and dentition","Tooth morphology","Functions of the oral cavity"]},
 {name:"Dental Radiology",topic:"Clinical skills",description:"Build a foundation in dental imaging and interpretation.",lessons:["Introduction to dental radiographs","Periapical and bitewing views","Radiographic anatomy","Common radiographic findings","Image quality and limitations"]},
 {name:"Oral Health Basics",topic:"Core knowledge",description:"Understand prevention, hygiene, and healthy habits.",lessons:["Oral hygiene fundamentals","Plaque and biofilm","Caries prevention","Diet and oral health","Patient education basics"]}
];
function renderLearning() {
 const total=courses.reduce((n,c)=>n+c.lessons.length,0), done=completedLessons.length;
 moduleContent.innerHTML=moduleHeader("YOUR CURRICULUM","My Learning","Continue structured dental learning. Open a course to view lessons and mark each lesson complete.")+`<div class="progress-summary-grid"><article class="progress-summary-card"><span>COURSES</span><strong>03</strong><p>Available learning paths</p></article><article class="progress-summary-card"><span>LESSONS COMPLETED</span><strong>${done}</strong><p>Out of ${total} lessons</p></article><article class="progress-summary-card"><span>OVERALL COMPLETION</span><strong>${Math.round(done/total*100)}%</strong><p>Saved on this device</p></article></div><div class="module-grid">${courses.map(c=>{let count=c.lessons.filter(l=>completedLessons.includes(c.name+"::"+l)).length;return `<article class="module-card"><span class="eyebrow">${c.topic.toUpperCase()}</span><h3>${c.name}</h3><p>${c.description}</p><div class="progress-mini-track"><span style="width:${count/c.lessons.length*100}%"></span></div><p>${count} of ${c.lessons.length} lessons complete</p><button class="primary-button" data-open-course="${c.name}">Open course →</button></article>`}).join("")}</div>`;
 moduleContent.querySelectorAll("[data-open-course]").forEach(b=>b.addEventListener("click",()=>renderLearningCourse(b.dataset.openCourse)));
}
const lessonReadings = {
 "Tooth structure and tissues":"A tooth has four principal tissues: enamel, dentin, cementum and pulp. Enamel covers the crown and is highly mineralized. Dentin forms most of the tooth, cementum covers the root, and the pulp contains connective tissue, nerves and blood vessels.",
 "Tooth surfaces and terminology":"Dental surfaces are named by their relationship to the face, tongue, adjacent teeth and chewing surface. Common terms include mesial, distal, buccal or facial, lingual or palatal, occlusal and incisal. Consistent terminology helps clinicians describe findings clearly.",
 "Types of teeth and dentition":"The permanent dentition typically includes incisors, canines, premolars and molars. Each group has a characteristic shape related to its function. Primary and permanent dentitions differ in tooth number, morphology and eruption sequence.",
 "Tooth morphology":"Tooth morphology describes the external form and anatomical features of teeth. Crown shape, cusps, ridges, grooves and roots vary between tooth types. Learning these features supports identification and communication during examination.",
 "Functions of the oral cavity":"The oral cavity contributes to mastication, speech, taste, swallowing and the initial stages of digestion. Teeth, tongue, salivary glands, mucosa and supporting structures work together to perform these functions.",
 "Introduction to dental radiographs":"Dental radiographs provide two-dimensional information about teeth and surrounding structures. Common intraoral views include periapical and bitewing images. Images complement, rather than replace, history and clinical examination.",
 "Periapical and bitewing views":"A periapical view is designed to show the tooth from crown to root apex and surrounding periapical tissues. Bitewing views commonly show the crowns of upper and lower posterior teeth and their interproximal areas. View selection depends on the clinical question.",
 "Radiographic anatomy":"Radiographic anatomy includes the normal appearance of teeth, periodontal ligament space, lamina dura, alveolar crest and surrounding bone. Familiarity with normal anatomy helps learners recognize variations and identify findings that require further assessment.",
 "Common radiographic findings":"Radiographs may show restorations, caries-related radiolucencies, changes around root apices and alterations in bone levels. A radiographic appearance is not a diagnosis by itself; interpretation requires clinical context and appropriate tests.",
 "Image quality and limitations":"Image quality is affected by positioning, exposure, movement, contrast and coverage. Dental radiographs are two-dimensional, so structures may overlap. Poor-quality images can obscure details and may need to be repeated only when clinically justified.",
 "Oral hygiene fundamentals":"Daily plaque control commonly includes effective toothbrushing and cleaning between teeth. Technique, consistency and suitable tools matter. Individual advice should account for a person's needs and should be discussed with a dental professional.",
 "Plaque and biofilm":"Dental plaque is a structured microbial biofilm that forms on tooth surfaces. If it is not regularly disrupted, it can contribute to caries and gingival inflammation. Mechanical cleaning is central to controlling plaque accumulation.",
 "Caries prevention":"Caries prevention involves reducing frequent free-sugar exposure, using fluoride appropriately, maintaining plaque control and attending risk-based dental reviews. Prevention plans should be tailored to individual risk and professional guidance.",
 "Diet and oral health":"The frequency of fermentable carbohydrate exposure can influence the balance between demineralization and remineralization. Water and balanced dietary patterns support general health. Dental dietary advice should be practical and individualized.",
 "Patient education basics":"Effective patient education uses clear language, checks understanding and agrees on realistic next steps. Open questions and teach-back can help identify misunderstandings. Advice should be respectful and adapted to the person's circumstances."
};
function renderLearningCourse(name) {
 const c=courses.find(x=>x.name===name); if(!c){renderLearning();return;}
 moduleContent.innerHTML=`<button class="case-back-button" id="backCourses">← All courses</button>${moduleHeader("COURSE CONTENT",c.name,c.description)}<div class="module-panel"><h2>Lessons</h2><div class="module-list">${c.lessons.map((l,i)=>{let key=c.name+"::"+l,done=completedLessons.includes(key);return `<div class="module-list-item"><div><h3>${String(i+1).padStart(2,"0")} · ${l}</h3><p>${done?"Completed":"Short reading lesson · Open to study"}</p></div><button class="primary-button" data-open-lesson="${i}">${done?"Review lesson":"Open lesson"} →</button></div>`}).join("")}</div></div>`;
 document.getElementById("backCourses").addEventListener("click",renderLearning);
 moduleContent.querySelectorAll("[data-open-lesson]").forEach(b=>b.addEventListener("click",()=>renderLesson(name,Number(b.dataset.openLesson))));
}
function renderLesson(courseName,index){
 const c=courses.find(x=>x.name===courseName);if(!c||!c.lessons[index])return;
 const lesson=c.lessons[index],key=courseName+"::"+lesson,done=completedLessons.includes(key);
 moduleContent.innerHTML=`<button class="case-back-button" id="backToCourse">← Back to ${escapeHTML(courseName)}</button>${moduleHeader("LESSON "+String(index+1).padStart(2,"0"),lesson,courseName)}<article class="module-panel"><h2>Key concepts</h2><p>${escapeHTML(lessonReadings[lesson]||"Review this topic and note the key terms relevant to your course.")}</p><div class="module-output"><strong>Quick reflection</strong><p>Write down one important point from this lesson in your Study Notes before moving on.</p><button class="secondary-button" id="openNotesFromLesson">Open Study Notes →</button></div><div class="module-actions" style="margin-top:18px"><button class="primary-button" id="markLessonDone">${done?"Completed ✓":"Mark lesson complete"}</button>${index<c.lessons.length-1?`<button class="secondary-button" id="nextLesson">Next lesson →</button>`:""}</div></article>`;
 document.getElementById("backToCourse").addEventListener("click",()=>renderLearningCourse(courseName));
 document.getElementById("openNotesFromLesson").addEventListener("click",()=>showPage("Study Notes"));
 document.getElementById("markLessonDone").addEventListener("click",()=>{if(!completedLessons.includes(key))completedLessons.push(key);writeStore(LESSON_KEY,completedLessons);updateDashboardStats();renderLesson(courseName,index);showToast("Lesson completion saved.");});
 const next=document.getElementById("nextLesson");if(next)next.addEventListener("click",()=>renderLesson(courseName,index+1));
}

const xrayQuestions=[
 {q:"A periapical image shows a radiolucent area near the root apex. What is the safest interpretation?",opts:["It requires correlation with clinical tests and history","It proves one specific diagnosis","It is always normal","No further assessment is needed"],a:0,why:"A radiographic appearance must be correlated with symptoms, examination and appropriate tests."},
 {q:"Which view is commonly used to examine the crowns of posterior teeth and the interproximal areas?",opts:["Bitewing","Occlusal only","Panoramic only","Lateral cephalogram"],a:0,why:"Bitewing radiographs are commonly used to assess posterior crowns and interproximal regions."},
 {q:"What should be checked before interpreting an image?",opts:["Image quality and positioning","Only the file name","The patient's clothing","The screen brightness alone"],a:0,why:"Positioning, exposure, coverage and image quality affect interpretation."},
 {q:"A radiograph is a two-dimensional representation of anatomy. What does this mean?",opts:["Structures can overlap","It shows every structure in 3D","It replaces clinical examination","It always identifies symptoms"],a:0,why:"Anatomical structures may be superimposed in a two-dimensional image."}
];
function renderXrayTrainer() {
 activeQuiz={items:xrayQuestions,idx:0,answers:[]};
 moduleContent.innerHTML=moduleHeader("RADIOGRAPHIC PRACTICE","X-Ray Trainer","Practice foundational radiographic reasoning with short image-interpretation knowledge checks.")+`<div class="module-panel"><div class="module-hero"><div><span class="eyebrow">TRAINING SET · 4 QUESTIONS</span><h2>Read the image description carefully.</h2><p>This version uses written radiographic scenarios. It does not diagnose real X-rays.</p></div><span class="difficulty-pill difficulty-intermediate">Practice</span></div><div id="xrayQuestion"></div></div>`;
 renderXrayQuestion();
}
function renderXrayQuestion(){const q=activeQuiz.items[activeQuiz.idx];const answered=activeQuiz.answers[activeQuiz.idx]!==undefined;const chosen=activeQuiz.answers[activeQuiz.idx];document.getElementById("xrayQuestion").innerHTML=`<p class="module-muted">QUESTION ${activeQuiz.idx+1} OF ${activeQuiz.items.length}</p><h2>${q.q}</h2>${q.opts.map((o,i)=>`<button class="module-option ${answered&&i===q.a?"correct":""} ${answered&&i===chosen&&chosen!==q.a?"incorrect":""}" data-xray-answer="${i}" ${answered?"disabled":""}>${String.fromCharCode(65+i)}. ${o}</button>`).join("")}${answered?`<div class="module-output"><strong>${chosen===q.a?"Correct":"Review this concept"}</strong><p>${q.why}</p><button class="primary-button" id="xrayNext">${activeQuiz.idx===activeQuiz.items.length-1?"Finish practice":"Next question →"}</button></div>`:""}`;document.querySelectorAll("[data-xray-answer]").forEach(b=>b.addEventListener("click",()=>{activeQuiz.answers[activeQuiz.idx]=Number(b.dataset.xrayAnswer);renderXrayQuestion();}));const next=document.getElementById("xrayNext");if(next)next.addEventListener("click",()=>{if(activeQuiz.idx<activeQuiz.items.length-1){activeQuiz.idx++;renderXrayQuestion();}else{let score=activeQuiz.answers.filter((a,i)=>a===activeQuiz.items[i].a).length;moduleContent.innerHTML=moduleHeader("PRACTICE COMPLETE","Your X-Ray Trainer result","Review your performance and practise again when ready.")+`<div class="module-panel"><h2>${score} / ${activeQuiz.items.length} correct (${Math.round(score/activeQuiz.items.length*100)}%)</h2><p>${score===4?"Excellent work.":"Keep practising the image interpretation fundamentals."}</p><button class="primary-button" id="xrayAgain">Try again</button></div>`;document.getElementById("xrayAgain").addEventListener("click",renderXrayTrainer);}});}

function renderStudyTools(){moduleContent.innerHTML=moduleHeader("SMART REVISION WORKSPACE","AI Study Tools","Turn your own study text into a concise revision outline and flashcards. This standalone build processes pasted or uploaded text locally; it is not connected to a live AI service.")+`<div class="module-panel"><h2>Bring your study material</h2><div class="module-form"><label for="studyUpload">Upload a plain-text file (.txt)</label><input id="studyUpload" type="file" accept=".txt,text/plain"><label for="studySource">Or paste your notes / learning material</label><textarea id="studySource" placeholder="Paste your dental study material here…"></textarea><div class="module-actions"><button class="primary-button" id="generateStudy">Generate revision tools →</button><button class="secondary-button" id="clearStudy">Clear</button></div></div><div id="studyOutput"></div></div>`;
 document.getElementById("studyUpload").addEventListener("change",async e=>{const file=e.target.files[0];if(file){document.getElementById("studySource").value=await file.text();}});
 document.getElementById("clearStudy").addEventListener("click",()=>{document.getElementById("studySource").value="";document.getElementById("studyOutput").innerHTML="";document.getElementById("studyUpload").value="";});
 document.getElementById("generateStudy").addEventListener("click",()=>{const raw=document.getElementById("studySource").value.trim();if(raw.length<80){showToast("Add at least a few sentences of study material first.");return;}const sentences=raw.split(/(?<=[.!?])\s+/).filter(x=>x.length>25);const summary=sentences.slice(0,Math.min(5,sentences.length));const words=(raw.toLowerCase().match(/[a-z][a-z-]{5,}/g)||[]);const freq={};words.forEach(w=>freq[w]=(freq[w]||0)+1);const terms=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8).map(x=>x[0]);const cards=summary.slice(0,5);document.getElementById("studyOutput").innerHTML=`<div class="module-output"><h2>Revision outline</h2><ul>${summary.map(x=>`<li>${escapeHTML(x)}</li>`).join("")}</ul><h2>Key terms</h2><p>${terms.map(escapeHTML).join(" · ")||"No key terms detected"}</p><h2>Flashcards</h2>${cards.map((x,i)=>`<details><summary>Card ${i+1}: What should you remember?</summary><p>${escapeHTML(x)}</p></details>`).join("")}<p class="module-muted">Generated locally from your text using simple text-processing rules. Verify all study content against trusted course materials.</p></div>`;});
}
function renderBookmarks(){const saved=caseData.filter(c=>bookmarks.includes(c.id));moduleContent.innerHTML=moduleHeader("YOUR PERSONAL COLLECTION","Bookmarks","Keep useful clinical cases close and return to them whenever you need revision.")+`<div class="module-panel"><h2>Saved cases (${saved.length})</h2>${saved.length?`<div class="module-list">${saved.map(c=>`<div class="module-list-item"><div><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.category)} · ${c.difficulty} · ${c.duration}</p></div><div class="module-actions"><button class="secondary-button" data-unbookmark="${c.id}">Remove</button><button class="primary-button" data-bookmark-open="${c.id}">Open case</button></div></div>`).join("")}</div>`:`<div class="case-empty"><span>☆</span><h3>No saved cases yet</h3><p>Use the Save button on any Case Library card to add it here.</p><button class="primary-button" id="goCaseLibrary">Browse cases →</button></div>`}</div>`;
 const go=document.getElementById("goCaseLibrary");if(go)go.addEventListener("click",()=>showPage("Case Library"));moduleContent.querySelectorAll("[data-unbookmark]").forEach(b=>b.addEventListener("click",()=>toggleBookmark(Number(b.dataset.unbookmark))));moduleContent.querySelectorAll("[data-bookmark-open]").forEach(b=>b.addEventListener("click",()=>{const id=Number(b.dataset.bookmarkOpen);showPage("Case Library");openCase(id);}));}
function renderNotes(){moduleContent.innerHTML=moduleHeader("PERSONAL REVISION SPACE","Study Notes","Create, edit and delete your own study notes. Notes are saved in this browser on this device.")+`<div class="module-panel"><h2 id="noteFormTitle">Create a note</h2><div class="module-form"><input id="noteTitle" placeholder="Note title" maxlength="90"><textarea id="noteBody" placeholder="Write your key points, questions or reminders…"></textarea><div class="module-actions"><button class="primary-button" id="saveNote">Save note</button><button class="secondary-button" id="cancelNote" hidden>Cancel edit</button></div></div></div><div class="module-panel"><h2>Your notes (${notes.length})</h2><div class="module-list">${notes.length?notes.slice().reverse().map(n=>`<div class="module-list-item"><div><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.body).replace(/\n/g,"<br>")}</p><span class="module-muted">Updated ${new Date(n.updated).toLocaleString()}</span></div><div class="module-actions"><button class="secondary-button" data-edit-note="${n.id}">Edit</button><button class="secondary-button" data-delete-note="${n.id}">Delete</button></div></div>`).join(""):`<p class="module-muted">No notes yet. Create your first note above.</p>`}</div></div>`;
 let editing=null;const title=document.getElementById("noteTitle"),body=document.getElementById("noteBody"),save=document.getElementById("saveNote"),cancel=document.getElementById("cancelNote");save.addEventListener("click",()=>{if(!title.value.trim()||!body.value.trim()){showToast("Enter both a title and note content.");return;}const now=new Date().toISOString();if(editing){const n=notes.find(x=>x.id===editing);n.title=title.value.trim();n.body=body.value.trim();n.updated=now;}else notes.push({id:Date.now(),title:title.value.trim(),body:body.value.trim(),updated:now});writeStore(NOTES_KEY,notes);renderNotes();showToast("Note saved.");});cancel.addEventListener("click",renderNotes);moduleContent.querySelectorAll("[data-edit-note]").forEach(b=>b.addEventListener("click",()=>{const n=notes.find(x=>x.id===Number(b.dataset.editNote));if(!n)return;editing=n.id;title.value=n.title;body.value=n.body;document.getElementById("noteFormTitle").textContent="Edit note";save.textContent="Update note";cancel.hidden=false;title.focus();}));moduleContent.querySelectorAll("[data-delete-note]").forEach(b=>b.addEventListener("click",()=>{notes=notes.filter(n=>n.id!==Number(b.dataset.deleteNote));writeStore(NOTES_KEY,notes);renderNotes();showToast("Note deleted.");}));}
const dailyQuestions=[{q:"Which tissue forms the hard outer covering of the crown?",o:["Enamel","Dentin","Pulp"],a:0,e:"Enamel is the highly mineralized outer covering of the anatomical crown."},{q:"Which tooth type is primarily adapted for cutting?",o:["Incisor","Molar","Premolar"],a:0,e:"Incisors have cutting edges and are adapted for cutting food."},{q:"What does a bitewing radiograph commonly help assess?",o:["Interproximal caries","Jaw joint movement","Tongue function"],a:0,e:"Bitewings are commonly used to assess posterior crowns and interproximal areas."},{q:"Which structure contains the tooth's nerves and blood vessels?",o:["Pulp","Enamel","Cementum"],a:0,e:"The dental pulp contains connective tissue, nerves and blood vessels."},{q:"What is the term for inflammation of the gingiva?",o:["Gingivitis","Pulpitis","Glossitis"],a:0,e:"Gingivitis refers to inflammation of the gingiva."}];
function renderDailyChallenge(){const today=new Date().toISOString().slice(0,10);if(challengeState.date!==today)challengeState={date:today,index:0,answers:[]};const i=challengeState.index||0;const q=dailyQuestions[i];const answered=challengeState.answers[i]!==undefined;moduleContent.innerHTML=moduleHeader("DAILY KNOWLEDGE CHECK","Daily Challenge","Complete a short daily dental knowledge check. Your answers are saved locally for today.")+`<div class="module-panel"><div class="module-hero"><div><span class="eyebrow">QUESTION ${i+1} OF ${dailyQuestions.length}</span><h2>${q.q}</h2><p>One question at a time · Instant feedback</p></div><span class="challenge-badge">DAILY</span></div>${q.o.map((o,n)=>`<button class="module-option ${answered&&n===q.a?"correct":""} ${answered&&n===challengeState.answers[i]&&n!==q.a?"incorrect":""}" data-daily-answer="${n}" ${answered?"disabled":""}>${String.fromCharCode(65+n)}. ${o}</button>`).join("")}${answered?`<div class="module-output"><strong>${challengeState.answers[i]===q.a?"Correct!":"Not quite."}</strong><p>${q.e}</p><button class="primary-button" id="dailyNext">${i===dailyQuestions.length-1?"Finish challenge":"Next question →"}</button></div>`:""}<p class="module-muted">${challengeState.answers.filter(x=>x!==undefined).length} of ${dailyQuestions.length} answered</p></div>`;moduleContent.querySelectorAll("[data-daily-answer]").forEach(b=>b.addEventListener("click",()=>{challengeState.answers[i]=Number(b.dataset.dailyAnswer);writeStore(CHALLENGE_KEY,challengeState);renderDailyChallenge();}));const next=document.getElementById("dailyNext");if(next)next.addEventListener("click",()=>{if(i<dailyQuestions.length-1){challengeState.index=i+1;writeStore(CHALLENGE_KEY,challengeState);renderDailyChallenge();}else{const score=challengeState.answers.reduce((n,a,j)=>n+(a===dailyQuestions[j].a?1:0),0);moduleContent.innerHTML=moduleHeader("CHALLENGE COMPLETE","Well done.","Today's challenge is complete. Come back tomorrow for a fresh reset.")+`<div class="module-panel"><h2>${score} / ${dailyQuestions.length} correct</h2><p>Your daily answers have been saved in this browser.</p><button class="primary-button" id="reviewDaily">Review answers</button></div>`;document.getElementById("reviewDaily").addEventListener("click",()=>{challengeState.index=0;renderDailyChallenge();});}});}
function renderSettings(){moduleContent.innerHTML=moduleHeader("PREFERENCES","Settings","Manage simple display and local learning preferences.")+`<div class="module-panel"><h2>Learning preferences</h2><div class="module-form"><label><input type="checkbox" id="settingHints" ${readStore("dentalhub_hints",true)?"checked":""}> Show hints during case questions</label><label for="settingName">Display name</label><input id="settingName" value="${escapeHTML(document.getElementById("sidebarName").textContent)}"><button class="primary-button" id="saveSettings">Save preferences</button></div><p class="module-muted">Preferences are stored locally in this browser. Account authentication is not connected in this demo.</p></div>`;document.getElementById("saveSettings").addEventListener("click",()=>{writeStore("dentalhub_hints",document.getElementById("settingHints").checked);const name=document.getElementById("settingName").value.trim();if(name){document.getElementById("sidebarName").textContent=name;document.getElementById("sidebarAvatar").textContent=name[0].toUpperCase();document.getElementById("topAvatar").textContent=name[0].toUpperCase();}showToast("Preferences saved.");});}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function openCase(id) {
  activeCase = caseData.find(item => item.id === id);
  if (!activeCase) return;
  currentQuestion = 0;
  selectedAnswers = [];
  hintVisible = false;
  activeAttemptId = null;
  renderCaseOverview();
  caseLibraryPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCaseOverview() {
  const item = activeCase;
  caseLibraryContent.innerHTML = `<button class="case-back-button" id="backToCases">← Back to Case Library</button>
    <div class="case-detail-heading"><div><span class="eyebrow">CASE ${String(item.id).padStart(2, "0")} / CLINICAL REASONING</span><h1>${item.title}</h1><p>${item.summary}</p></div><span class="difficulty-pill difficulty-${item.difficulty.toLowerCase()}">${item.difficulty}</span></div>
    <div class="case-detail-layout"><div class="case-main-column"><section class="case-detail-panel"><div class="case-panel-heading"><span class="case-panel-icon">▤</span><div><h2>Case overview</h2><p>Start by reviewing the learning goals.</p></div></div><p>${item.summary}</p><div class="case-objectives"><h3>Learning objectives</h3>${item.objectives.map((objective, index) => `<div class="case-objective"><span>${String(index + 1).padStart(2, "0")}</span>${objective}</div>`).join("")}</div></section>
    <section class="case-detail-panel"><div class="case-panel-heading"><span class="case-panel-icon">◷</span><div><h2>What to expect</h2><p>A short, self-paced case activity</p></div></div><div class="case-expect-grid"><div><span>ESTIMATED TIME</span><strong>${item.duration}</strong></div><div><span>QUESTIONS</span><strong>${item.questions.length} questions</strong></div><div><span>FORMAT</span><strong>Multiple choice</strong></div></div></section></div>
    <aside class="case-start-panel"><div class="case-start-art ${`case-tint-${item.tint}`}"><span>${item.icon}</span></div><span class="eyebrow">READY WHEN YOU ARE</span><h2>Let's work through it.</h2><p>Read the patient information and findings carefully. You'll get feedback after each answer.</p><button class="primary-button case-start-button" id="startCase">Start case <span>→</span></button><div class="case-start-note">✓ Your progress is tracked for this session</div></aside></div>
    <p class="case-disclaimer">Illustrative educational scenario only. Not a substitute for professional clinical assessment.</p>`;
  document.getElementById("backToCases").addEventListener("click", renderCaseLibrary);
  document.getElementById("startCase").addEventListener("click", () => { currentQuestion = -1; selectedAnswers = []; activeAttemptId = null; hintVisible = false; renderPatientBrief(); });
}

function renderPatientBrief() {
  const item = activeCase;
  caseLibraryContent.innerHTML = `<button class="case-back-button" id="backToOverview">← Back to case overview</button><div class="case-player-top"><div><span class="eyebrow">CASE ${String(item.id).padStart(2, "0")} / PATIENT BRIEF</span><h1>Review the patient story</h1><p>Take a moment to read the available information before answering.</p></div><span class="case-step-count">STEP 1 OF ${item.questions.length + 2}</span></div>
    <div class="case-progress-track"><span style="width:25%"></span></div><div class="patient-brief-grid"><div class="patient-story-card"><div class="patient-card-title"><span>01</span><div><h2>Presenting concern</h2><p>Patient history</p></div></div><p>${item.patient}</p><div class="patient-card-title second"><span>02</span><div><h2>Relevant history</h2><p>Background information</p></div></div><p>${item.history}</p></div>
    <div class="patient-findings-card"><div class="patient-card-title"><span>03</span><div><h2>Clinical findings</h2><p>Scenario notes</p></div></div><div class="finding-illustration"><div class="finding-cross">✳</div><span>CASE FINDINGS</span><small>EDUCATIONAL SUMMARY</small></div><p>${item.findings}</p><div class="finding-reminder">ⓘ Use the information provided. In practice, findings would be confirmed through a full assessment.</div></div></div>
    <div class="case-player-actions"><span>Read everything? Continue when you're ready.</span><button class="primary-button" id="beginQuestions">Answer questions <span>→</span></button></div>`;
  document.getElementById("backToOverview").addEventListener("click", renderCaseOverview);
  document.getElementById("beginQuestions").addEventListener("click", () => { currentQuestion = 0; renderQuestion(); });
}

function renderQuestion() {
  const item = activeCase;
  const question = item.questions[currentQuestion];
  const progress = 25 + Math.round((currentQuestion / item.questions.length) * 65);
  const existingAnswer = selectedAnswers[currentQuestion];
  const hasAnswered = existingAnswer !== undefined;
  const isCorrect = hasAnswered && existingAnswer === question.correct;
  const hint = question.hint || "Look for the option that best fits the history and clinical findings without making assumptions that the scenario cannot support.";
  caseLibraryContent.innerHTML = `<button class="case-back-button" id="quitQuestions">← Exit to case overview</button><div class="case-player-top"><div><span class="eyebrow">${escapeHTML(item.title.toUpperCase())}</span><h1>Think it through.</h1><p>Choose the best answer based on this teaching scenario.</p></div><span class="case-step-count">QUESTION ${currentQuestion + 1} OF ${item.questions.length}</span></div>
    <div class="case-progress-track"><span style="width:${progress}%"></span></div><section class="question-panel"><div class="question-panel-top"><span class="question-number">${String(currentQuestion + 1).padStart(2,"0")}</span><span class="question-type">KNOWLEDGE CHECK</span></div><h2>${escapeHTML(question.prompt)}</h2><div class="case-answer-list">${question.options.map((option, index) => `<button class="case-answer-option ${hasAnswered && index === question.correct ? "answer-correct" : ""} ${hasAnswered && index === existingAnswer && !isCorrect ? "answer-incorrect" : ""}" data-case-answer="${index}" ${hasAnswered ? "disabled" : ""}><span class="case-answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span><span class="case-answer-mark">${hasAnswered && index === question.correct ? "✓" : hasAnswered && index === existingAnswer ? "×" : ""}</span></button>`).join("")}</div>
    <div class="case-hint-area"><button class="text-button" id="toggleHint">${hintVisible ? "Hide hint ↑" : "Need a hint? Show hint →"}</button><p id="caseHint" class="case-hint ${hintVisible ? "" : "hidden"}">${escapeHTML(hint)}</p></div>
    <div class="case-answer-feedback ${hasAnswered ? (isCorrect ? "feedback-correct" : "feedback-incorrect") : "hidden"}" id="caseAnswerFeedback" role="status">${hasAnswered ? `<strong>${isCorrect ? "Correct — well done." : "Not quite. Review the explanation."}</strong><p>${escapeHTML(question.explanation)}</p>` : ""}</div>
    <div class="case-question-footer"><button class="secondary-button" id="previousQuestion" ${currentQuestion === 0 ? "disabled" : ""}>← Previous</button><span>${hasAnswered ? "Answer saved for this attempt." : "Select an answer to unlock the next step."}</span><button class="primary-button ${hasAnswered ? "" : "hidden"}" id="nextQuestion">${currentQuestion === item.questions.length - 1 ? "View results" : "Next question"} <span>→</span></button></div>
    <div class="question-jump-row"><span>JUMP TO</span>${item.questions.map((q,i) => `<button class="question-jump ${i === currentQuestion ? "current" : ""} ${selectedAnswers[i] !== undefined ? "answered" : ""}" data-question-jump="${i}" aria-label="Go to question ${i+1}">${i+1}</button>`).join("")}</div></section>`;
  document.getElementById("quitQuestions").addEventListener("click", renderCaseOverview);
  document.getElementById("toggleHint").addEventListener("click", () => { hintVisible = !hintVisible; renderQuestion(); });
  document.getElementById("previousQuestion").addEventListener("click", () => { if (currentQuestion > 0) { currentQuestion--; hintVisible = false; renderQuestion(); } });
  const next = document.getElementById("nextQuestion");
  if (next) next.addEventListener("click", () => { if (currentQuestion < item.questions.length - 1) { currentQuestion++; hintVisible = false; renderQuestion(); } else renderCaseResults(); });
  document.querySelectorAll("[data-question-jump]").forEach(button => button.addEventListener("click", () => { currentQuestion = Number(button.dataset.questionJump); hintVisible = false; renderQuestion(); }));
  document.querySelectorAll("[data-case-answer]").forEach(button => button.addEventListener("click", () => chooseCaseAnswer(Number(button.dataset.caseAnswer))));
}

function chooseCaseAnswer(answerIndex) {
  if (selectedAnswers[currentQuestion] !== undefined) return;
  selectedAnswers[currentQuestion] = answerIndex;
  renderQuestion();
}

function renderCaseResults() {
  const item = activeCase;
  const score = item.questions.reduce((total, question, index) => total + (selectedAnswers[index] === question.correct ? 1 : 0), 0);
  const percentage = Math.round((score / item.questions.length) * 100);
  const caseKey = String(item.id);
  if (!caseProgress[caseKey]) caseProgress[caseKey] = { caseId: item.id, attempts: [] };
  const attempts = caseProgress[caseKey].attempts;
  const lastAttempt = attempts[attempts.length - 1];
  if (!lastAttempt || lastAttempt.completedAt !== activeAttemptId) {
    activeAttemptId = new Date().toISOString();
    attempts.push({ score, total: item.questions.length, percentage, completedAt: activeAttemptId });
    caseProgress[caseKey].attempts = attempts.slice(-50);
    saveCaseProgress();
    updateDashboardStats();
  }
  caseLibraryContent.innerHTML = `<div class="case-results-page"><div class="results-symbol">${percentage >= 67 ? "✓" : "↗"}</div><span class="eyebrow">CASE COMPLETE</span><h1>${percentage >= 67 ? "Nice work." : "Good effort."}</h1><p class="results-subtitle">You've completed <strong>${item.title}</strong>. Review the answers below to reinforce your learning.</p><div class="results-score-card"><div><span>YOUR SCORE</span><strong>${score}<small> / ${item.questions.length}</small></strong></div><div class="results-score-ring" style="--score:${percentage}%"><span>${percentage}%</span></div></div><div class="results-review"><div class="results-review-heading"><h2>Answer review</h2><span>${score} correct · ${item.questions.length - score} to revisit</span></div>${item.questions.map((question, index) => { const correct = selectedAnswers[index] === question.correct; return `<article class="review-item"><div class="review-item-status ${correct ? "review-good" : "review-revisit"}">${correct ? "✓" : "↻"}</div><div><h3>${index + 1}. ${question.prompt}</h3><p class="review-your-answer">Your answer: ${escapeHTML(question.options[selectedAnswers[index]])}</p><p>${question.explanation}</p></div></article>`; }).join("")}</div><div class="results-actions"><button class="secondary-button" id="retryCase">↻ Try again</button><button class="primary-button" id="finishCase">Back to Case Library <span>→</span></button></div><p class="case-disclaimer">Learning feedback is based on this simplified educational scenario and is not a clinical diagnosis.</p></div>`;
  document.getElementById("retryCase").addEventListener("click", () => { currentQuestion = 0; selectedAnswers = []; activeAttemptId = null; hintVisible = false; renderCaseOverview(); });
  document.getElementById("finishCase").addEventListener("click", () => { activeCase = null; activeAttemptId = null; renderCaseLibrary(); });
}


/* Login visual: restrained cursor-following water sheen in the existing colours. */
(() => {
  const panel = document.querySelector('.login-visual');
  if (!panel || !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frame = 0;
  let latestX = 0;
  let latestY = 0;

  panel.addEventListener('pointermove', (event) => {
    const rect = panel.getBoundingClientRect();
    latestX = event.clientX - rect.left;
    latestY = event.clientY - rect.top;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const x = Math.max(0, Math.min(100, (latestX / rect.width) * 100));
      const y = Math.max(0, Math.min(100, (latestY / rect.height) * 100));
      panel.style.setProperty('--water-x', `${x}%`);
      panel.style.setProperty('--water-y', `${y}%`);
      panel.style.setProperty('--water-shift-x', `${(x - 50) * -0.035}px`);
      panel.style.setProperty('--water-shift-y', `${(y - 50) * -0.035}px`);
      panel.classList.add('is-water-active');
      frame = 0;
    });
  }, { passive: true });

  panel.addEventListener('pointerleave', () => {
    panel.classList.remove('is-water-active');
    panel.style.setProperty('--water-x', '50%');
    panel.style.setProperty('--water-y', '50%');
    panel.style.setProperty('--water-shift-x', '0px');
    panel.style.setProperty('--water-shift-y', '0px');
  });
})();
