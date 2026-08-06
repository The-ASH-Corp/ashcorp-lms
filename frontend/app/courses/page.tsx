

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Menu,
  SearchIcon,
  X,
} from "lucide-react";

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
import { useGetPaginatedCoursesQuery } from "@/lib/redux/features/course/courseApi";

import type { Course } from "@/lib/redux/features/course/courseSlice";

import { PropagateLoader } from "react-spinners";

type SortKey =
  | "Newest"
  | "Oldest"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Top Rated";

const getCourseRating = (course: Course) => {
  const rating = course.rating?.[0]?.rating ?? 0;
  return Number.isFinite(rating) ? rating : 0;
};

const normalizeText = (value: string) =>
  value.toLowerCase().trim();

function CoursesContent() {
  const searchParams = useSearchParams();

  const categoryQuery = searchParams.get("category");

  const [sortBy, setSortBy] =
    useState<SortKey>("Newest");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<string[]>([]);

  const [
    selectedInstructors,
    setSelectedInstructors,
  ] = useState<string[]>([]);

  const [selectedPrice, setSelectedPrice] =
    useState<"all" | "free" | "paid">("all");

  const [ratingOnly, setRatingOnly] =
    useState(false);

  const listingRef =
    useRef<HTMLDivElement | null>(null);

  // Sync category query parameter from URL if provided
  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategories([categoryQuery]);
    }
  }, [categoryQuery]);

  // Get courses
  const {
    data: coursePage,
    isLoading,
    isError,
  } = useGetPaginatedCoursesQuery({
    page: currentPage,
    limit: 10,
  });

  // Get categories
  const { data: categories = [] } =
    useGetAllCategoriesQuery();

  // Get instructors
  const { data: instructors = [] } =
    useGetAllInstructorsQuery();

  const courses = useMemo(
    () => coursePage?.data ?? [],
    [coursePage]
  );

  const totalCourses = useMemo(
    () =>
      coursePage?.pagination.totalCourses ??
      courses.length,
    [
      coursePage?.pagination.totalCourses,
      courses.length,
    ]
  );

  const totalPages = useMemo(
    () =>
      coursePage?.pagination.totalPages ?? 1,
    [coursePage?.pagination.totalPages]
  );

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    const query = normalizeText(searchQuery);

    return [...courses]
      .filter((course) => {
        const categoryName = normalizeText(
          course.category || ""
        );

        const instructorName = normalizeText(
          course.instructor || ""
        );

        const title = normalizeText(
          course.title || ""
        );

        const matchesSearch =
          !query ||
          title.includes(query) ||
          categoryName.includes(query) ||
          instructorName.includes(query);

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.some((cat) => {
            if (!course.category) return false;

            const catLower =
              cat.toLowerCase();

            if (
              typeof course.category ===
              "string"
            ) {
              return (
                course.category.toLowerCase() ===
                  catLower ||
                course.category === cat
              );
            }

            if (
              typeof course.category ===
                "object" &&
              course.category !== null
            ) {
              return (
                (
                  course.category as {
                    _id?: string;
                  }
                )._id === cat ||
                (
                  course.category as {
                    categoryName?: string;
                  }
                ).categoryName?.toLowerCase() ===
                  catLower
              );
            }

            return false;
          });

        const matchesInstructor =
          selectedInstructors.length === 0 ||
          selectedInstructors.some(
            (inst) =>
              inst.toLowerCase() ===
              instructorName.toLowerCase()
          );

        const isFreeCourse =
          Number(
            course.offerPrice ??
              course.price ??
              0
          ) === 0;

        const matchesPrice =
          selectedPrice === "all" ||
          (selectedPrice === "free" &&
            isFreeCourse) ||
          (selectedPrice === "paid" &&
            !isFreeCourse);

        const matchesRating =
          !ratingOnly ||
          getCourseRating(course) >= 4;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesInstructor &&
          matchesPrice &&
          matchesRating
        );
      })
      .sort((left, right) => {
        switch (sortBy) {
          case "Newest":
            return (
              new Date(
                right.createdAt
              ).getTime() -
              new Date(
                left.createdAt
              ).getTime()
            );

          case "Oldest":
            return (
              new Date(
                left.createdAt
              ).getTime() -
              new Date(
                right.createdAt
              ).getTime()
            );

          case "Price: Low to High":
            return (
              Number(
                left.offerPrice ??
                  left.price ??
                  0
              ) -
              Number(
                right.offerPrice ??
                  right.price ??
                  0
              )
            );

          case "Price: High to Low":
            return (
              Number(
                right.offerPrice ??
                  right.price ??
                  0
              ) -
              Number(
                left.offerPrice ??
                  left.price ??
                  0
              )
            );

          case "Top Rated":
            return (
              getCourseRating(right) -
              getCourseRating(left)
            );

          default:
            return 0;
        }
      });
  }, [
    courses,
    ratingOnly,
    selectedCategories,
    selectedInstructors,
    selectedPrice,
    searchQuery,
    sortBy,
  ]);

  // Scroll to listing when page changes
  useEffect(() => {
    listingRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const sortOptions: SortKey[] = [
    "Newest",
    "Oldest",
    "Price: Low to High",
    "Price: High to Low",
    "Top Rated",
  ];

  const toggleCategory = (
    value: string
  ) => {
    setSelectedCategories((current) =>
      current.some(
        (c) =>
          c.toLowerCase() ===
          value.toLowerCase()
      )
        ? current.filter(
            (item) =>
              item.toLowerCase() !==
              value.toLowerCase()
          )
        : [...current, value]
    );
  };

  const toggleInstructor = (
    value: string
  ) => {
    setSelectedInstructors((current) =>
      current.some(
        (i) =>
          i.toLowerCase() ===
          value.toLowerCase()
      )
        ? current.filter(
            (item) =>
              item.toLowerCase() !==
              value.toLowerCase()
          )
        : [...current, value]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedInstructors([]);
    setSelectedPrice("all");
    setRatingOnly(false);
    setSortBy("Newest");
    setCurrentPage(1);
  };

  // Pagination pages
  const paginationPages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    const pages = new Set<number>([
      1,
      totalPages,
    ]);

    for (
      let offset = -1;
      offset <= 1;
      offset += 1
    ) {
      const page =
        currentPage + offset;

      if (
        page > 1 &&
        page < totalPages
      ) {
        pages.add(page);
      }
    }

    return Array.from(pages).sort(
      (left, right) => left - right
    );
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#FEFDFF]">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          Loading courses...
        </div>
      ) : isError ? (
        /* Error State */
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          Something went wrong while loading
          courses.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 lg:py-12 gap-8 lg:gap-12">

          {/* Mobile Filter Button */}
          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="lg:hidden flex items-center gap-2 text-gray-700 font-medium mb-4"
          >
            {sidebarOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}

            {sidebarOpen
              ? "Hide Filters"
              : "Show Filters"}
          </button>

          {/* Filter Sidebar */}
          <div
            className={`${
              sidebarOpen
                ? "block"
                : "hidden"
            } lg:block lg:w-56 lg:shrink-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
          >
            <FilterSidebar
              categories={categories}
              instructors={instructors}
              selectedCategories={
                selectedCategories
              }
              selectedInstructors={
                selectedInstructors
              }
              selectedPrice={
                selectedPrice
              }
              ratingOnly={ratingOnly}
              onToggleCategory={(
                value
              ) => {
                toggleCategory(value);
                setCurrentPage(1);
              }}
              onToggleInstructor={(
                value
              ) => {
                toggleInstructor(value);
                setCurrentPage(1);
              }}
              onPriceChange={(
                value
              ) => {
                setSelectedPrice(
                  value
                );
                setCurrentPage(1);
              }}
              onRatingChange={(
                value
              ) => {
                setRatingOnly(value);
                setCurrentPage(1);
              }}
              onClearAll={
                clearAllFilters
              }
            />
          </div>

          {/* Course Listing */}
          <div
            className="flex-1 w-full"
            ref={listingRef}
          >
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 lg:mb-10 bg-white shadow-sm rounded-lg p-4">
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Showing{" "}
                {filteredCourses.length}{" "}
                of {totalCourses} Courses
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                {/* Search */}
                <InputGroup>
                  <InputGroupInput
                    id="inline-start-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(
                      event
                    ) => {
                      setSearchQuery(
                        event.target
                          .value
                      );

                      setCurrentPage(
                        1
                      );
                    }}
                  />

                  <InputGroupAddon
                    align="inline-end"
                    className="mr-1 flex h-[calc(100%-8px)] items-center justify-center rounded-lg bg-primary px-4 cursor-pointer"
                  >
                    <SearchIcon className="h-5 w-5 text-white" />
                  </InputGroupAddon>
                </InputGroup>

                {/* Sort */}
                <span className="text-gray-700 font-medium text-sm">
                  Sort By:
                </span>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(
                      event
                    ) => {
                      setSortBy(
                        event.target
                          .value as SortKey
                      );

                      setCurrentPage(
                        1
                      );
                    }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors bg-white text-gray-700 font-medium text-sm w-full sm:w-auto"
                  >
                    {sortOptions.map(
                      (option) => (
                        <option
                          key={option}
                          value={option}
                        >
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* ============================= */}
            {/* EMPTY STATE / COURSE RESULTS */}
            {/* ============================= */}

            {filteredCourses.length ===
            0 ? (
              <div className="flex min-h-[380px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">

                {/* Icon */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>

                {/* Empty database */}
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {courses.length ===
                  0
                    ? "No Courses Available Yet"
                    : "No Courses Found"}
                </h3>

                <p className="max-w-md text-sm leading-6 text-gray-500">
                  {courses.length ===
                  0
                    ? "Courses will appear here once they are added."
                    : "No courses match your current search or filters. Try changing or clearing your filters."}
                </p>

                {/* Only show Clear Filters
                    when courses actually exist */}
                {courses.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      clearAllFilters
                    }
                    className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 lg:mb-12">
                  {filteredCourses.map(
                    (course) => (
                      <CourseCard
                        key={
                          course.id
                        }
                        course={{
                          ...course,

                          rating:
                            course
                              .rating?.[0]
                              ?.rating ??
                            0,

                          reviews:
                            course.rating
                              ?.length
                              ? `${course.rating.length} Reviews`
                              : "0 Reviews",
                        }}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>

                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(
                          event
                        ) => {
                          event.preventDefault();

                          setCurrentPage(
                            (page) =>
                              Math.max(
                                1,
                                page -
                                  1
                              )
                          );
                        }}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {paginationPages.map(
                      (
                        page,
                        index
                      ) => {
                        const previousPage =
                          paginationPages[
                            index -
                              1
                          ];

                        const showEllipsis =
                          previousPage &&
                          page -
                            previousPage >
                            1;

                        return (
                          <PaginationItem
                            key={
                              page
                            }
                          >
                            {showEllipsis ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                href="#"
                                isActive={
                                  page ===
                                  currentPage
                                }
                                onClick={(
                                  event
                                ) => {
                                  event.preventDefault();

                                  setCurrentPage(
                                    page
                                  );
                                }}
                              >
                                {
                                  page
                                }
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        );
                      }
                    )}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(
                          event
                        ) => {
                          event.preventDefault();

                          setCurrentPage(
                            (page) =>
                              Math.min(
                                totalPages,
                                page +
                                  1
                              )
                          );
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
            <PropagateLoader
              color="#7E23FE"
              loading={true}
              size={15}
            />
          </div>
        }
      >
        <CoursesContent />
      </Suspense>

      <Footer />
    </>
  );
}
