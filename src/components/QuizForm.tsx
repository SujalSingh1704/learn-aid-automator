
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
    difficulty: 'Medium'
  });

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
  const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College'];
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
  const difficulties = ['Easy', 'Medium', 'Hard'];

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
            <Slider
              defaultValue={[5]}
              max={20}
              min={1}
              step={1}
              value={[formData.numberOfQuestions]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
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
