import { Quiz, QuizFormData, QuizQuestion } from "@/types/quiz";

// This would normally call an API or use AI to generate questions
// For demo purposes, we're using mock data with a delay to simulate API call
export async function generateQuiz(formData: QuizFormData): Promise<Quiz> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const questions: QuizQuestion[] = [];
  
  // Generate the specified number of questions
  for (let i = 0; i < formData.numberOfQuestions; i++) {
    if (i % 3 === 0) {
      // Every third question is true/false
      questions.push(generateTrueFalseQuestion(formData, i));
    } else {
      // Others are multiple choice
      questions.push(generateMultipleChoiceQuestion(formData, i));
    }
  }
  
  return {
    id: `quiz-${Date.now()}`,
    title: `${formData.topic} Quiz - ${formData.grade} Grade ${formData.subject}`,
    questions,
    createdAt: new Date()
  };
}

function generateMultipleChoiceQuestion(formData: QuizFormData, index: number): QuizQuestion {
  // Create sample questions based on the topic
  // In a real app, this would use an AI model or API
  const questionTemplates = [
    `What is the main concept behind {topic} in {subject}?`,
    `Which of the following best describes {topic}?`,
    `In {subject}, how does {topic} relate to real-world applications?`,
    `According to {subject} principles, what characterizes {topic}?`,
    `What is a key component of {topic} as studied in {subject}?`
  ];
  
  const questionTemplate = questionTemplates[index % questionTemplates.length];
  const question = questionTemplate
    .replace('{topic}', formData.topic)
    .replace('{subject}', formData.subject);
  
  return {
    id: `q-${index}`,
    question,
    type: 'multiple-choice',
    options: [
      { id: `q-${index}-a`, text: `Sample answer 1 for ${formData.topic}`, isCorrect: true },
      { id: `q-${index}-b`, text: `Sample answer 2 for ${formData.topic}`, isCorrect: false },
      { id: `q-${index}-c`, text: `Sample answer 3 for ${formData.topic}`, isCorrect: false },
      { id: `q-${index}-d`, text: `Sample answer 4 for ${formData.topic}`, isCorrect: false }
    ],
    explanation: `This is an explanation about ${formData.topic} that would help students understand the concept better.`
  };
}

function generateTrueFalseQuestion(formData: QuizFormData, index: number): QuizQuestion {
  const trueFalseTemplates = [
    `{topic} is considered a fundamental concept in {subject}.`,
    `{topic} was first discovered in the 21st century.`,
    `According to modern {subject}, {topic} is no longer relevant.`,
    `{topic} directly influences how we understand {subject} today.`
  ];
  
  const questionTemplate = trueFalseTemplates[index % trueFalseTemplates.length];
  const question = questionTemplate
    .replace('{topic}', formData.topic)
    .replace('{subject}', formData.subject);
  
  return {
    id: `q-${index}`,
    question,
    type: 'true-false',
    options: [
      { id: `q-${index}-a`, text: "True", isCorrect: index % 2 === 0 },
      { id: `q-${index}-b`, text: "False", isCorrect: index % 2 !== 0 }
    ],
    explanation: `This statement about ${formData.topic} is ${index % 2 === 0 ? 'true' : 'false'} because of specific principles in ${formData.subject}.`
  };
}

export function regenerateQuestion(quiz: Quiz, questionIndex: number, formData: QuizFormData): Quiz {
  const newQuiz = { ...quiz };
  const currentType = quiz.questions[questionIndex].type;
  
  // Generate a new question of the same type
  const newQuestion = currentType === 'multiple-choice' 
    ? generateMultipleChoiceQuestion(formData, questionIndex + 100) // Adding 100 to get different template
    : generateTrueFalseQuestion(formData, questionIndex + 100);
  
  // Replace the question
  newQuiz.questions = [
    ...quiz.questions.slice(0, questionIndex),
    newQuestion,
    ...quiz.questions.slice(questionIndex + 1)
  ];
  
  return newQuiz;
}
