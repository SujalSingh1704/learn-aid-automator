
import React, { useState } from 'react';
import Header from '@/components/Header';
import QuizForm from '@/components/QuizForm';
import QuizDisplay from '@/components/QuizDisplay';
import { Quiz, QuizFormData } from '@/types/quiz';
import { generateQuiz, regenerateQuestion } from '@/lib/quizGenerator';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<QuizFormData | null>(null);
  const { toast } = useToast();

  const handleQuizFormSubmit = async (formData: QuizFormData) => {
    setIsLoading(true);
    setCurrentFormData(formData);
    
    try {
      const generatedQuiz = await generateQuiz(formData);
      setQuiz(generatedQuiz);
      
      toast({
        title: "Quiz Generated!",
        description: `Successfully created a ${formData.difficulty} quiz with ${formData.numberOfQuestions} questions using Gemini AI.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Generating Quiz",
        description: error.message || "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuiz = () => {
    setQuiz(null);
  };

  const handleRegenerateQuestion = async (quiz: Quiz, questionIndex: number) => {
    if (!currentFormData) return;
    
    try {
      // Generate a completely new quiz instead of using the mock generator
      const newQuiz = await generateQuiz(currentFormData);
      
      // Take just one question from the new quiz
      const newQuestion = newQuiz.questions[0];
      
      // Update the existing quiz with this new question
      const updatedQuiz = { ...quiz };
      updatedQuiz.questions = [
        ...quiz.questions.slice(0, questionIndex),
        newQuestion,
        ...quiz.questions.slice(questionIndex + 1)
      ];
      
      setQuiz(updatedQuiz);
      
      toast({
        title: "Question Regenerated",
        description: "Successfully created a new question using Gemini AI.",
      });
    } catch (error: any) {
      toast({
        title: "Error Regenerating Question",
        description: error.message || "Failed to regenerate question. Please try again.",
        variant: "destructive",
      });
      console.error("Error regenerating question:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        {!quiz ? (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Quiz Generator</h2>
              <p className="text-muted-foreground">
                Create customized quizzes for your students in seconds
              </p>
            </div>
            <QuizForm onSubmit={handleQuizFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <QuizDisplay 
            quiz={quiz} 
            onNewQuiz={handleNewQuiz} 
            formData={currentFormData!}
            onUpdateQuiz={setQuiz}
          />
        )}
      </main>
      
      <footer className="border-t py-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          Learn Aid Automator &copy; {new Date().getFullYear()} - AI-powered quiz generator for educators
        </div>
      </footer>
    </div>
  );
};

export default Index;
