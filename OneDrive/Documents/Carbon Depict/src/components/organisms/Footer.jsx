// Cache bust 2025-10-23
import { Link } from 'react-router-dom'
import { Mail, Globe, Leaf } from '@atoms/Icon'

/**
 * Footer - Site-wide footer component
 * Four-column layout on desktop, stacked on mobile
 */
export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Emissions Calculator', href: '/dashboard/emissions' },
        { label: 'Reports', href: '/dashboard/reports' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Methodology', href: '/methodology' },
        { label: 'Certifications', href: '/certifications' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api-docs' },
        { label: 'WRI Guidelines', href: '/wri-guidelines' },
        { label: 'DEFRA Factors', href: '/defra-factors' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ]

  const certifications = [
    { name: 'Carbon Footprint®', icon: Leaf },
    { name: 'CSRD', icon: Globe },
    { name: 'SBTi', icon: Leaf },
  ]

  return (
    <footer className="border-t border-cd-border bg-cd-surface">
      <div className="container-cd py-12">
        {/* Top Section - Logo and Description */}
        <div className="mb-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-xl font-bold text-cd-midnight"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cd-midnight text-white">
                <span className="font-mono text-lg">CD</span>
              </div>
              <span>CarbonDepict</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-cd-muted">
              Precision carbon emission tracking tool. WRI-compliant GHG calculations with DEFRA
              2025 emission factors. Empowering businesses globally to measure, reduce, and report
              their carbon footprint.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:contact@carbondepict.com"
                className="text-cd-muted transition-colors hover:text-cd-midnight"
                aria-label="Email"
              >
             <Mail strokeWidth={2} />
              </a>
              <a
                href="https://carbondepict.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cd-muted transition-colors hover:text-cd-midnight"
                aria-label="Website"
              >
             <Globe strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold text-cd-text">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-cd-muted transition-colors hover:text-cd-midnight"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-8 border-t border-cd-border pt-8">
          <h3 className="mb-4 text-sm font-semibold text-cd-text">Certifications & Standards</h3>
          <div className="flex flex-wrap gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-2 rounded-md border border-cd-border bg-white px-3 py-2 text-xs font-medium text-cd-muted"
              >
                <cert.icon className="h-4 w-4 text-cd-midnight" />
                {cert.name}
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-md border border-cd-border bg-white px-3 py-2 text-xs font-medium text-cd-muted">
              TCFD & IFRS
            </div>
            <div className="flex items-center gap-2 rounded-md border border-cd-border bg-white px-3 py-2 text-xs font-medium text-cd-muted">
              GRI & SDGs
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-cd-border pt-8 text-sm text-cd-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CarbonDepict. All rights reserved.</p>
          <p className="text-xs">
            Built with sustainability in mind. Powered by DEFRA 2025 emission factors.
          </p>
        </div>
      </div>
    </footer>
  )
}

