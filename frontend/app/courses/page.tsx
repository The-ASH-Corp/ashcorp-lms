"use client";

import { useState } from "react";
import { ChevronDown, Menu, SearchIcon, X } from "lucide-react";
import FilterSidebar from "@/components/courses/FilterSIdebar";
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
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";

const courses = [
  {
    id: 1,
    title: "Mastering Flutter: From Basics to Advanced UI",
    instructor: "Prof. Elena Vance",
    price: 199.0,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop",
    rating: 4,
    reviews: "12k Reviews",
    badge: "New",
    badgeColor: "bg-primary",
  },
  {
    id: 2,
    title: "Advanced Performance Marketing & Growth",
    instructor: "Marcus Sterling",
    price: 149.0,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop",
    rating: 5,
    reviews: "850 Reviews",
    badge: "Trending",
    badgeColor: "bg-cyan-500",
  },
  {
    id: 3,
    title: "Minimalist Design Systems for Brands",
    instructor: "Sarah Jenkins",
    price: 299.0,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop",
    rating: 4.5,
    reviews: "2.4k Reviews",
  },
  {
    id: 4,
    title: "UX Psychology & Interaction Design",
    instructor: "David Kovar",
    price: 0,
    priceLabel: "Free",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop",
    rating: 4,
    reviews: "512 Reviews",
  },
  {
    id: 5,
    title: "Machine Learning for Creative Technologists",
    instructor: "Dr. Julian Moore",
    price: 449.0,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop",
    rating: 5,
    reviews: "3.1k Reviews",
  },
  {
    id: 6,
    title: "The Viral Framework: Social Strategy 2024",
    instructor: "Sophia Ricci",
    price: 89.0,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop",
    rating: 4.5,
    reviews: "1.8k Reviews",
    badge: "Popular",
    badgeColor: "bg-primary",
  },
];

export default function CoursesPage() {
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {data,isLoading,isError} = useGetAllCourseQuery();
  if(isLoading){
    return <div>Loading...</div>
  }
  if(isError){
    return <div>Error...</div>
  }
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
            <FilterSidebar />
          </div>

          {/* Course Grid */}
          <div className="flex-1 w-full">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 lg:mb-10 bg-white shadow-sm rounded-lg p-4">
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Showing 24 Courses
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <InputGroup>
                  <InputGroupInput
                    id="inline-start-input"
                    placeholder="Search..."
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
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors bg-white text-gray-700 font-medium text-sm w-full sm:w-auto">
                    {sortBy}
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 lg:mb-12">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
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
