const badges = [
  'Cruelty-Free',
  'Skin-Friendly',
  'Paraben Conscious',
  'Inspired by Nature',
  'Made for Indian Skin',
]

export default function TrustBadges() {
  return (
    <div className="border-y border-gray-100 py-5 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-gray-500 font-medium">
        {badges.map((badge, i) => (
          <span key={badge} className="flex items-center gap-4">
            {i > 0 && <span className="hidden sm:inline text-gray-200">·</span>}
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
