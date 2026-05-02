export default function ShopLoading() {
  return (
    <div>
      <section className="w-full h-[400px] md:h-[442px] bg-gray-200 animate-pulse" />
      <section className="bg-[#FFF3EE]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i}>
                <div className="aspect-[211/264] bg-gray-200 animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 animate-pulse" />
                  <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
                  <div className="h-[38px] bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
