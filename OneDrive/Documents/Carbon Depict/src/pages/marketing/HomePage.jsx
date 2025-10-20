import Hero from '@molecules/Hero'
import FeatureCard from '@molecules/FeatureCard'
import { BarChart3, Leaf, FileText, Users, Globe, Zap } from '@atoms/Icon'
import { PrimaryButton } from '@atoms/Button'
import { Link } from 'react-router-dom'

/**
 * HomePage - Main marketing landing page
 */
export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: 'Precision Tracking',
      description:
        'Track emissions across all scopes with DEFRA 2025 factors. WRI-compliant calculations for accurate reporting.',
    },
    {
      icon: Leaf,
      title: 'Multiple Categories',
      description:
        'Support for Agriculture, Fleet, Energy, Food Industry, and more. Customizable for your business needs.',
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description:
        'Generate detailed PDF/CSV reports with transparent methodology and uncertainty disclosures.',
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description:
        'Company accounts with role-based access. Perfect for teams and enterprise organizations.',
    },
    {
      icon: Globe,
      title: 'Global Adaptability',
      description:
        'Built for South East Asia, Africa, and beyond. Support for Excel imports and manual data entry.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description:
        'Smart inference for vehicle types, equipment specs, and regional factors. Get suggestions automatically.',
    },
  ]

  const certifications = [
    'Carbon Footprint®',
    'Life cycle analysis',
    'CSRD',
    'CBAM',
    'SBTi',
    'TCFD & IFRS',
    'GRI',
    "SDG's",
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero
        title="Measure, reduce, report — with precision."
        subtitle="CarbonDepict gives you transparent, auditable carbon insights. Track emissions across your operations with WRI-compliant methodology and DEFRA 2025 factors."
        primaryCTA={{
          text: 'Request Demo',
          onClick: () => console.log('Demo requested'),
          showArrow: true,
        }}
        secondaryCTA={{
          text: 'Try Calculator',
          onClick: () => (window.location.href = '/dashboard/emissions'),
        }}
        showScrollIndicator
        backgroundPattern
      />

      {/* Features Section */}
      <section className="py-20 bg-cd-surface">
        <div className="container-cd">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cd-text md:text-4xl">
              Everything you need for carbon accounting
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-cd-muted">
              Built with the World Resources Institute framework and DEFRA emission factors.
              Accessible for everyone, from high school students to enterprise teams.
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

      {/* Certifications Section */}
      <section className="py-20 bg-white">
        <div className="container-cd">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-cd-text md:text-4xl">
              Compliant with global standards
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-cd-muted">
              Our methodology aligns with leading frameworks and certifications
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="rounded-lg border border-cd-border bg-white px-6 py-3 text-sm font-medium text-cd-midnight shadow-cd-sm"
              >
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cd-midnight text-white">
        <div className="container-cd text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to start tracking your emissions?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cd-desert">
            Join organizations worldwide using CarbonDepict for precise, transparent carbon
            accounting.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <PrimaryButton className="bg-white text-cd-midnight hover:bg-cd-desert">
                Get Started Free
              </PrimaryButton>
            </Link>
            <Link to="/pricing">
              <button className="rounded-lg border-2 border-white px-6 py-3 font-medium transition-colors hover:bg-white/10">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
