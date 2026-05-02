export default function ProductDetailLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-8 md:py-12">
      <div className="h-4 w-40 bg-gray-200 animate-pulse mb-6" />
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[60%_40%] gap-8 md:gap-12">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 animate-pulse" />
        <div className="space-y-5">
          <div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
          <div className="h-5 w-1/3 bg-gray-200 animate-pulse" />
          <div className="h-6 w-1/4 bg-gray-200 animate-pulse" />
          <div className="h-px w-full bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-32 bg-gray-200 animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="h-12 w-full bg-gray-200 animate-pulse" />
          <div className="space-y-2 pt-4">
            <div className="h-10 w-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 animate-pulse" />
            <div className="h-10 w-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
