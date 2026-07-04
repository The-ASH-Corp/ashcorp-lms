'use client';

import { useState } from 'react';

const initialFilters = {
  flutter: false,
  marketing: false,
  design: false,
  beginner: false,
  intermediate: false,
  advanced: false,
  free: false,
  paid: false,
  rating: false
};

type FilterKey = keyof typeof initialFilters;

export default function FilterSidebar() {
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (key: FilterKey) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full lg:w-56 lg:flex-shrink-0 bg-white px-5 py-8 rounded-lg border-gray-200 border shadow-2xl ">
      {/* Filters Header */}
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button className="text-primary hover:text-violet-700 text-xs sm:text-sm font-semibold transition-colors">
          CLEAR ALL
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 lg:mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 lg:mb-4">
          Category
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {[
            { key: 'flutter', label: 'Flutter Development' },
            { key: 'marketing', label: 'Digital Marketing' },
            { key: 'design', label: 'Graphic Design' }
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[item.key as keyof typeof filters]}
                onChange={() => handleFilterChange(item.key as FilterKey)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-200">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 lg:mb-4">
          Level
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {[
            { key: 'beginner', label: 'Beginner' },
            { key: 'intermediate', label: 'Intermediate' },
            { key: 'advanced', label: 'Advanced' }
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[item.key as keyof typeof filters]}
                onChange={() => handleFilterChange(item.key as FilterKey)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-200">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 lg:mb-4">
          Price
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {[
            { key: 'free', label: 'Free' },
            { key: 'paid', label: 'Paid' }
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={filters[item.key as keyof typeof filters]}
                onChange={() => {
                  setFilters(prev => ({ ...prev, free: false, paid: false, [item.key]: true }));
                }}
                className="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings Filter */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 lg:mb-4">
          Ratings
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.rating}
            onChange={() => handleFilterChange('rating')}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <span className="text-gray-700 text-sm">★★★★★ 4+ Stars</span>
        </label>
      </div>
    </div>
  );
}
