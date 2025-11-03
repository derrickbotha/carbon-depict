// Cache bust 2025-11-04
export default function PricingPage() {
  const plans = [
    {
      name: 'Essential',
      price: '$2,500',
      period: '/month',
      billedAnnually: '$25,000/year',
      description: 'For small to medium enterprises starting their ESG journey',
      features: [
        'Up to 10 users',
        'Scope 1, 2 & 3 emissions tracking',
        'GRI, CDP, TCFD reporting frameworks',
        'Standard dashboards & analytics',
        'PDF & Excel export',
        'Email support (24-hour response)',
        'Monthly data refresh',
        'DEFRA, EPA, IEA emission factors',
        'Basic API access (1,000 calls/month)',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$7,500',
      period: '/month',
      billedAnnually: '$78,000/year',
      description: 'For mid-market companies with advanced reporting needs',
      features: [
        'Up to 50 users',
        'Everything in Essential, plus:',
        'Advanced AI-powered analytics & forecasting',
        'Custom dashboards & KPI tracking',
        'CSRD, SASB, ISSB compliance modules',
        'Multi-entity & regional support',
        'Supplier emissions management',
        'Priority support (4-hour response)',
        'Daily data refresh',
        'Enhanced API (10,000 calls/month)',
        'Single sign-on (SSO)',
        'Quarterly business reviews',
      ],
      cta: 'Request Demo',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom Pricing',
      startingAt: 'Starting at $25,000/month',
      description: 'For global organizations requiring full-scale ESG management',
      features: [
        'Unlimited users',
        'Everything in Professional, plus:',
        'Dedicated Customer Success Manager',
        'Custom emission factors & methodologies',
        'White-label reporting & branding',
        'Advanced integrations (ERP, SAP, Oracle)',
        'On-premise deployment option',
        '24/7 premium support (1-hour response)',
        'Real-time data synchronization',
        'Unlimited API calls',
        'Custom training & certification programs',
        'Regulatory change management',
        'Third-party audit support',
        'Data residency controls',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container-cd">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-cd-text md:text-5xl">
            Enterprise ESG & Carbon Management
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-cd-muted">
            Scalable solutions for organizations of all sizes. All plans include comprehensive emission factors,
            multi-framework compliance, and enterprise-grade security.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm text-cd-muted">
              <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              14-day free trial
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-cd-muted">
              <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-cd-muted">
              <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Annual billing discount
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-8 shadow-cd-md ${
                plan.popular
                  ? 'border-cd-midnight bg-cd-midnight text-white'
                  : 'border-cd-border bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-cd-mint px-4 py-1 text-xs font-semibold text-cd-midnight">
                  Most Popular
                </div>
              )}

              <h3 className={`mb-2 text-2xl font-bold ${plan.popular ? 'text-white' : 'text-cd-text'}`}>
                {plan.name}
              </h3>
              <p className={`mb-4 text-sm ${plan.popular ? 'text-cd-desert' : 'text-cd-muted'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <div className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-cd-midnight'}`}>
                  {plan.price}
                </div>
                {plan.period && (
                  <div className={`text-sm ${plan.popular ? 'text-cd-desert' : 'text-cd-muted'}`}>
                    {plan.period}
                  </div>
                )}
                {plan.billedAnnually && (
                  <div className={`mt-1 text-xs ${plan.popular ? 'text-cd-desert' : 'text-cd-muted'}`}>
                    Billed annually: {plan.billedAnnually}
                  </div>
                )}
                {plan.startingAt && (
                  <div className={`mt-1 text-sm italic ${plan.popular ? 'text-cd-desert' : 'text-cd-muted'}`}>
                    {plan.startingAt}
                  </div>
                )}
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-cd-mint' : 'text-cd-success'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-white' : 'text-cd-text'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-lg px-6 py-3 font-medium transition-colors ${
                  plan.popular
                    ? 'bg-white text-cd-midnight hover:bg-cd-desert'
                    : 'bg-cd-midnight text-white hover:bg-cd-cedar'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center">
          <p className="mb-8 text-cd-muted">
            All plans include: SOC 2 Type II compliance • GDPR & data privacy • 99.9% uptime SLA • Regular product updates
          </p>
          <div className="mb-8 rounded-lg bg-cd-sand/30 p-8">
            <h3 className="mb-4 text-2xl font-bold text-cd-text">Volume & Multi-Year Discounts Available</h3>
            <p className="mx-auto mb-4 max-w-3xl text-cd-muted">
              Organizations with 100+ users or multi-year commitments qualify for significant discounts.
              Our enterprise pricing is designed to scale with your organization's growth and sustainability goals.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-cd-text">Flexible payment terms</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-cd-text">Educational & non-profit discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-cd-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-cd-text">Migration assistance from other platforms</span>
              </div>
            </div>
          </div>
          <p className="text-cd-muted">
            Questions about pricing? <a href="/contact" className="font-medium text-cd-midnight underline">Schedule a consultation</a> with our team
          </p>
        </div>
      </div>
    </div>
  )
}

