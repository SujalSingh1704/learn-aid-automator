
export interface QuizFormData {
  topic: string;
  subject: string;
  grade: string;
  numberOfQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: QuizOption[];
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}
