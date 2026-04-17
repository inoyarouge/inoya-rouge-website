export default function TestimonialsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-800">Testimonials</h1>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="w-20 h-9 bg-gray-100 rounded"></div>
        <div className="w-20 h-9 bg-gray-100 rounded"></div>
        <div className="w-20 h-9 bg-gray-100 rounded"></div>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="w-full h-12 bg-gray-50 border-b border-gray-200"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-14 border-b border-gray-100 flex items-center px-4 gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
