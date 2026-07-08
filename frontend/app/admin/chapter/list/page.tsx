'use client';

import { useState } from 'react';
import { Search, RotateCcw, Edit2, Trash2, Plus, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const chaptersData = [
  {
    id: 1,
    number: '01',
    title: 'Adobe Illustrator Fundamentals',
    subtitle: 'Introduction to the interface and tools',
    sequence: 9,
    lessons: 3,
  },
];

export default function ChaptersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">ADMIN DASHBOARD</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Showing chapters for: <span className="font-semibold">Advance Adobe Illustrator Mastery Course</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Reset Button */}
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-gray-600 font-medium whitespace-nowrap">
            <RotateCcw size={18} />
            Reset
          </button>

          {/* Info and New Chapter Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap">
            <p className="text-gray-600 text-sm">Showing 1 of 1 Chapters</p>
            <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium whitespace-nowrap">
              <Plus size={18} />
              <span className="hidden sm:inline">+ New Chapter</span>
              <span className="sm:hidden">+ New</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg mb-8">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">#</span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Chapter Title</span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left hidden md:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sequence</span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contents</span>
                </th>
                <th className="px-4 sm:px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Action</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {chaptersData.map((chapter, index) => (
                <tr key={chapter.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{chapter.number}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded text-violet-600 flex-shrink-0 mt-0.5">
                        <Edit2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{chapter.title}</p>
                        <p className="text-xs text-gray-600 truncate">{chapter.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                    <span className="text-sm font-semibold text-gray-900">{chapter.sequence}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      {chapter.lessons} Lessons
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded transition-colors text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-600">Displaying 1 row</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-violet-600 text-white font-medium text-sm">
              1
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Lessons Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Lessons</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">24</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <span className="text-violet-600">↗</span>
              +6 this month
            </p>
          </div>

          {/* Student Completion Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Student Completion</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">88%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-violet-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Course Rating Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Course Rating</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">4.9</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-violet-600 text-violet-600" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
