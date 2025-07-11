import React, { useState } from 'react';
import Header from '@/components/Header';
import QuizForm from '@/components/QuizForm';
import QuizDisplay from '@/components/QuizDisplay';
// import { QuizHistory } from '@/components/QuizHistory';
import { Quiz, QuizFormData } from '@/types/quiz';
import { generateQuiz } from '@/lib/quizGenerator';
import { useToast } from '@/components/ui/use-toast';
// import { useQuizHistory } from '@/hooks/use-quiz-history';
import { SidebarProvider } from '@/components/ui/sidebar';

const Index = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<QuizFormData | null>(null);
  const { toast } = useToast();
  // const { history, addQuiz, clearHistory } = useQuizHistory();
  // Placeholder history logic since useQuizHistory hook is missing
  const history: Quiz[] = [];
  const addQuiz = (_quiz: Quiz) => {};
  const clearHistory = () => {};

  const handleQuizFormSubmit = async (formData: QuizFormData) => {
    setIsLoading(true);
    setCurrentFormData(formData);
    
    try {
      const generatedQuiz = await generateQuiz(formData);
      setQuiz(generatedQuiz);
      addQuiz(generatedQuiz);
      
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

  const handleQuizSelect = (selectedQuiz: Quiz) => {
    setQuiz(selectedQuiz);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* QuizHistory component is missing. Please implement or restore src/components/QuizHistory.tsx to use this feature. */}
        
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
      </div>
      
      <footer className="border-t py-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          Learn Aid Automator &copy; {new Date().getFullYear()} - AI-powered quiz generator for educators
        </div>
      </footer>
    </div>
  );
};

export default Index;
