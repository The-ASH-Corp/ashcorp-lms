"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Search, Sliders, Database, Sparkles, X, Edit3 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  useGetAllCourseQuery,
  useUpdateCourseRatingMutation,
} from "@/lib/redux/features/course/courseApi";
import { Course } from "@/lib/redux/features/course/courseSlice";
import { PropagateLoader } from "react-spinners";
import { CourseRatingDialog } from "@/components/admin/course/CourseRatingDialog";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CourseRatingsPageSettings() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInitialSource, setDialogInitialSource] = useState<"db" | "admin" | undefined>(undefined);

  const { data: courses = [], isLoading, isError } = useGetAllCourseQuery();
  const [updateCourseRating, { isLoading: isUpdatingRating }] =
    useUpdateCourseRatingMutation();

  const filteredCourses = useMemo(() => {
    if (!searchInput.trim()) return courses;
    const term = searchInput.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.instructor.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
    );
  }, [courses, searchInput]);

  const handleOpenRatingDialog = (course: Course, initialSource?: "db" | "admin") => {
    setSelectedCourse(course);
    setDialogInitialSource(initialSource);
    setIsDialogOpen(true);
  };

  const handleQuickSwitchToDb = async (course: Course) => {
    try {
      await updateCourseRating({
        id: course.id,
        ratingSource: "db",
        staticRating: course.staticRating ?? 0,
        staticRatingCount: course.staticRatingCount ?? 0,
        staticEnrolledCount: course.staticEnrolledCount ?? 0,
      }).unwrap();
      toast.success(`"${course.title}" now using Live DB ratings and enrollment count`);
    } catch {
      toast.error("Failed to switch course rating source");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-3.5 ${
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : i < rating
            ? "fill-amber-400/50 text-amber-400"
            : "text-slate-200"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <h1 className="text-2xl font-bold text-gray-900">
          Failed to load courses for rating settings
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 mb-1">
            <span>Page Settings</span>
            <span>•</span>
            <span>Course Rating Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <Star className="size-6 text-amber-500 fill-amber-400" />
            Course Rating Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control whether each course reads its rating live from MongoDB user reviews or displays a static score set by admin.
          </p>
        </div>

        <Link href="/admin/course">
          <Button variant="outline" className="rounded-xl border-slate-200">
            View All Courses
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
            <Star className="size-5 fill-violet-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Courses</p>
            <h3 className="text-xl font-bold text-slate-900">{courses.length}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <Database className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Using Live DB Ratings</p>
            <h3 className="text-xl font-bold text-slate-900">
              {courses.filter((c) => c.ratingSource !== "admin").length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs flex items-center gap-3.5">
          <div className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-600">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Using Admin Static Ratings</p>
            <h3 className="text-xl font-bold text-slate-900">
              {courses.filter((c) => c.ratingSource === "admin").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <Card className="border-0 shadow-sm bg-white overflow-hidden p-4 space-y-4">
        <div className="max-w-md">
          <InputGroup>
            <InputGroupInput
              placeholder="Search course title, category or instructor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                <Search className="h-4 w-4" />
              </Button>
              {searchInput && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  type="button"
                  onClick={() => setSearchInput("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center w-12">
                #
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Course Details
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Live DB Data
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Admin Static Data
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Current Active Source
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Public Rating
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                  No courses found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course, index) => {
                const isStatic = course.ratingSource === "admin";
                const dbRatingsCount = course.rating?.length ?? 0;
                const dbAvgRating =
                  dbRatingsCount > 0
                    ? course.rating.reduce((sum, item) => sum + item.rating, 0) /
                      dbRatingsCount
                    : 0;
                const dbEnrolledCount = course.enrolledStudents?.length ?? 0;

                const effectiveRating = isStatic
                  ? Number(course.staticRating || 0)
                  : dbAvgRating;

                const effectiveCount = isStatic
                  ? Number(course.staticRatingCount ?? 0)
                  : dbRatingsCount;

                const effectiveEnrolled = isStatic
                  ? Number(course.staticEnrolledCount ?? 0)
                  : dbEnrolledCount;

                return (
                  <TableRow
                    key={course.id}
                    className="hover:bg-violet-50/30 transition-colors border-b border-gray-50"
                  >
                    <TableCell className="text-center text-sm font-semibold text-gray-900">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-slate-400 text-xs font-bold">
                              No Pic
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course.category} • {course.instructor}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Live DB Data */}
                    <TableCell className="text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-800">
                          {dbAvgRating.toFixed(1)} / 5.0
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {dbRatingsCount} reviews • {dbEnrolledCount} enrolled
                        </span>
                      </div>
                    </TableCell>

                    {/* Admin Static Data */}
                    <TableCell className="text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-800">
                          {Number(course.staticRating || 0).toFixed(1)} / 5.0
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {course.staticRatingCount ?? 0} reviews • {course.staticEnrolledCount ?? 0} enrolled
                        </span>
                      </div>
                    </TableCell>

                    {/* Active Source Badge */}
                    <TableCell className="text-center">
                      {isStatic ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                          <Sliders className="size-3" />
                          Admin Static
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <Database className="size-3" />
                          Live DB
                        </span>
                      )}
                    </TableCell>

                    {/* Public Display */}
                    <TableCell className="text-center">
                      <div className="inline-flex flex-col items-center gap-0.5">
                        <div className="flex gap-0.5">
                          {renderStars(effectiveRating)}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {effectiveRating.toFixed(1)} ({effectiveCount})
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {effectiveEnrolled} enrolled
                        </span>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-center">
                      {isStatic ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRatingDialog(course, "admin")}
                            className="rounded-xl border-violet-200 bg-violet-50/50 text-violet-700 hover:bg-violet-100 hover:text-violet-800 h-8 px-3 text-xs font-semibold cursor-pointer"
                          >
                            <Edit3 className="size-3.5 mr-1.5" />
                            Edit Rating & Stats
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleQuickSwitchToDb(course)}
                            disabled={isUpdatingRating}
                            title="Revert course to real student reviews and enrollments from database"
                            className="rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2 text-xs cursor-pointer"
                          >
                            <Database className="size-3 mr-1" />
                            Use Live DB
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRatingDialog(course, "admin")}
                            className="rounded-xl border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 h-8 px-3 text-xs font-medium cursor-pointer"
                          >
                            <Sliders className="size-3.5 mr-1.5 text-violet-600" />
                            Switch to Static
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Rating Configuration Dialog */}
      <CourseRatingDialog
        course={selectedCourse}
        isOpen={isDialogOpen}
        initialSource={dialogInitialSource}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCourse(null);
          setDialogInitialSource(undefined);
        }}
      />
    </div>
  );
}

