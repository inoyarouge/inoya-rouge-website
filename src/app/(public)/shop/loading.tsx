export default function ShopLoading() {
  return (
    <div>
      <section className="w-full h-[400px] md:h-[442px] 2xl:h-[560px] bg-gray-200 animate-pulse" />
      <section className="bg-[#FFF3EE]">
        <div className="site-container px-6 lg:px-16 pt-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
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
