interface StatCardProps {
  label: string;
  number: string;
  unit?: string;
  description: string;
  detail: string;
}

export default function StatCard({ label, number, unit, description, detail }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8">
      <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
        {label}
      </p>
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">{number}</span>
          {unit && <span className="text-2xl sm:text-3xl text-gray-600 font-semibold">{unit}</span>}
        </div>
        {description && (
          <p className="text-sm sm:text-base text-gray-600 mt-2">{description}</p>
        )}
      </div>
      <p className="text-xs sm:text-sm text-gray-600">{detail}</p>
    </div>
  );
}
