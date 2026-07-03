'use client';

import { Download, ImageIcon, Share2, ArrowLeft } from 'lucide-react';

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button className="flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium text-sm">
          <ArrowLeft size={18} />
          BACK TO LEARNING PATH
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Section - Certificate */}
          <div className="lg:col-span-2">
            {/* Title */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Certificate of Achievement
              </h1>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Congratulations on successfully completing <span className="font-semibold text-gray-900">Mastering Full-Stack Development</span>. This credential validates your expertise in modern engineering practices.
              </p>
            </div>

            {/* Certificate Display */}
            <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl p-6 sm:p-8 lg:p-12 mb-8 lg:mb-12 border border-violet-100">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
                {/* Certificate Content */}
                <div className="bg-linear-to-br from-slate-900 via-violet-900 to-slate-900 rounded-lg p-6 sm:p-8 text-center min-h-80 sm:min-h-96 flex flex-col justify-between relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative z-10">
                    <div className="text-amber-600 text-lg sm:text-xl font-semibold tracking-widest mb-2">
                      CERTIFICATE
                    </div>
                    <div className="text-amber-600 text-base sm:text-lg tracking-wide mb-6">
                      OF COMPLETION
                    </div>

                    {/* Name */}
                    <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                      ALEX RIVERA
                    </div>

                    {/* Course Title */}
                    <div className="text-amber-600 text-sm sm:text-base font-medium mb-8">
                      MASTERING FULL-STACK DEVELOPMENT
                    </div>

                    {/* Medal Badge */}
                    <div className="flex justify-center mb-8">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-500 flex items-center justify-center bg-linear-to-br from-amber-400 to-amber-600 shadow-lg">
                        <div className="text-2xl">🏅</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-gray-300 text-sm mb-8">
                      October 15, 2024
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-around text-gray-400 text-xs sm:text-sm">
                      <div>
                        <div className="mb-2 text-amber-600 font-script text-lg">Ash Academy</div>
                        <div>Director, Ash Academy</div>
                      </div>
                      <div>
                        <div className="mb-2 text-amber-600 font-script text-lg">Dr. Aris</div>
                        <div>Instructor</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                <Download size={20} />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-violet-600 hover:text-violet-600 transition-colors font-medium">
                <ImageIcon size={20} />
                <span className="hidden sm:inline">Download PNG</span>
                <span className="sm:hidden">PNG</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-violet-600 hover:text-violet-600 transition-colors font-medium">
                <Share2 size={20} />
                <span className="hidden sm:inline">Share to LinkedIn</span>
                <span className="sm:hidden">LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Right Section - Course Details */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-xl p-6 sm:p-8 border border-violet-100 sticky top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Course Details</h2>

              {/* Detail Items */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Instructor</p>
                  <p className="text-gray-900 font-medium">Dr. Aris Thorne</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Hours</p>
                  <p className="text-gray-900 font-medium">48h 12m</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Final Grade</p>
                  <p className="text-gray-900 font-medium">A+ (Exceeds Standard)</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Issued Date</p>
                  <p className="text-gray-900 font-medium">Oct 15, 2024</p>
                </div>

                <div className="border-t border-violet-200 pt-6">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Verification ID</p>
                  <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded border border-violet-200">
                    ASH-ACAD-FS-2024-X992-KLR
                  </p>
                </div>

                <div className="border-t border-violet-200 pt-6">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Skills Verified</p>
                  <div className="flex flex-wrap gap-2">
                    {['React Architecture', 'Node.js Scale', 'Cloud Infrastructure', 'CI/CD Pipelines'].map(skill => (
                      <span key={skill} className="text-xs bg-white text-violet-600 px-3 py-1 rounded-full border border-violet-200 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-violet-200 pt-6">
                  <p className="text-xs text-gray-600 italic mb-4">
                    This certificate is widely recognized by our network of 500+ global hiring partners.
                  </p>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-linear-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold">H</div>
                    <div className="w-6 h-6 bg-linear-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">L</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="mt-16 lg:mt-20 bg-linear-to-br from-violet-50 to-purple-50 rounded-2xl p-8 sm:p-12 border border-violet-100">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready for the Next Peak?</h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
              Your achievement in Full-Stack Development opens doors to our advanced specialization tracks. Continue your journey with 20% off your next certification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm">
                Explore Advanced Tracks
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-violet-600 hover:text-violet-600 transition-colors font-medium text-sm">
                View Learning Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
