import React from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X, BookOpen } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  showAnswers: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  index,
  showAnswers
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);

  const handleOptionChange = (optionId: string) => {
    if (!showAnswers) {
      setSelectedOption(optionId);
    }
  };

  return (
    <Card className="question-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Question {index + 1}</span>
          <span className="text-sm px-2 py-1 bg-muted rounded-full">
            {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 font-medium">{question.question}</div>
        
        <RadioGroup value={selectedOption || ""} className="space-y-3">
          {question.options.map(option => (
            <div 
              key={option.id} 
              className={`flex items-center space-x-2 p-2 rounded border 
                ${showAnswers && option.isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${showAnswers && selectedOption === option.id && !option.isCorrect ? 'border-red-500 bg-red-50' : ''}
                ${!showAnswers && selectedOption === option.id ? 'border-quiz-primary bg-blue-50' : ''}
              `}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id}
                onClick={() => handleOptionChange(option.id)}
                disabled={showAnswers}
              />
              <Label 
                htmlFor={option.id} 
                className="w-full cursor-pointer flex justify-between items-center"
              >
                {option.text}
                {showAnswers && option.isCorrect && (
                  <Check className="h-5 w-5 text-green-600" />
                )}
                {showAnswers && selectedOption === option.id && !option.isCorrect && (
                  <X className="h-5 w-5 text-red-600" />
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showAnswers && question.explanation && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center text-sm mb-2"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </Button>
            {showExplanation && (
              <div className="p-3 bg-muted/50 rounded-md text-sm">
                {question.explanation}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
