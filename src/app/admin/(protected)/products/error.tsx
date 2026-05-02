'use client'

import { useEffect } from 'react'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('Products page error')
  }, [error])

  return (
    <div className="p-8 text-center">
      <p className="text-red-600 mb-4">Something went wrong loading this page.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-brand-rose text-white text-sm rounded hover:bg-brand-rose/90"
      >
        Try again
      </button>
    </div>
  )
}
