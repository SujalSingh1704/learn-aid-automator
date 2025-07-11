import { Quiz, QuizFormData, QuizQuestion } from "@/types/quiz";
import { callGeminiApi } from "./geminiApi";

// Store the API key in memory (can be updated at runtime)
let geminiApiKey: string | null = "AIzaSyAt8keMbMlH0OBqcE7tSBhbEIcw2TxAa48";

export function setGeminiApiKey(key: string) {
  geminiApiKey = key;
}

export function getGeminiApiKey(): string | null {
  return geminiApiKey;
}

export async function generateQuiz(formData: QuizFormData): Promise<Quiz> {
  try {
    // Validate question counts
    const totalQuestions = formData.numberOfQuestions;
    if (totalQuestions > 25) {
      throw new Error("Maximum 25 questions are allowed to ensure reliable generation. Please reduce the number of questions.");
    }

    // For hard difficulty, enforce stricter limits
    if (formData.difficulty === "Hard" && totalQuestions > 20) {
      throw new Error("For hard difficulty, maximum 20 questions are allowed. Please reduce the number of questions or lower the difficulty.");
    }

    // If there are long-answer questions, enforce stricter limits
    if (formData.questionTypeCounts?.["long-answer"] > 0) {
      const longAnswerCount = formData.questionTypeCounts["long-answer"];
      const maxLongAnswer = formData.difficulty === "Hard" ? 10 : 12;
      const longAnswerType = formData.subject === "Mathematics" ? "proof/solving" : "long-answer";
      if (longAnswerCount > maxLongAnswer) {
        throw new Error(`Maximum ${maxLongAnswer} ${longAnswerType} questions are allowed for ${formData.difficulty} difficulty. Please reduce the number of ${longAnswerType} questions.`);
      }
    }

    const apiPromise = callGeminiApi(
      {
        topic: formData.topic,
        subject: formData.subject,
        grade: formData.grade,
        numberOfQuestions: formData.numberOfQuestions,
        difficulty: formData.difficulty,
        questionTypeCounts: formData.questionTypeCounts
      },
      geminiApiKey!
    );

    // Add a timeout to avoid hanging forever and showing parse error
    const TIMEOUT_MS = 120000; // 120 seconds
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Quiz generation timed out. Please try again or reduce the number of questions.")), TIMEOUT_MS)
    );

    const apiResponse = await Promise.race([apiPromise, timeoutPromise]);

    const questions: QuizQuestion[] = (apiResponse as any).questions.map((q: any, index: number) => {
      if (q.type === "long-answer") {
        return {
          id: `q-${index}`,
          question: q.question,
          type: q.type,
          options: [],
          sampleAnswer: (q as any).sampleAnswer,
          rubric: (q as any).rubric,
          keyPoints: (q as any).keyPoints
        };
      }

      // Defensive: If q.options is not an array, return empty array
      const options = Array.isArray(q.options)
        ? q.options.map((opt: any, optIndex: number) => ({
            id: `q-${index}-${optIndex}`,
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        : [];

      return {
        id: `q-${index}`,
        question: q.question,
        type: q.type,
        options,
        explanation: q.explanation
      };
    });

    return {
      id: `quiz-${Date.now()}`,
      title: `${formData.topic} Quiz - ${formData.grade} Grade ${formData.subject}`,
      questions,
      createdAt: new Date()
    };
  } catch (error) {
    if ((error as Error).message && (error as Error).message.includes("timed out")) {
      throw new Error("Quiz generation timed out. Please try again or reduce the number of questions.");
    }
    console.error("Error generating quiz with Gemini:", error);
    throw error;
  }
}

// -------------------- MOCK GENERATOR --------------------

export async function generateMockQuiz(
  formData: QuizFormData & { questionTypeCounts?: Record<string, number> }
): Promise<Quiz> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const questions: QuizQuestion[] = [];
  const typeCounts = formData.questionTypeCounts || {
    "multiple-choice": Math.ceil((formData.numberOfQuestions * 2) / 3),
    "true-false": Math.floor(formData.numberOfQuestions / 3),
    "long-answer": 0
  };

  let index = 0;
  for (const [type, count] of Object.entries(typeCounts)) {
    for (let i = 0; i < count; i++) {
      if (type === "multiple-choice") {
        questions.push(generateMultipleChoiceQuestion(formData, index));
      } else if (type === "true-false") {
        questions.push(generateTrueFalseQuestion(formData, index));
      } else if (type === "long-answer") {
        questions.push(generateLongAnswerQuestion(formData, index));
      }
      index++;
    }
  }

  while (questions.length < formData.numberOfQuestions) {
    questions.push(generateMultipleChoiceQuestion(formData, index++));
  }

  return {
    id: `quiz-${Date.now()}`,
    title: `${formData.topic} Quiz - ${formData.grade} Grade ${formData.subject}`,
    questions,
    createdAt: new Date()
  };
}

// -------------------- QUESTION GENERATORS --------------------

function generateMultipleChoiceQuestion(
  formData: QuizFormData,
  index: number
): QuizQuestion {
  const templates = [
    `What is the main concept behind {topic} in {subject}?`,
    `Which of the following best describes {topic}?`,
    `In {subject}, how does {topic} relate to real-world applications?`,
    `According to {subject} principles, what characterizes {topic}?`,
    `What is a key component of {topic} as studied in {subject}?`
  ];
  const question = templates[index % templates.length]
    .replace("{topic}", formData.topic)
    .replace("{subject}", formData.subject);

  return {
    id: `q-${index}`,
    question,
    type: "multiple-choice",
    options: [
      { id: `q-${index}-a`, text: `Sample answer 1 for ${formData.topic}`, isCorrect: true },
      { id: `q-${index}-b`, text: `Sample answer 2 for ${formData.topic}`, isCorrect: false },
      { id: `q-${index}-c`, text: `Sample answer 3 for ${formData.topic}`, isCorrect: false },
      { id: `q-${index}-d`, text: `Sample answer 4 for ${formData.topic}`, isCorrect: false }
    ],
    explanation: `This is an explanation about ${formData.topic} that helps students understand the concept better.`
  };
}

function generateTrueFalseQuestion(
  formData: QuizFormData,
  index: number
): QuizQuestion {
  const templates = [
    `{topic} is considered a fundamental concept in {subject}.`,
    `{topic} was first discovered in the 21st century.`,
    `According to modern {subject}, {topic} is no longer relevant.`,
    `{topic} directly influences how we understand {subject} today.`
  ];
  const question = templates[index % templates.length]
    .replace("{topic}", formData.topic)
    .replace("{subject}", formData.subject);

  return {
    id: `q-${index}`,
    question,
    type: "true-false",
    options: [
      { id: `q-${index}-a`, text: "True", isCorrect: index % 2 === 0 },
      { id: `q-${index}-b`, text: "False", isCorrect: index % 2 !== 0 }
    ],
    explanation: `This statement is ${index % 2 === 0 ? "true" : "false"} because of principles in ${formData.subject}.`
  };
}

function generateLongAnswerQuestion(
  formData: QuizFormData,
  index: number
): QuizQuestion {
  // Different templates for Mathematics vs other subjects
  const mathTemplates = [
    `Prove that {topic}.`,
    `Solve and explain the steps for {topic}.`,
    `Demonstrate the solution for {topic} showing all work.`,
    `Provide a complete proof or solution for {topic}.`,
    `Solve the following problem related to {topic}, showing all steps.`
  ];

  const generalTemplates = [
    `Explain the significance of {topic} in the context of {subject}.`,
    `Describe how {topic} has impacted the field of {subject}.`,
    `Discuss the main challenges related to {topic} in {subject}.`,
    `Analyze the relationship between {topic} and other key concepts in {subject}.`,
    `Provide a detailed overview of {topic} as it applies to {subject}.`
  ];

  const templates = formData.subject === "Mathematics" ? mathTemplates : generalTemplates;
  const question = templates[index % templates.length]
    .replace("{topic}", formData.topic)
    .replace("{subject}", formData.subject);

  const isMath = formData.subject === "Mathematics";
  return {
    id: `q-${index}`,
    question,
    type: "long-answer",
    options: [],
    sampleAnswer: isMath 
      ? `A complete solution should include:\n- Clear steps and logical progression\n- Proper mathematical notation\n- Explanations for key steps\n- Final conclusion or result`
      : `A strong answer should explain ${formData.topic}, its importance in ${formData.subject}, and give examples.`,
    rubric: isMath ? [
      "Correct mathematical reasoning",
      "Clear and logical steps",
      "Proper notation and formatting",
      "Completeness of solution"
    ] : [
      "Understanding of core concepts",
      "Use of relevant examples",
      "Explanation of relationships between ideas",
      "Use of subject-specific terminology"
    ],
    keyPoints: isMath ? [
      "Initial setup and approach",
      "Key steps in the solution/proof",
      "Mathematical justification",
      "Final conclusion or result"
    ] : [
      `Definition and explanation of ${formData.topic}`,
      `Its significance in ${formData.subject}`,
      `Relevant examples or applications`,
      `Challenges or relationships to other concepts`
    ]
  };
}
