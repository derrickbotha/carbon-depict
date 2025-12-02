import Hero from '@molecules/Hero'
import FeatureCard from '@molecules/FeatureCard'
import { BarChart3, Leaf, FileText, Users, Globe, Zap, Shield, Target, TrendingUp, CheckCircle, Building2, Award } from '@atoms/Icon'
import { PrimaryButton } from '@atoms/Button'
import { Link } from 'react-router-dom'

/**
 * HomePage - Main marketing landing page with ESG focus
 */
export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Precision Emissions Tracking',
      description:
        'Track emissions across all scopes with DEFRA 2025 factors. WRI-compliant calculations for accurate carbon reporting.',
    },
    {
      icon: Shield,
      title: 'ESG Compliance Framework',
      description:
        'Align with GRI, TCFD, CDP, SASB, and SDGs. AI-powered compliance checking ensures your data meets global standards.',
    },
    {
      icon: Target,
      title: 'Sustainability Metrics',
      description:
        'Measure environmental, social, and governance performance. Track progress toward net-zero and sustainability goals.',
    },
    {
      icon: FileText,
      title: 'Comprehensive ESG Reports',
      description:
        'Generate detailed sustainability reports with transparent methodology. Export to PDF, CSV, or industry-standard formats.',
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder Platform',
      description:
        'Role-based access for teams, auditors, and stakeholders. Collaborate on ESG data collection and reporting.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description:
        'Real-time compliance validation, predictive analytics, and automated recommendations for improvement.',
    },
  ]

  const esgCapabilities = [
    {
      icon: Leaf,
      title: 'Environmental',
      metrics: ['Carbon Emissions', 'Energy Usage', 'Water Consumption', 'Waste Management', 'Biodiversity Impact'],
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      icon: Users,
      title: 'Social',
      metrics: ['Labor Practices', 'Human Rights', 'Community Impact', 'Diversity & Inclusion', 'Health & Safety'],
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      icon: Building2,
      title: 'Governance',
      metrics: ['Board Composition', 'Ethics & Compliance', 'Risk Management', 'Transparency', 'Stakeholder Engagement'],
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ]

  const certifications = [
    { name: 'GRI Standards', description: 'Global Reporting Initiative' },
    { name: 'TCFD', description: 'Task Force on Climate-related Financial Disclosures' },
    { name: 'CDP', description: 'Carbon Disclosure Project' },
    { name: 'SASB', description: 'Sustainability Accounting Standards Board' },
    { name: 'SDGs', description: 'UN Sustainable Development Goals' },
    { name: 'SBTi', description: 'Science Based Targets initiative' },
    { name: 'CSRD', description: 'Corporate Sustainability Reporting Directive' },
    { name: 'CBAM', description: 'Carbon Border Adjustment Mechanism' },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        title="Measure, Report, Transform — Your Complete ESG Platform"
        subtitle="CarbonDepict delivers transparent, auditable carbon and ESG insights. Track emissions, measure sustainability metrics, and ensure compliance with global frameworks using AI-powered validation."
        primaryCTA={{
          text: 'Start Free Trial',
          onClick: () => (window.location.href = '/register'),
          showArrow: true,
        }}
        secondaryCTA={{
          text: 'Explore Platform',
          onClick: () => (window.location.href = '/dashboard'),
        }}
        showScrollIndicator
        backgroundPattern
      />

      {/* ESG Pillars Section */}
      <section className="py-20 bg-gradient-to-b from-white to-cd-surface">
        <div className="container-cd">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cd-text md:text-4xl">
              Complete ESG Management Platform
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-cd-muted">
              Track and report across all three pillars of sustainability with AI-powered compliance checking
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {esgCapabilities.map((pillar) => {
              const IconComponent = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-xl border-2 bg-white p-8 shadow-lg transition-transform hover:scale-105"
                >
                  <div className={`mb-4 inline-flex items-center rounded-lg border-2 p-3 ${pillar.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-cd-text">{pillar.title}</h3>
                  <ul className="space-y-2">
                    {pillar.metrics.map((metric) => (
                      <li key={metric} className="flex items-start">
                        <CheckCircle className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-cd-muted">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cd-surface">
        <div className="container-cd">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cd-text md:text-4xl">
              Powerful features for modern sustainability
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-cd-muted">
              Built with WRI framework, DEFRA emission factors, and AI-powered compliance validation.
              Enterprise-ready, accessible for everyone.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
              >
                {feature.description}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      {/* AI Compliance Section */}
      <section className="py-20 bg-gradient-to-br from-cd-teal to-cd-midnight text-white">
        <div className="container-cd">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                🤖 AI-Powered
              </div>
              <h2 className="mb-6 text-4xl font-bold">
                Real-Time Compliance Validation
              </h2>
              <p className="mb-6 text-lg text-white/90">
                Our AI compliance engine analyzes your ESG data against multiple frameworks simultaneously, 
                providing instant feedback and recommendations to ensure accuracy and completeness.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Framework Analysis:</strong> Compare against GRI, TCFD, CDP, SASB, and SDGs
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Compliance Scoring:</strong> Get detailed scores with actionable improvement suggestions
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-400">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-white">Draft Workflow:</strong> Review and approve data before publishing to stakeholders
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-2xl">
              <div className="mb-4 text-center">
                <Award className="mx-auto mb-2 h-16 w-16 text-cd-teal" />
                <h3 className="text-xl font-bold text-cd-text">Compliance Score</h3>
              </div>
              <div className="mb-6 text-center">
                <div className="text-6xl font-bold text-green-600">94%</div>
                <p className="text-sm text-cd-muted">Average across all frameworks</p>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-cd-text">GRI Standards</span>
                    <span className="text-cd-muted">96%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '96%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-cd-text">TCFD</span>
                    <span className="text-cd-muted">92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-cd-text">CDP</span>
                    <span className="text-cd-muted">95%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-cd-text">SDGs</span>
                    <span className="text-cd-muted">93%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '93%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-white">
        <div className="container-cd">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cd-text md:text-4xl">
              Compliant with global ESG standards
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-cd-muted">
              Our platform aligns with leading frameworks and certifications for comprehensive ESG reporting
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="group rounded-lg border-2 border-cd-border bg-white p-6 text-center shadow-cd-sm transition-all hover:border-cd-forest hover:shadow-cd-md"
              >
                <div className="mb-2 text-lg font-bold text-cd-midnight group-hover:text-cd-forest">
                  {cert.name}
                </div>
                <div className="text-sm text-cd-muted">{cert.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-cd-surface">
        <div className="container-cd">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-5xl font-bold text-cd-forest">5+</div>
              <div className="text-lg text-cd-muted">ESG Frameworks</div>
            </div>
            <div>
              <div className="mb-2 text-5xl font-bold text-cd-forest">50+</div>
              <div className="text-lg text-cd-muted">Sustainability Metrics</div>
            </div>
            <div>
              <div className="mb-2 text-5xl font-bold text-cd-forest">100%</div>
              <div className="text-lg text-cd-muted">AI-Powered Validation</div>
            </div>
            <div>
              <div className="mb-2 text-5xl font-bold text-cd-forest">24/7</div>
              <div className="text-lg text-cd-muted">Real-Time Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cd-midnight text-white">
        <div className="container-cd text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to transform your sustainability reporting?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cd-desert">
            Join organizations worldwide using CarbonDepict for precise, transparent carbon and ESG management.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <PrimaryButton className="bg-white text-cd-midnight hover:bg-cd-desert">
                Start Free Trial
              </PrimaryButton>
            </Link>
            <Link to="/api-test">
              <button className="rounded-lg border-2 border-white px-6 py-3 font-medium transition-colors hover:bg-white/10">
                View API Demo
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
