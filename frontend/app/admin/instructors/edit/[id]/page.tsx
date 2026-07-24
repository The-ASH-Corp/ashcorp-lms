"use client";

import { useParams } from "next/navigation";
import { useGetInstructorByIdQuery } from "@/lib/redux/features/instructor/instructorApi";
import { InstructorForm } from "@/components/admin/instructor/instructor-form";
import { PropagateLoader } from "react-spinners";

export default function EditInstructorPage() {
  const params = useParams<{ id?: string }>();
  const instructorId = params?.id ?? "";
  const { data, isLoading, isError } = useGetInstructorByIdQuery(instructorId, {
    skip: !instructorId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <PropagateLoader color="#7E23FE" loading size={15} />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm font-medium text-red-600">Unable to load instructor details.</p>
      </div>
    );
  }

  return (
    <InstructorForm
      mode="edit"
      instructorId={instructorId}
      initialValues={{
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        instructorTitle: data.data.instructorTitle,
        about: data.data.about,
        isFeatured: data.data.isFeatured,
        verifyByDefault: data.data.verifyByDefault,
      }}
    />
  );
}
