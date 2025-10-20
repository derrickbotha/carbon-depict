export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for small businesses and students',
      features: [
        'Up to 50 calculations per month',
        'Basic emission categories',
        'CSV export',
        'Community support',
        'DEFRA 2025 factors',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'For growing teams and mid-size companies',
      features: [
        'Unlimited calculations',
        'All emission categories',
        'PDF & CSV export',
        'Priority support',
        'AI-powered insights',
        'Multi-user access (5 users)',
        'Excel/CSV upload',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with complex needs',
      features: [
        'Everything in Professional',
        'Unlimited users',
        'Custom emission factors',
        'Dedicated support',
        'White-label reports',
        'API integrations',
        'Regional adaptations',
        'Training & onboarding',
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
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-cd-muted">
            Choose the plan that fits your needs. All plans include DEFRA 2025 emission factors
            and WRI-compliant calculations.
          </p>
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
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-cd-midnight'}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={plan.popular ? 'text-cd-desert' : 'text-cd-muted'}>
                    {plan.period}
                  </span>
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
          <p className="text-cd-muted">
            Need help choosing? <a href="/contact" className="text-cd-midnight underline">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  )
}
