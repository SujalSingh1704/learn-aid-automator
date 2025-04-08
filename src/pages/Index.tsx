
import React, { useState } from 'react';
import Header from '@/components/Header';
import QuizForm from '@/components/QuizForm';
import QuizDisplay from '@/components/QuizDisplay';
import { Quiz, QuizFormData } from '@/types/quiz';
import { generateQuiz } from '@/lib/quizGenerator';
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
        description: `Successfully created a ${formData.difficulty} quiz with ${formData.numberOfQuestions} questions.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
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
