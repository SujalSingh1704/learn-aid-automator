import React, { useState } from 'react';
import { Quiz, QuizFormData } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import QuizQuestion from './QuizQuestion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getGeminiApiKey } from '@/lib/quizGenerator';
import { useToast } from '@/components/ui/use-toast';

interface QuizDisplayProps {
  quiz: Quiz;
  onNewQuiz: () => void;
  formData: QuizFormData;
  onUpdateQuiz: (updatedQuiz: Quiz) => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quiz,
  onNewQuiz,
  formData
}) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const { toast } = useToast();

  // Function to create a printable version
  const handlePrintQuiz = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let printContent = `
        <html>
          <head>
            <title>${quiz.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .question { margin-bottom: 20px; }
              .options { margin-left: 20px; }
              .option { margin-bottom: 5px; }
              .answers { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
              .answer { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${quiz.title}</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="questions">
      `;

      // Add questions
      quiz.questions.forEach((question, index) => {
        printContent += `
          <div class="question">
            <h3>Question ${index + 1}</h3>
            <p>${question.question}</p>
        `;
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          printContent += `<div class="options">`;
          question.options.forEach((option, oIndex) => {
            const letter = String.fromCharCode(65 + oIndex); // A, B, C, D...
            printContent += `<div class="option">${letter}. ${option.text}</div>`;
          });
          printContent += `</div>`;
        } else if (question.type === 'long-answer') {
          printContent += `<div class="long-answer">`;
          if (question.rubric) {
            printContent += `<div><strong>Rubric:</strong><ul>${question.rubric.map((r: string) => `<li>${r}</li>`).join('')}</ul></div>`;
          }
          if (question.keyPoints) {
            printContent += `<div><strong>Key Points:</strong><ul>${question.keyPoints.map((k: string) => `<li>${k}</li>`).join('')}</ul></div>`;
          }
          printContent += `</div>`;
        }
        printContent += `</div>`;
      });

      // Add answer key
      printContent += `<div class="answers"><h2>Answer Key</h2>`;
      quiz.questions.forEach((question, index) => {
        printContent += `<div class="answer">`;
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          const correctOption = question.options.find(opt => opt.isCorrect);
          const correctIndex = question.options.findIndex(opt => opt.isCorrect);
          const letter = String.fromCharCode(65 + correctIndex);
          printContent += `<p><strong>Question ${index + 1}:</strong> ${letter}. ${correctOption?.text}</p>`;
          if (question.explanation) {
            printContent += `<p><em>Explanation: ${question.explanation}</em></p>`;
          }
        } else if (question.type === 'long-answer') {
          printContent += `<p><strong>Question ${index + 1}:</strong> Long Answer</p>`;
          if (question.sampleAnswer) {
            printContent += `<p><em>Sample Answer: ${question.sampleAnswer}</em></p>`;
          }
          if (question.rubric) {
            printContent += `<div><strong>Rubric:</strong><ul>${question.rubric.map((r: string) => `<li>${r}</li>`).join('')}</ul></div>`;
          }
          if (question.keyPoints) {
            printContent += `<div><strong>Key Points:</strong><ul>${question.keyPoints.map((k: string) => `<li>${k}</li>`).join('')}</ul></div>`;
          }
        }
        printContent += `</div>`;
      });

      printContent += `</div></body></html>`;

      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const isUsingAI = !!getGeminiApiKey();

  return (
    <div className="quiz-container">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white">
          <CardTitle className="text-xl">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground flex justify-between">
            <span>{quiz.questions.length} questions • {formData.difficulty} difficulty</span>
            {isUsingAI && <span className="text-quiz-primary font-medium">Powered by Gemini AI</span>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 flex-wrap">
          <Button 
            variant="outline"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handlePrintQuiz}
            >
              Save as PDF
            </Button>
            <Button 
              variant="default"
              className="bg-quiz-primary hover:bg-quiz-primary/90"
              onClick={onNewQuiz}
            >
              Create New Quiz
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            index={index}
            showAnswers={showAnswers}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizDisplay;
