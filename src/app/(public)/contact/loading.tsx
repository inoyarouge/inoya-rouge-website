export default function ContactLoading() {
  return (
    <div className="max-w-[900px] mx-auto px-6 lg:px-16 py-16 space-y-8">
      <div className="h-10 w-1/2 bg-gray-200 animate-pulse" />
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-12 w-full bg-gray-200 animate-pulse" />
        <div className="h-12 w-full bg-gray-200 animate-pulse" />
        <div className="h-32 w-full bg-gray-200 animate-pulse" />
        <div className="h-12 w-40 bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}
