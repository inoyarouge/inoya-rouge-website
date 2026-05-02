export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 animate-pulse" />
      <section className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        <div className="h-8 w-64 bg-gray-200 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[211/264] bg-gray-200 animate-pulse" />
              <div className="h-5 bg-gray-200 animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 animate-pulse w-1/4" />
              <div className="h-9 bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
