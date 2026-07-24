"use client";

import { useMemo, useState } from "react";
import { Menu, SearchIcon, X } from "lucide-react";
import FilterSidebar from "@/components/courses/FilterSidebar";
import CourseCard from "@/components/courses/CourseCard";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllCategoriesQuery } from "@/lib/redux/features/category/categoryApi";
import { useGetAllInstructorsQuery } from "@/lib/redux/features/instructor/instructorApi";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import type { Course } from "@/lib/redux/features/course/courseSlice";

type SortKey = "Newest" | "Oldest" | "Price: Low to High" | "Price: High to Low" | "Top Rated";

const getCourseRating = (course: Course) => {
  const rating = course.rating?.[0]?.rating ?? 0;
  return Number.isFinite(rating) ? rating : 0;
};

const normalizeText = (value: string) => value.toLowerCase().trim();

export default function CoursesPage() {
  const [sortBy, setSortBy] = useState<SortKey>("Newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<"all" | "free" | "paid">("all");
  const [ratingOnly, setRatingOnly] = useState(false);

  const { data: courses = [] } = useGetAllCourseQuery();
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const { data: instructors = [] } = useGetAllInstructorsQuery();

  const filteredCourses = useMemo(() => {
    const query = normalizeText(searchQuery);

    return [...courses]
      .filter((course) => {
        const categoryName = normalizeText(course.category || "");
        const instructorName = normalizeText(course.instructor || "");
        const title = normalizeText(course.title || "");
        const matchesSearch =
          !query ||
          title.includes(query) ||
          categoryName.includes(query) ||
          instructorName.includes(query);
        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(course.category);
        const matchesInstructor =
          selectedInstructors.length === 0 || selectedInstructors.includes(course.instructor);
        const isFreeCourse = Number(course.offerPrice ?? course.price ?? 0) === 0;
        const matchesPrice =
          selectedPrice === "all" ||
          (selectedPrice === "free" && isFreeCourse) ||
          (selectedPrice === "paid" && !isFreeCourse);
        const matchesRating = !ratingOnly || getCourseRating(course) >= 4;

        return matchesSearch && matchesCategory && matchesInstructor && matchesPrice && matchesRating;
      })
      .sort((left, right) => {
        switch (sortBy) {
          case "Newest":
            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
          case "Oldest":
            return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
          case "Price: Low to High":
            return Number(left.offerPrice ?? left.price ?? 0) - Number(right.offerPrice ?? right.price ?? 0);
          case "Price: High to Low":
            return Number(right.offerPrice ?? right.price ?? 0) - Number(left.offerPrice ?? left.price ?? 0);
          case "Top Rated":
            return getCourseRating(right) - getCourseRating(left);
          default:
            return 0;
        }
      });
  }, [courses, ratingOnly, selectedCategories, selectedInstructors, selectedPrice, searchQuery, sortBy]);

  const sortOptions: SortKey[] = [
    "Newest",
    "Oldest",
    "Price: Low to High",
    "Price: High to Low",
    "Top Rated",
  ];

  const toggleCategory = (value: string) => {
    setSelectedCategories((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const toggleInstructor = (value: string) => {
    setSelectedInstructors((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedInstructors([]);
    setSelectedPrice("all");
    setRatingOnly(false);
    setSortBy("Newest");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FEFDFF]">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 lg:py-12 gap-8 lg:gap-12">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 text-gray-700 font-medium mb-4"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar */}
          <div
            className={`${sidebarOpen ? "block" : "hidden"} lg:block lg:w-56 lg:shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
          >
            <FilterSidebar
              categories={categories}
              instructors={instructors}
              selectedCategories={selectedCategories}
              selectedInstructors={selectedInstructors}
              selectedPrice={selectedPrice}
              ratingOnly={ratingOnly}
              onToggleCategory={toggleCategory}
              onToggleInstructor={toggleInstructor}
              onPriceChange={setSelectedPrice}
              onRatingChange={setRatingOnly}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Course Grid */}
          <div className="flex-1 w-full">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 lg:mb-10 bg-white shadow-sm rounded-lg p-4">
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Showing {filteredCourses.length} Courses
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <InputGroup>
                  <InputGroupInput
                    id="inline-start-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="mr-1 flex h-[calc(100%-8px)] items-center justify-center rounded-lg bg-primary px-4 cursor-pointer"
                  >
                    <SearchIcon className="h-5 w-5 text-white" />
                  </InputGroupAddon>
                </InputGroup>
                <span className="text-gray-700 font-medium text-sm">
                  Sort By:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors bg-white text-gray-700 font-medium text-sm w-full sm:w-auto"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 lg:mb-12">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    rating: course.rating?.[0]?.rating ?? 0,
                    reviews: course.rating?.length ? `${course.rating.length} Reviews` : "0 Reviews",
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
