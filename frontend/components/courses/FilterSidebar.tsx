"use client";

import { useMemo } from "react";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useGetAllInstructorsQuery } from "@/lib/redux/features/instructor/instructorApi";

interface FilterSidebarProps {
  categories?: { _id: string; categoryName: string }[];
  instructors?: { _id: string; name: string }[];
  selectedCategories: string[];
  selectedInstructors: string[];
  selectedPrice: "all" | "free" | "paid";
  ratingOnly: boolean;
  onToggleCategory: (value: string) => void;
  onToggleInstructor: (value: string) => void;
  onPriceChange: (value: "all" | "free" | "paid") => void;
  onRatingChange: (value: boolean) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  categories: providedCategories,
  instructors: providedInstructors,
  selectedCategories,
  selectedInstructors,
  selectedPrice,
  ratingOnly,
  onToggleCategory,
  onToggleInstructor,
  onPriceChange,
  onRatingChange,
  onClearAll,
}: FilterSidebarProps) {
  const { data: fetchedCategories = [] } = useGetAllCategoriesQuery(undefined, {
    skip: Boolean(providedCategories?.length),
  });
  const { data: fetchedInstructors = [] } = useGetAllInstructorsQuery(undefined, {
    skip: Boolean(providedInstructors?.length),
  });

  const categories = providedCategories ?? fetchedCategories;
  const instructors = providedInstructors ?? fetchedInstructors;

  const activeFiltersCount = useMemo(
    () =>
      selectedCategories.length +
      selectedInstructors.length +
      (selectedPrice === "all" ? 0 : 1) +
      (ratingOnly ? 1 : 0),
    [ratingOnly, selectedCategories.length, selectedInstructors.length, selectedPrice],
  );

  return (
    <div className="w-full lg:w-56 lg:shrink-0 bg-white px-5 py-8 rounded-lg border-gray-200 border shadow-2xl">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-primary hover:text-violet-700 text-xs sm:text-sm font-semibold transition-colors"
        >
          CLEAR ALL{activeFiltersCount ? ` (${activeFiltersCount})` : ""}
        </button>
      </div>

      <div className="mb-6 lg:mb-8">
        <h3 className="text-xs flex items-center pl-3 rounded-lg h-8 font-bold bg-violet-600 text-white uppercase tracking-wide mb-3 lg:mb-4">
          Category
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {categories.length > 0 ? (
            categories.map((item) => (
              <label key={item._id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item.categoryName)}
                  onChange={() => onToggleCategory(item.categoryName)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-gray-700 text-sm">{item.categoryName}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      <div className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-200">
        <h3 className="text-xs flex items-center pl-3 rounded-lg h-8 font-bold bg-violet-600 text-white uppercase tracking-wide mb-3 lg:mb-4">
          Instructors
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {instructors.length > 0 ? (
            instructors.map((item) => (
              <label key={item._id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedInstructors.includes(item.name)}
                  onChange={() => onToggleInstructor(item.name)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-gray-700 text-sm">{item.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No instructors available</p>
          )}
        </div>
      </div>

      <div className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-gray-200">
        <h3 className="text-xs flex items-center pl-3 rounded-lg h-8 font-bold bg-violet-600 text-white uppercase tracking-wide mb-3 lg:mb-4">
          Price
        </h3>
        <div className="space-y-2 lg:space-y-3">
          {[
            { key: "all", label: "All" },
            { key: "free", label: "Free" },
            { key: "paid", label: "Paid" },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPrice === item.key}
                onChange={() => onPriceChange(item.key as "all" | "free" | "paid")}
                className="w-4 h-4 rounded-full border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs flex items-center pl-3 rounded-lg h-8 font-bold bg-violet-600 text-white uppercase tracking-wide mb-3 lg:mb-4">
          Ratings
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ratingOnly}
            onChange={() => onRatingChange(!ratingOnly)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <span className="text-gray-700 text-sm">★★★★☆ 4+ Stars</span>
        </label>
      </div>
    </div>
  );
}