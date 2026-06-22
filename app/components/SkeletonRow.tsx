export default function SkeletonRow() {
  return (
    <div className="py-2">
      {/* Label */}
      <div className="px-6 sm:px-10 lg:px-16 mb-4">
        <div className="skeleton h-5 w-40 rounded-lg" />
      </div>
      {/* Cards */}
      <div className="flex gap-3 px-6 sm:px-10 lg:px-16 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[160px] sm:w-[190px] lg:w-[220px] aspect-[2/3] skeleton rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
