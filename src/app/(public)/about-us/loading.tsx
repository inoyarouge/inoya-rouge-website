export default function OurStoryLoading() {
  return (
    <div className="max-w-[900px] mx-auto px-6 lg:px-16 py-16 space-y-8">
      <div className="h-10 w-2/3 bg-gray-200 animate-pulse" />
      <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-11/12 bg-gray-200 animate-pulse" />
        <div className="h-4 w-10/12 bg-gray-200 animate-pulse" />
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-9/12 bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}
