"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

export default function ExamListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseName = searchParams.get("title");

  const handleCreateExam = () => {
    router.push("/admin/exam/createExam");
  };

  return (
    <div>
      {/* Header */}
      <Card className="bg-white border-0 shadow-sm mb-6 p-6">
        <h1 className="text-xl font-bold text-gray-900">
          Manage Exams - {courseName}
        </h1>
      </Card>

      {/* Empty state */}
      <Card className="bg-white border-0 shadow-sm py-12 px-6">
        <div className="text-center space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            No exams created yet
          </h2>
          <p className="text-sm text-gray-500">
            Get started by creating your first exam for this course.
          </p>
          <div className="pt-4">
            <Button
              className="bg-primary hover:bg-primary/90 text-white rounded-lg"
              onClick={() => handleCreateExam()}
            >
              + Create Exam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
