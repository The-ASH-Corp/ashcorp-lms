"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { Course } from "@/lib/redux/features/course/courseSlice";
import { useUpdateCourseRatingMutation } from "@/lib/redux/features/course/courseApi";
import { CourseRatingConfigCard, CourseRatingConfig } from "./CourseRatingConfigCard";
import { toast } from "sonner";

interface CourseRatingDialogProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  initialSource?: "db" | "admin";
}

export function CourseRatingDialog({
  course,
  isOpen,
  onClose,
  initialSource,
}: CourseRatingDialogProps) {
  const [updateCourseRating, { isLoading: isUpdating }] =
    useUpdateCourseRatingMutation();

  const [ratingConfig, setRatingConfig] = useState<CourseRatingConfig>({
    ratingSource: (initialSource ?? course?.ratingSource ?? "db") as "db" | "admin",
    staticRating: course?.staticRating ?? 0,
    staticRatingCount: course?.staticRatingCount ?? 0,
    staticEnrolledCount: course?.staticEnrolledCount ?? 0,
  });

  React.useEffect(() => {
    if (course) {
      setRatingConfig({
        ratingSource: (initialSource ?? course.ratingSource ?? "db") as "db" | "admin",
        staticRating: course.staticRating ?? 0,
        staticRatingCount: course.staticRatingCount ?? 0,
        staticEnrolledCount: course.staticEnrolledCount ?? 0,
      });
    }
  }, [course, initialSource]);

  if (!course) return null;

  const dbRatingsCount = course.rating?.length ?? 0;
  const dbAvgRating =
    dbRatingsCount > 0
      ? course.rating.reduce((sum, item) => sum + item.rating, 0) /
        dbRatingsCount
      : 0;
  const dbEnrolledCount = course.enrolledStudents?.length ?? 0;

  const handleSave = async () => {
    try {
      await updateCourseRating({
        id: course.id,
        ratingSource: ratingConfig.ratingSource,
        staticRating: ratingConfig.staticRating,
        staticRatingCount: ratingConfig.staticRatingCount,
        staticEnrolledCount: ratingConfig.staticEnrolledCount,
      }).unwrap();

      toast.success("Course rating and stats updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update course rating settings");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Star className="size-5 fill-amber-400 text-amber-500" />
            Manage Course Rating & Stats: {course.title}
          </DialogTitle>
          <DialogDescription>
            Switch between Live DB metrics from actual student reviews & enrollments or show static custom values set by admin.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <CourseRatingConfigCard
            value={ratingConfig}
            onChange={setRatingConfig}
            dbRating={dbAvgRating}
            dbReviewsCount={dbRatingsCount}
            dbEnrolledCount={dbEnrolledCount}
            courseTitle={course.title}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-primary hover:bg-violet-700 text-white"
          >
            {isUpdating && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save Rating Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
