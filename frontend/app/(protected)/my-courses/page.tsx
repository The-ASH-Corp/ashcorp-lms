'use client';

import { useState } from 'react';
import { Grid3x3, List } from 'lucide-react';
import UserCourseList from '@/components/courses/UserCourseList';
import StatCard from '@/components/courses/StatCard';

const courses = [
  {
    id: 1,
    title: 'Mastering Flutter: From Basics to Advanced UI',
    instructor: 'Prof. Julian Vole',
    category: 'MOBILE DEV',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    progress: 65,
    status: 'in-progress',
    hasCheckmark: false
  },
  {
    id: 2,
    title: 'Architecting AI: Neural Networks in Production',
    instructor: 'Dr. Sarah Chen',
    category: 'DATA SCIENCE',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    progress: 28,
    status: 'in-progress',
    hasCheckmark: false
  },
  {
    id: 3,
    title: 'Product Strategy & The Modern Ecosystem',
    instructor: 'Marcus Aurelius',
    category: 'STRATEGY',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
    progress: 100,
    status: 'completed',
    hasCheckmark: true
  }
];

export default function MyCourses() {
  const [viewType, setViewType] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <StatCard
            label="ACTIVE COURSES"
            number="03"
            description="Enrolled"
            detail="2 courses nearing deadline"
          />
          <StatCard
            label="COMPLETED"
            number="12"
            description="Total"
            detail="4 certificates this month"
          />
          <StatCard
            label="LEARNING HOURS"
            number="48"
            unit="h"
            description=""
            detail="Top 5% of learners this week"
          />
        </div>

        {/* Course Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'in-progress'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === 'completed'
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Course Cards */}
        <div className={`${viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-16`}>
          {courses.map(course => (
            <UserCourseList key={course.id} course={course} viewType={viewType} />
          ))}
        </div>
      </div>
    </div>
  );
}
