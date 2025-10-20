import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Download,
  ExternalLink,
  BookOpen,
  Award,
  Target,
  Leaf,
  Building2,
  Globe2,
  ArrowRight
} from 'lucide-react'
import esgDataManager from '../../utils/esgDataManager'

const ESGFrameworksPage = () => {
  const [frameworkData, setFrameworkData] = useState({
    gri: { progress: 0, score: 0, completedFields: 0, totalFields: 0 },
    tcfd: { progress: 0, score: 0, completedFields: 0, totalFields: 0 },
    sbti: { progress: 0, score: 0, completedFields: 0, totalFields: 0 },
    csrd: { progress: 0, score: 0, completedFields: 0, totalFields: 0 },
    cdp: { progress: 0, score: 0, completedFields: 0, totalFields: 0 },
    sdg: { progress: 0, score: 0, completedFields: 0, totalFields: 0 }
  })

  useEffect(() => {
    loadFrameworkData()
  }, [])

  const loadFrameworkData = () => {
    const scores = esgDataManager.getScores()
    
    // Get framework data to count fields
    const getFieldCounts = (framework) => {
      const data = esgDataManager.getFrameworkData(framework)
      const totalFields = esgDataManager.countTotalFields(data)
      const completedFields = esgDataManager.countCompletedFields(data)
      return { totalFields, completedFields }
    }
    
    setFrameworkData({
      gri: { 
        ...scores.frameworks.gri, 
        ...getFieldCounts('gri') 
      },
      tcfd: { 
        ...scores.frameworks.tcfd, 
        ...getFieldCounts('tcfd') 
      },
      sbti: { 
        ...scores.frameworks.sbti, 
        ...getFieldCounts('sbti') 
      },
      csrd: { 
        ...scores.frameworks.csrd, 
        ...getFieldCounts('csrd') 
      },
      cdp: { 
        ...scores.frameworks.cdp, 
        ...getFieldCounts('cdp') 
      },
      sdg: { 
        ...scores.frameworks.sdg, 
        ...getFieldCounts('sdg') 
      }
    })
  }

  const frameworks = [
    {
      id: 'gri',
      name: 'GRI Standards 2021',
      fullName: 'Global Reporting Initiative',
      description: 'The world\'s most widely used sustainability reporting framework. Covers economic, environmental, and social impacts.',
      icon: Globe2,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      link: '/dashboard/esg/gri',
      category: 'Universal',
      requirements: '25+ disclosure topics',
      certification: 'GRI Standards',
      adoptedBy: '10,000+ organizations',
      keyBenefits: [
        'Widely recognized globally',
        'Comprehensive materiality approach',
        'Stakeholder engagement focus',
        'Industry-specific guidance'
      ],
      mainTopics: [
        'Organizational Context',
        'Stakeholder Engagement',
        'Material Topics',
        'Economic Performance',
        'Environmental Impact',
        'Social Responsibility'
      ]
    },
    {
      id: 'tcfd',
      name: 'TCFD Recommendations',
      fullName: 'Task Force on Climate-related Financial Disclosures',
      description: 'Framework for climate-related financial risk disclosures. Focuses on governance, strategy, risk management, and metrics.',
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
      link: '/dashboard/esg/tcfd',
      category: 'Climate',
      requirements: '11 recommended disclosures',
      certification: 'TCFD Supporter',
      adoptedBy: '3,900+ organizations',
      keyBenefits: [
        'Investor-focused reporting',
        'Climate risk assessment',
        'Scenario analysis',
        'Financial materiality'
      ],
      mainTopics: [
        'Governance',
        'Strategy',
        'Risk Management',
        'Metrics & Targets',
        'Climate Scenarios',
        'Transition Plans'
      ]
    },
    {
      id: 'sbti',
      name: 'SBTi Net-Zero',
      fullName: 'Science Based Targets initiative',
      description: 'Framework for setting emissions reduction targets aligned with climate science. Supports 1.5°C pathway commitments.',
      icon: Target,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
      link: '/dashboard/esg/sbti',
      category: 'Climate Action',
      requirements: 'Near-term + Long-term targets',
      certification: 'SBTi Validated',
      adoptedBy: '4,000+ companies',
      keyBenefits: [
        'Science-based credibility',
        '1.5°C alignment',
        'Net-zero pathway',
        'Investor confidence'
      ],
      mainTopics: [
        'Target Setting',
        'Scope 1-3 Emissions',
        'Reduction Pathways',
        'Net-Zero Commitment',
        'Progress Tracking',
        'Verification'
      ]
    },
    {
      id: 'csrd',
      name: 'CSRD Compliance',
      fullName: 'Corporate Sustainability Reporting Directive',
      description: 'EU mandatory sustainability reporting directive. Requires double materiality assessment and ESRS compliance.',
      icon: Building2,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
      link: '/dashboard/esg/csrd',
      category: 'EU Regulation',
      requirements: 'Full ESRS standards',
      certification: 'CSRD Compliant',
      adoptedBy: '50,000+ EU companies (phased)',
      keyBenefits: [
        'EU market access',
        'Legal compliance',
        'Investor transparency',
        'Standardized reporting'
      ],
      mainTopics: [
        'Double Materiality',
        'ESRS Standards',
        'Value Chain',
        'Due Diligence',
        'Third-party Assurance',
        'Digital Reporting'
      ]
    },
    {
      id: 'cdp',
      name: 'CDP Disclosure',
      fullName: 'Carbon Disclosure Project',
      description: 'Global environmental disclosure system. Covers climate change, water security, and forests through investor requests.',
      icon: Leaf,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgLight: 'bg-teal-50',
      link: '/dashboard/esg/cdp',
      category: 'Environmental',
      requirements: 'Annual questionnaire',
      certification: 'CDP A-List',
      adoptedBy: '18,700+ companies',
      keyBenefits: [
        'Investor transparency',
        'Environmental leadership',
        'Supply chain engagement',
        'Public scoring'
      ],
      mainTopics: [
        'Climate Change',
        'Water Security',
        'Forests',
        'Supply Chain',
        'Risk & Opportunity',
        'Emissions Data'
      ]
    },
    {
      id: 'sdg',
      name: 'UN SDG Alignment',
      fullName: 'United Nations Sustainable Development Goals',
      description: 'Global framework for sustainable development. 17 goals addressing poverty, inequality, climate, and prosperity.',
      icon: Award,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      link: '/dashboard/esg/sdg',
      category: 'Impact',
      requirements: '17 goals, 169 targets',
      certification: 'SDG Aligned',
      adoptedBy: 'All UN Member States',
      keyBenefits: [
        'Global impact alignment',
        'Stakeholder engagement',
        'Business opportunity identification',
        'Comprehensive sustainability'
      ],
      mainTopics: [
        'Goal Prioritization',
        'Target Mapping',
        'Impact Measurement',
        'Partnership Development',
        'Progress Reporting',
        'Innovation Opportunities'
      ]
    }
  ]

  const getStatusBadge = (progress) => {
    if (progress >= 80) {
      return {
        label: 'Compliant',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      }
    } else if (progress >= 40) {
      return {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      }
    } else if (progress > 0) {
      return {
        label: 'Started',
        color: 'bg-blue-100 text-blue-800',
        icon: Clock
      }
    } else {
      return {
        label: 'Not Started',
        color: 'bg-gray-100 text-gray-800',
        icon: AlertCircle
      }
    }
  }

  const overallProgress = () => {
    const total = Object.values(frameworkData).reduce((sum, fw) => sum + fw.progress, 0)
    return Math.round(total / 6)
  }

  const completedFrameworks = () => {
    return Object.values(frameworkData).filter(fw => fw.progress >= 80).length
  }

  const inProgressFrameworks = () => {
    return Object.values(frameworkData).filter(fw => fw.progress > 0 && fw.progress < 80).length
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ESG Frameworks</h1>
        <p className="text-gray-600">
          Comprehensive overview of all supported ESG reporting frameworks and standards
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
          <div className="text-sm text-gray-600">Total Frameworks</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{completedFrameworks()}</div>
          <div className="text-sm text-gray-600">Compliant</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{inProgressFrameworks()}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{overallProgress()}%</div>
          <div className="text-sm text-gray-600">Overall Progress</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Framework Completion</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-cd-teal to-cd-green h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress()}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span className="font-medium text-gray-900">{overallProgress()}% Complete</span>
          <span>100%</span>
        </div>
      </div>

      {/* Framework Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {frameworks.map((framework) => {
          const data = frameworkData[framework.id]
          const status = getStatusBadge(data.progress)
          const Icon = framework.icon
          const StatusIcon = status.icon

          return (
            <div key={framework.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Header with colored bar */}
              <div className={`${framework.color} h-2`} />
              
              <div className="p-6">
                {/* Framework Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`${framework.bgLight} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${framework.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{framework.name}</h3>
                      <p className="text-sm text-gray-500">{framework.fullName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} flex items-center space-x-1`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{status.label}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{framework.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{Math.round(data.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${framework.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${data.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{data.completedFields} of {data.totalFields} fields completed</span>
                    <span>Score: {data.score}/100</span>
                  </div>
                </div>

                {/* Framework Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-sm font-medium text-gray-900">{framework.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Requirements</div>
                    <div className="text-sm font-medium text-gray-900">{framework.requirements}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Certification</div>
                    <div className="text-sm font-medium text-gray-900">{framework.certification}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Adopted By</div>
                    <div className="text-sm font-medium text-gray-900">{framework.adoptedBy}</div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Benefits</h4>
                  <ul className="space-y-1">
                    {framework.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Topics */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Main Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {framework.mainTopics.slice(0, 4).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {topic}
                      </span>
                    ))}
                    {framework.mainTopics.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        +{framework.mainTopics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={framework.link}
                    className={`flex-1 ${framework.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {data.progress > 0 ? 'Continue' : 'Start'} Collection
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Download Framework Guide"
                  >
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Learn More"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gradient-to-r from-cd-teal to-cd-green rounded-lg shadow-md p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Need Help Choosing a Framework?</h3>
            <p className="text-white/90 mb-4">
              Not sure which framework to prioritize? Our ESG experts can help you determine the best frameworks 
              for your industry, region, and stakeholder requirements.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-cd-teal rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                Schedule Consultation
              </button>
              <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium text-sm">
                View Framework Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ESGFrameworksPage
