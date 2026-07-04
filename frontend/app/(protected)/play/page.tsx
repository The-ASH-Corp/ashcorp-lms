'use client';

import { useState } from 'react';
import { Play, Share2, BookmarkPlus, CheckCircle2, Lock, Volume2, BookOpen } from 'lucide-react';

const lessons = [
  { id: '1.1', title: 'Course Welcome', duration: '04:20', completed: true },
  { id: '1.2', title: 'System Foundations', duration: '12:15', completed: true },
  { id: '4.1', title: 'Clean Architecture Recap', duration: '08:45', completed: true },
  { id: '4.2', title: 'Event Sourcing Deep Dive', duration: '26:30', completed: true },
  { id: '4.3', title: 'Advanced Architecture Patterns', duration: '22:45', completed: false, isPlaying: true },
  { id: '4.4', title: 'CQRS Implementation', duration: '18:10', completed: false },
  { id: '5.1', title: 'Project Scoping', duration: 'Locked', completed: false, locked: true },
];

export default function PlayPage() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [progress, setProgress] = useState(75);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content - Video and Details */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative bg-linear-to-br from-violet-900 to-violet-950 rounded-xl overflow-hidden mb-6 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors">
                  <Play size={32} className="text-white fill-white ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-200">
                <div className="h-full bg-primary" style={{ width: '60%' }}></div>
              </div>
              <div className="absolute bottom-3 right-3 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                22:45
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
              {['overview', 'resources', 'notes', 'community'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`pb-3 px-2 font-medium text-sm sm:text-base transition-colors whitespace-nowrap ${
                    currentTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Lesson Title and Info */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Module 4: Advanced Architecture Patterns
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-200 rounded-full"></div>
                  <span className="font-medium text-gray-900">Dr. Sarah Chen</span>
                </div>
                <span className="text-sm">•</span>
                <span className="text-gray-600">4.2k Students Enrolled</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-medium">
                <Share2 size={20} />
                <span>Share</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                <BookmarkPlus size={20} />
                <span>Save Lesson</span>
              </button>
            </div>

            {/* Lesson Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Description</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                In this comprehensive session, we delve into the intricate world of advanced software architecture. Dr. Sarah Chen explores microservices orchestration, event-driven designs, and the tactical application of domain-driven design principles. Learn how to scale complex systems while maintaining high availability and developer productivity.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <Volume2 className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Prerequisites</h3>
                    <p className="text-sm text-gray-600 mt-1">Solid understanding of SOLID principles and Module 3.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <BookOpen className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Workshop Files</h3>
                    <p className="text-sm text-gray-600 mt-1">Includes Docker Compose and K8s manifests.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Progress */}
          <div className="lg:col-span-1">
            {/* Course Progress Card */}
            <div className="bg-linear-to-br from-violet-50 to-gray-50 rounded-xl p-6 border border-violet-200 mb-6 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">Course Progress</h3>
                <span className="text-2xl font-bold text-primary">{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mb-6">32 of 40 lessons completed</p>

              {/* Lessons List */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {/* Section 1 */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">1. INTRODUCTION</h4>
                  <div className="space-y-2 ml-2">
                    {lessons.slice(0, 2).map(lesson => (
                      <div key={lesson.id} className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors">
                        <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">{lesson.id} {lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4 */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">4. ADVANCED PATTERNS</h4>
                  <div className="space-y-2 ml-2">
                    {lessons.slice(2, 6).map(lesson => (
                      <div
                        key={lesson.id}
                        className={`flex items-start gap-2 p-2 rounded transition-colors ${
                          lesson.isPlaying
                            ? 'bg-violet-100 border border-violet-300'
                            : 'hover:bg-white'
                        } cursor-pointer`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                        ) : lesson.isPlaying ? (
                          <Play size={18} className="text-primary shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5"></div>
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${lesson.isPlaying ? 'text-primary' : 'text-gray-900'}`}>
                            {lesson.id} {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                          {lesson.isPlaying && <p className="text-xs text-primary font-medium">Playing</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">5. FINAL PROJECT</h4>
                  <div className="space-y-2 ml-2">
                    {lessons.slice(6).map(lesson => (
                      <div key={lesson.id} className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors">
                        {lesson.locked ? (
                          <Lock size={18} className="text-gray-400 shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5"></div>
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${lesson.locked ? 'text-gray-400' : 'text-gray-900'}`}>
                            {lesson.id} {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">{lesson.locked ? 'Locked' : lesson.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Get Certificate Button */}
              <button className="w-full mt-6 bg-primary text-white font-medium py-3 rounded-lg hover:bg-violet-700 transition-colors">
                Get Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
