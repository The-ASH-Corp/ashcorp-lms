import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function Rules({ selectedExamTitle,disclaimerSeconds }: { selectedExamTitle: string|undefined; disclaimerSeconds: number }) {
  return (
    <div className="flex min-h-[calc(100vh-170px)] items-center justify-center bg-white px-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl p-[2px]">
        {/* Animated Border */}
        <motion.div
            className="absolute inset-[-100%]"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              background: `
            conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 300deg,
              rgba(139,92,246,.2) 315deg,
              #8B5CF6 330deg,
              #8B5CF6 350deg,
              transparent 360deg
            )
          `,
            }}
          />

          {/* Card */}
          <div className="relative rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-primary">
                <ShieldAlert size={26} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Exam Rules
                </p>

                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                  {selectedExamTitle}
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Your exam starts automatically in {disclaimerSeconds} second
                  {disclaimerSeconds === 1 ? "" : "s"}.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-gray-700">
              <div className="rounded-xl bg-gray-50 p-4">
                Do not open a new tab, switch apps, refresh, or navigate away.
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                If the screen changes, the exam stops immediately and your
                current progress is saved.
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                Submit only when you are finished. Your marks and pass/fail
                result are shown after submission.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}