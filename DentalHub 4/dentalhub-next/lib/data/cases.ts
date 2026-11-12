export type CaseQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
};

export type CaseItem = {
  id: number;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tint: "blue" | "purple" | "teal" | "orange";
  icon: string;
  summary: string;
  objectives: string[];
  patient: string;
  history: string;
  findings: string;
  questions: CaseQuestion[];
};

export const caseData: CaseItem[] = [
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
