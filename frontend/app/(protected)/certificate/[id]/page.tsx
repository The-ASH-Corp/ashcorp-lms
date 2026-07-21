'use client';

import { Download, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { PropagateLoader } from 'react-spinners';
import { useGetCurrentUserQuery } from '@/lib/redux/features/auth/authApi';
import { useGetCourseQuery } from '@/lib/redux/features/course/courseApi';

export default function CertificatePage() {
  const route = useRouter()
  const params = useParams() as { id?: string };
  const courseId = params.id ?? "";
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const { data: course } = useGetCourseQuery(courseId);

  const certificate = user?.certificates?.find(
    (certificate) => certificate.courseId === courseId
  );

  const canViewCertificate = !!certificate;
  const certificateLink = certificate?.link;


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if (!canViewCertificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Certificate locked</h1>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Pass the course exam to unlock this certificate.
          </p>
          <button
            type="button"
            onClick={() => route.push(`/exam/assessment/${courseId}`)}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Attend Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="px-8 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => route.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          BACK
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-fill mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Section - Certificate */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Certificate of Achievement
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Congratulations on successfully completing{" "}
                <span className="font-semibold text-gray-900">
                  {course?.title}
                </span>

              </p>
            </div>

            {/* Certificate Display */}
            <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl p-6 sm:p-8 lg:p-12 mb-8 lg:mb-12 border border-violet-100">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
                {/* Certificate Content */}
                {certificateLink && (certificateLink.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={certificateLink} className="w-full h-[600px]" />
                ) : (
                  <img src={certificateLink} alt="Certificate" className="w-full h-auto max-h-[600px] object-contain" />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <a href={certificateLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                <Download size={20} />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Download</span>
              </a>

            </div>
          </div>

          {/* Right Section - Course Details */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-xl p-6 sm:p-8 border border-violet-100 sticky top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                Course Details
              </h2>

              {/* Detail Items */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Instructor
                  </p>
                  <p className="text-gray-900 font-medium">{course?.instructor}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Final Score
                  </p>
                  <p className="text-gray-900 font-medium">
                    {user?.examAttempts?.score}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Issued Date
                  </p>
                  <p className="text-gray-900 font-medium">{new Date(user?.examAttempts?.attemptedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
