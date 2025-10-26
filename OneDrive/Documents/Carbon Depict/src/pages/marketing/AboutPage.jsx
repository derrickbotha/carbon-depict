// Cache bust 2025-10-23
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container-cd">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold text-cd-text md:text-5xl">
            About CarbonDepict
          </h1>

          <div className="prose prose-lg">
            <p className="text-lg leading-relaxed text-cd-muted">
              CarbonDepict is a precision carbon emission tracking tool built on the framework
              established by the World Resources Institute (WRI). We provide transparent,
              auditable greenhouse gas (GHG) calculations using DEFRA 2025 emission factors.
            </p>

            <h2 className="mt-12 mb-4 text-2xl font-bold text-cd-text">Our Mission</h2>
            <p className="text-cd-muted">
              To empower organizations worldwide—from high schools to multinational
              corporations—with accessible, accurate carbon accounting tools. We believe
              transparency and precision are essential for meaningful climate action.
            </p>

            <h2 className="mt-12 mb-4 text-2xl font-bold text-cd-text">Methodology</h2>
            <p className="text-cd-muted">
              Our calculations follow WRI principles of relevance, completeness, consistency,
              transparency, and accuracy. We cover all three scopes of emissions:
            </p>
            <ul className="mt-4 space-y-2 text-cd-muted">
              <li><strong>Scope 1:</strong> Direct emissions from owned sources</li>
              <li><strong>Scope 2:</strong> Indirect emissions from purchased energy</li>
              <li><strong>Scope 3:</strong> All other indirect emissions in the value chain</li>
            </ul>

            <h2 className="mt-12 mb-4 text-2xl font-bold text-cd-text">Global Adaptability</h2>
            <p className="text-cd-muted">
              Designed for regions with varying data infrastructure, CarbonDepict supports Excel
              imports, manual entry, and custom emission factors. We're committed to serving
              organizations in South East Asia, Africa, and beyond.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

