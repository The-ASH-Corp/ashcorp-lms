
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Paintbrush } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import ExploreCategories from "@/components/landing/ExploreCategories";
import TrendingWorkshops from "@/components/landing/TrendingWorkshops";
import Stats from "@/components/landing/Stats";
import Partners from "@/components/landing/Graduates";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";
import {
  useGetAllCategoriesQuery,
  type Category,
} from "@/lib/redux/features/category/categoryApi";
import { useGetAllCourseQuery } from "@/lib/redux/features/course/courseApi";
import type { Course } from "@/lib/redux/features/course/courseSlice";

type SearchResult =
  | {
      type: "course";
      id: string;
      title: string;
      subtitle: string;
    }
  | {
      type: "category";
      id: string;
      title: string;
      subtitle: string;
    };

const normalizeText = (value: string | undefined | null) =>
  value?.toLowerCase().trim() ?? "";

const getCategoryLabel = (category: Course["category"] | Category) => {
  if (typeof category === "string") {
    return category;
  }

  return category.categoryName;
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses = [] } = useGetAllCourseQuery();
  const { data: categories = [] } = useGetAllCategoriesQuery();

  const query = normalizeText(searchQuery);

  const searchResults = useMemo(() => {
    if (!query) return { courses: [], categories: [] };

    const courseResults: SearchResult[] = courses
      .filter((course) => {
        const title = normalizeText(course.title);
        const description = normalizeText(course.description);
        const instructor = normalizeText(course.instructor);
        const category = normalizeText(getCategoryLabel(course.category));

        return (
          title.includes(query) ||
          description.includes(query) ||
          instructor.includes(query) ||
          category.includes(query)
        );
      })
      .slice(0, 5)
      .map((course) => ({
        type: "course" as const,
        id: course.id,
        title: course.title,
        subtitle: `Course • ${course.instructor}`,
      }));

    const categoryResults: SearchResult[] = categories
      .filter((category) => {
        const categoryName = normalizeText(category.categoryName);
        const details = normalizeText(category.details);

        return categoryName.includes(query) || details.includes(query);
      })
      .slice(0, 5)
      .map((category) => ({
        type: "category" as const,
        id: category._id,
        title: category.categoryName,
        subtitle: "Category • Browse matching courses",
      }));

    return { courses: courseResults, categories: categoryResults };
  }, [categories, courses, query]);

  const hasResults =
    searchResults.courses.length > 0 || searchResults.categories.length > 0;

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/courses?category=${encodeURIComponent(categoryName)}`);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course-details/${courseId}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="relative isolate flex-1">
        <section className="relative z-40 overflow-visible bg-linear-to-b from-[#FAF5FF] via-[#F5F3FF] to-white py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full px-4 text-center sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="mb-8 inline-flex animate-bounce items-center gap-1.5 rounded-full bg-purple-50 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-purple-600/10 animation-duration-[2s]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl/tight">
              Master the Art of{" "}
              <span className="relative inline-block px-1 font-serif italic text-primary underline decoration-purple-300 decoration-wavy decoration-3">
                Creative Learning
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-500 sm:text-lg">
              Join 50k+ students building the future through design, code, and
              digital art.
              <br className="hidden sm:inline" /> Playful, structured, and
              community-driven.
            </p>

            <div className="mx-auto mt-10 max-w-2xl">
              <form
                className="relative"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <div className="flex items-center rounded-full border border-purple-100 bg-white p-2 shadow-xl shadow-purple-100/50 transition-all focus-within:ring-2 focus-within:ring-purple-500/20">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-indigo-950 placeholder-gray-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95"
                  >
                    Search
                  </button>
                </div>

                {query ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-120 max-h-96 overflow-y-auto rounded-3xl border border-purple-100 bg-white/95 p-4 text-left shadow-2xl shadow-purple-100/60 backdrop-blur">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Search results
                      </p>
                      <p className="text-xs text-gray-400">
                        {searchResults.courses.length +
                          searchResults.categories.length}{" "}
                        found
                      </p>
                    </div>

                    {!hasResults ? (
                      <p className="rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
                        No courses or categories matched your search.
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        {searchResults.categories.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                              Categories
                            </p>
                            <div className="grid gap-2">
                              {searchResults.categories.map((result) => (
                                <button
                                  key={result.id}
                                  type="button"
                                  onClick={() => handleCategoryClick(result.title)}
                                  className="flex w-full items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors hover:border-purple-200 hover:bg-purple-50"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-indigo-950">
                                      {result.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {result.subtitle}
                                    </p>
                                  </div>
                                  <span className="mt-0.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-purple-100">
                                    Filter
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.courses.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                              Courses
                            </p>
                            <div className="grid gap-2">
                              {searchResults.courses.map((result) => (
                                <button
                                  key={result.id}
                                  type="button"
                                  onClick={() => handleCourseClick(result.id)}
                                  className="flex w-full items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition-colors hover:border-purple-200 hover:bg-purple-50"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-indigo-950">
                                      {result.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {result.subtitle}
                                    </p>
                                  </div>
                                  <span className="mt-0.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-purple-100">
                                    Open
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </form>
            </div>

            <div className="absolute right-[12%] top-[60%] hidden animate-bounce lg:block animation-duration-[4s]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-purple-100">
                <Paintbrush className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-0">
          <ScrollReveal delay={0.05}>
            <ExploreCategories />
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <TrendingWorkshops />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Stats />
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <Partners />
          </ScrollReveal>
          <ScrollReveal delay={0.14}>
            <Testimonials />
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
