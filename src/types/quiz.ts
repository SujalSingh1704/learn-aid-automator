
export interface QuizFormData {
  topic: string;
  subject: string;
  grade: string;
  numberOfQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard'  | 'Very Hard';
  // Optional: user can specify how many of each type
  questionTypeCounts?: {
    'multiple-choice'?: number;
    'true-false'?: number;
    'long-answer'?: number;
  };
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'long-answer';
  options: QuizOption[];
  explanation?: string;
  // For long-answer type
  sampleAnswer?: string;
  rubric?: string[];
  keyPoints?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

// Gemini API types
export interface GeminiQuizRequest {
  topic: string;
  subject: string;
  grade: string;
  numberOfQuestions: number;
  difficulty: string;
  // Optional: user can specify how many of each type
  questionTypeCounts?: {
    'multiple-choice'?: number;
    'true-false'?: number;
    'long-answer'?: number;
  };
}

export interface GeminiQuizResponse {
  questions: Array<
    {
      question: string;
      type: 'multiple-choice';
      options: {
        text: string;
        isCorrect: boolean;
      }[];
      explanation?: string;
    }
    |
    {
      question: string;
      type: 'true-false';
      options: {
        text: string;
        isCorrect: boolean;
      }[];
      explanation?: string;
    }
    |
    {
      question: string;
      type: 'long-answer';
      options: [];
      sampleAnswer: string;
      rubric: string[];
      keyPoints: string[];
    }
  >;
}
