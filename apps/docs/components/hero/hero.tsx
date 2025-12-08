const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function Hero() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 py-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6">Virtual Grid</h1>
        <div className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
          A React hook-based library for efficient grid virtualization
        </div>
        <div className="flex justify-center gap-4">
          <a href={`${basePath}/docs/getting-started`} className="px-6 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}
