"use client";

import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CourseShareDialogProps {
  courseTitle?: string;
  courseId?: string;
}

export function CourseShareDialog({
  courseTitle,
  courseId,
}: CourseShareDialogProps) {
  const [courseLink, setCourseLink] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !courseId) return;

    setCourseLink(`${window.location.origin}/course-details/${courseId}`);
  }, [courseId]);

  const handleCopyLink = async () => {
    if (!courseLink) {
      toast.error("Course link is not ready yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(courseLink);
      toast.success("Course link copied.");
    } catch {
      toast.error("Failed to copy course link.");
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full border border-gray-300 text-gray-700 hover:border-primary hover:text-primary font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Share2 size={18} />
          Share Course
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share this course</DialogTitle>
          <DialogDescription>
            Send this course to someone or copy the link to share it anywhere.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Course link
          </p>
          <p className="break-all text-sm text-gray-700">
            {courseLink || "Generating course link..."}
          </p>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            disabled={!courseLink}
          >
            <Copy />
            Copy Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
