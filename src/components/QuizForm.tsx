import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { QuizFormData } from '@/types/quiz';

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<QuizFormData>({
    topic: '',
    subject: '',
    grade: '',
    numberOfQuestions: 5,
    difficulty: 'Medium',
    questionTypeCounts: {
      'multiple-choice': 3,
      'true-false': 1,
      'long-answer': 1
    }
  });
  // Handler for question type counts
  const handleQuestionTypeCountChange = (type: 'multiple-choice' | 'true-false' | 'long-answer', value: number) => {
    const newCounts = { ...formData.questionTypeCounts, [type]: value };
    // Ensure total does not exceed numberOfQuestions
    const total = Object.values(newCounts).reduce((a, b) => a + (b || 0), 0);
    if (total > formData.numberOfQuestions) {
      // Reduce the changed type to fit
      newCounts[type] = Math.max(0, value - (total - formData.numberOfQuestions));
    }
    setFormData({
      ...formData,
      questionTypeCounts: newCounts
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({
      ...formData,
      numberOfQuestions: value[0]
    });
  };

  // Sample grade levels and subjects
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College', 'University'];
  const subjects = [
    'Mathematics', 
    'Science', 
    'English', 
    'History', 
    'Geography', 
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'Art',
    'Music',
    'Physical Education',
    'Foreign Languages'
  ];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard'];

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl text-center">Generate a New Quiz</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="e.g. Photosynthesis, Ancient Egypt, Fractions"
              value={formData.topic}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleSelectChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => handleSelectChange('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleSelectChange('difficulty', value as 'Easy' | 'Medium' | 'Hard')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff} value={diff}>
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="numberOfQuestions">Number of Questions: {formData.numberOfQuestions}</Label>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {formData.difficulty === "Hard" ? 
                "For Hard difficulty, maximum 20 questions are allowed." :
                "Maximum 25 questions are allowed."}
            </div>
            <Slider
              defaultValue={[5]}
              max={formData.difficulty === "Hard" ? 20 : 25}
              min={1}
              step={1}
              value={[formData.numberOfQuestions]}
              onValueChange={handleSliderChange}
              className="py-4 [&_[role=track]]:bg-white [&_.range]:bg-quiz-primary [&_[role=slider]]:border-quiz-primary"
            />
          </div>

          <div className="space-y-2">
            <Label>Question Types</Label>
            <div className="text-xs text-muted-foreground mb-2">
              {formData.difficulty === "Hard" ? 
                "For Hard difficulty: Maximum 8 long-answer questions allowed" :
                "Maximum 12 long-answer questions allowed"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <Label htmlFor="mc-count">Multiple Choice</Label>
                <Input
                  id="mc-count"
                  type="number"
                  min={0}
                  max={formData.numberOfQuestions}
                  value={formData.questionTypeCounts?.['multiple-choice'] || 0}
                  onChange={e => handleQuestionTypeCountChange('multiple-choice', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="tf-count">True/False</Label>
                <Input
                  id="tf-count"
                  type="number"
                  min={0}
                  max={formData.numberOfQuestions}
                  value={formData.questionTypeCounts?.['true-false'] || 0}
                  onChange={e => handleQuestionTypeCountChange('true-false', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="la-count">Long Answer</Label>
                <Input
                  id="la-count"
                  type="number"
                  min={0}
                  max={formData.numberOfQuestions}
                  value={formData.questionTypeCounts?.['long-answer'] || 0}
                  onChange={e => handleQuestionTypeCountChange('long-answer', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total must not exceed number of questions.
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-quiz-primary hover:bg-quiz-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuizForm;
