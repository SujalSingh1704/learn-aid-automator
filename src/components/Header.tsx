
import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-quiz-primary to-quiz-secondary py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Learn Aid Automator</h1>
        </div>
        <div>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full text-white">
            AI-Powered Quiz Generator
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
