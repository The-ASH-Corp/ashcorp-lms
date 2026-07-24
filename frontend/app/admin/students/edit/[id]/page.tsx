"use client";

import { useParams } from "next/navigation";
import { PropagateLoader } from "react-spinners";
import { StudentForm } from "@/components/admin/student/student-form";
import { useGetStudentByIdQuery } from "@/lib/redux/features/student/studentApi";

export default function EditStudentPage() {
  const params = useParams<{ id?: string }>();
  const studentId = params?.id ?? "";
  const { data, isLoading, isError } = useGetStudentByIdQuery(studentId, {
    skip: !studentId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={15} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm font-medium text-red-600">Unable to load student details.</p>
      </div>
    );
  }

  return (
    <StudentForm
      mode="edit"
      studentId={studentId}
      initialValues={{
        name: data.name,
        email: data.email,
        phone: String(data.phone),
      }}
    />
  );
}
