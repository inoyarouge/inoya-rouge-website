export default function CommunityLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-16 py-16 space-y-8">
      <div className="h-10 w-1/2 bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3 p-6 border border-gray-100">
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
