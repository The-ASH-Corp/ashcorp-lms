'use client';

import { useState } from 'react';
import { Clock, HelpCircle, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExamAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(5);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

  const totalQuestions = 20;

  const toggleFlag = (questionNum: number) => {
    setFlaggedQuestions(prev =>
      prev.includes(questionNum)
        ? prev.filter(q => q !== questionNum)
        : [...prev, questionNum]
    );
  };

  const answers = [
    {
      id: 'A',
      text: 'Prioritizing aesthetic minimalism over complex data density and functional transparency.'
    },
    {
      id: 'B',
      text: 'Balancing data scalability, accessibility compliance, and cognitive load management through information architecture.'
    },
    {
      id: 'C',
      text: 'Enforcing rigid interaction patterns that prevent user error regardless of workflow flexibility.'
    },
    {
      id: 'D',
      text: 'Focusing exclusively on back-end performance optimizations and system-driven automation.'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Academic Zenith</h1>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-600 uppercase tracking-wide">Assessment Mode</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">Advanced UI/UX Certification</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-lg">
              <Clock size={18} className="text-gray-600" />
              <span className="font-mono text-sm sm:text-base font-semibold text-gray-900">54:18</span>
            </div>

            {/* Help Icon */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle size={20} className="text-gray-600" />
            </button>

            {/* Submit Button */}
            <button className="px-4 sm:px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap">
              Submit Exam
            </button>
          </div>
        </div>

        {/* Mobile Assessment Mode */}
        <div className="sm:hidden mt-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Assessment Mode</p>
          <p className="text-lg font-semibold text-gray-900">Advanced UI/UX Certification</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar - Question Navigator */}
        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200 px-4 sm:px-6 lg:px-6 py-6 lg:py-8 overflow-x-auto lg:overflow-y-auto">
          {/* Question Counter */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-lg border-2 border-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-violet-600 font-semibold">5</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Question 5</p>
              <p className="text-xs text-gray-600">OF {totalQuestions} QUESTIONS</p>
            </div>
          </div>

          {/* Jump to Question */}
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Jump to Question</p>
          
          {/* Question Buttons Grid */}
          <div className="grid grid-cols-5 lg:grid-cols-5 gap-2 mb-8">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentQuestion(num)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                  num === currentQuestion
                    ? 'bg-violet-600 text-white'
                    : flaggedQuestions.includes(num)
                    ? 'bg-red-100 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Flag for Review Button */}
          <button className="w-full px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2">
            <Flag size={18} />
            Flag for Review
          </button>

          {/* Navigation */}
          <div className="flex gap-2 mt-6 lg:hidden">
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              <ChevronLeft size={18} />
              Previous
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold uppercase rounded">
                MULTIPLE CHOICE
              </span>
              <span className="text-gray-600 text-sm">• 5 Points</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Explain the core principles of User Experience Design in the context of high-load enterprise applications.
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8 flex-1">
            {answers.map(answer => (
              <button
                key={answer.id}
                onClick={() => setSelectedOption(answer.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedOption === answer.id
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === answer.id
                      ? 'border-violet-600 bg-violet-600'
                      : 'border-gray-300 bg-white'
                  }`}>
                    <span className={`font-semibold text-sm ${
                      selectedOption === answer.id ? 'text-white' : 'text-gray-600'
                    }`}>
                      {answer.id}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base">{answer.text}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-gray-200 pt-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Flag size={18} />
              Flag for Later
            </button>

            <button className="text-gray-600 hover:text-gray-900 font-medium">
              Clear Selection
            </button>

            <button className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
              Save & Next
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="flex flex-wrap gap-2 justify-center mt-6 text-xs text-gray-600 pt-4 border-t border-gray-200">
            <span>ALT</span>
            <span>+</span>
            <span>F</span>
            <span className="font-semibold">FLAG</span>
            <span>ENTER</span>
            <span className="font-semibold">NEXT</span>
            <span>1-4</span>
            <span className="font-semibold">SELECT OPTION</span>
          </div>
        </div>

        {/* Right Navigation - Desktop Only */}
        <div className="hidden lg:flex flex-col items-center justify-center border-l border-gray-200 px-4 py-8 gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={24} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
