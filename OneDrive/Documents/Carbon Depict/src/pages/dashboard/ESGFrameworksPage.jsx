import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, CheckCircle, Clock, TrendingUp, Download, ExternalLink, BookOpen,
  Award, Target, Leaf, Building2, Globe, ArrowRight, Check, DollarSign, Info
} from 'lucide-react'
import SkeletonLoader from '@components/atoms/SkeletonLoader'
import EmptyState from '@components/molecules/EmptyState'

// --- MOCK DATA & HOOK ---
const useFrameworksData = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        gri: { progress: 92, score: 88, completedFields: 240, totalFields: 260 },
        tcfd: { progress: 75, score: 80, completedFields: 9, totalFields: 11 },
        sbti: { progress: 60, score: 75, completedFields: 3, totalFields: 5 },
        csrd: { progress: 45, score: 65, completedFields: 500, totalFields: 1144 },
        cdp: { progress: 85, score: 90, completedFields: 150, totalFields: 175 },
        sdg: { progress: 70, score: 78, completedFields: 12, totalFields: 17 },
        sasb: { progress: 95, score: 92, completedFields: 25, totalFields: 26 },
        issb: { progress: 55, score: 70, completedFields: 4, totalFields: 8 },
        pcaf: { progress: 30, score: 50, completedFields: 2, totalFields: 7 }
      })
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const frameworks = useMemo(() => [
    { id: 'gri', name: 'GRI Standards', fullName: 'Global Reporting Initiative', description: 'The world\'s most widely used sustainability reporting framework.', icon: Globe, color: 'blue', category: 'Universal', requirements: '25+ disclosure topics', certification: 'GRI Standards', adoptedBy: '10,000+ organizations', keyBenefits: ['Widely recognized globally', 'Comprehensive materiality', 'Stakeholder engagement'], mainTopics: ['Organizational Context', 'Material Topics', 'Environmental Impact', 'Social Responsibility'], link: '/dashboard/esg/gri' },
    { id: 'tcfd', name: 'TCFD', fullName: 'Task Force on Climate-related Financial Disclosures', description: 'Framework for climate-related financial risk disclosures.', icon: TrendingUp, color: 'green', category: 'Climate', requirements: '11 recommended disclosures', certification: 'TCFD Supporter', adoptedBy: '3,900+ organizations', keyBenefits: ['Investor-focused', 'Climate risk assessment', 'Scenario analysis'], mainTopics: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets'], link: '/dashboard/esg/tcfd' },
    { id: 'sbti', name: 'SBTi Net-Zero', fullName: 'Science Based Targets initiative', description: 'Framework for setting emissions reduction targets aligned with climate science.', icon: Target, color: 'orange', category: 'Climate Action', requirements: 'Near & Long-term targets', certification: 'SBTi Validated', adoptedBy: '4,000+ companies', keyBenefits: ['1.5°C alignment', 'Net-zero pathway', 'Investor confidence'], mainTopics: ['Target Setting', 'Scope 1-3 Emissions', 'Reduction Pathways', 'Verification'], link: '/dashboard/esg/sbti' },
    { id: 'csrd', name: 'CSRD/ESRS', fullName: 'Corporate Sustainability Reporting Directive', description: 'EU mandatory sustainability reporting directive using ESRS standards.', icon: Building2, color: 'purple', category: 'EU Regulation', requirements: 'Full ESRS standards', certification: 'CSRD Compliant', adoptedBy: '50,000+ EU companies', keyBenefits: ['EU market access', 'Legal compliance', 'Standardized reporting'], mainTopics: ['Double Materiality', 'ESRS Standards', 'Value Chain', 'Due Diligence'], link: '/dashboard/esg/csrd' },
    { id: 'cdp', name: 'CDP Disclosure', fullName: 'Carbon Disclosure Project', description: 'Global environmental disclosure system for investors.', icon: Leaf, color: 'teal', category: 'Environmental', requirements: 'Annual questionnaire', certification: 'CDP A-List', adoptedBy: '18,700+ companies', keyBenefits: ['Investor transparency', 'Environmental leadership', 'Public scoring'], mainTopics: ['Climate Change', 'Water Security', 'Forests', 'Supply Chain'], link: '/dashboard/esg/cdp' },
    { id: 'sasb', name: 'SASB Standards', fullName: 'Sustainability Accounting Standards Board', description: 'Industry-specific standards for financially material information.', icon: DollarSign, color: 'emerald', category: 'Financial Materiality', requirements: 'Industry-specific metrics', certification: 'SASB Aligned', adoptedBy: '2,000+ companies', keyBenefits: ['Investor-focused', 'Financial materiality', 'SEC filing integration'], mainTopics: ['Environment', 'Social Capital', 'Human Capital', 'Business Model'], link: '/dashboard/esg/sasb' },
    { id: 'pcaf', name: 'PCAF', fullName: 'Partnership for Carbon Accounting Financials', description: 'Standard for measuring and disclosing financed emissions.', icon: Award, color: 'indigo', category: 'Finance', requirements: 'Financed emissions calculation', certification: 'PCAF Accredited', adoptedBy: '400+ financial institutions', keyBenefits: ['Standardized accounting', 'Portfolio alignment', 'Regulatory readiness'], mainTopics: ['Financed Emissions', 'Data Quality', 'Attribution Factors', 'Asset Classes'], link: '/dashboard/esg/pcaf' },
  ], [])

  return { frameworks, frameworkData: data, loading }
}

// --- SUB-COMPONENTS ---

const Header = () => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-greenly-charcoal mb-2">ESG Frameworks</h1>
    <p className="text-lg text-greenly-slate">
      Track your progress and compliance across major ESG reporting frameworks.
    </p>
  </div>
)

const SummaryCard = ({ title, value, icon: Icon, color, loading }) => {
  if (loading) return <SkeletonLoader className="h-32 w-full" />
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className={`bg-${color}-100 text-${color}-600 p-3.5 rounded-full inline-block mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-bold text-greenly-charcoal">{value}</p>
      <p className="text-sm font-medium text-greenly-slate">{title}</p>
    </div>
  )
}

const FrameworkCard = ({ framework, data, loading }) => {
  if (loading) return <SkeletonLoader className="h-[400px] w-full" />

  const { icon: Icon, color } = framework
  const progress = data?.progress || 0

  const getStatus = (p) => {
    if (p >= 90) return { label: 'Compliant', icon: CheckCircle, color: 'green' }
    if (p >= 50) return { label: 'In Progress', icon: Clock, color: 'blue' }
    if (p > 0) return { label: 'Started', icon: Clock, color: 'yellow' }
    return { label: 'Not Started', icon: Info, color: 'gray' }
  }

  const status = getStatus(progress)
  const StatusIcon = status.icon

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-greenly-primary transition-all flex flex-col">
      <div className={`h-2.5 rounded-t-2xl bg-${color}-500`}></div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`bg-${color}-100 p-3.5 rounded-full`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-greenly-charcoal">{framework.name}</h3>
              <p className="text-sm text-greenly-slate">{framework.category}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-${status.color}-100 text-${status.color}-800`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {status.label}
          </div>
        </div>
        <p className="text-sm text-greenly-slate mb-4 flex-grow">{framework.description}</p>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-greenly-charcoal">Progress</span>
            <span className="font-bold text-greenly-charcoal">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-xs text-greenly-slate mt-1">{data?.completedFields || 0} of {data?.totalFields || 0} fields</div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 flex items-center gap-3">
          <Link to={framework.link} className="flex-grow">
            <button className={`w-full flex items-center justify-center gap-2 rounded-lg bg-${color}-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-${color}-600 transition-all`}>
              <BookOpen className="h-4 w-4" />
              {progress > 0 ? 'Continue' : 'Start'}
            </button>
          </Link>
          <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><Download className="h-4 w-4" /></button>
          <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><ExternalLink className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  )
}

const HelpSection = () => (
  <div className="mt-8 bg-gradient-to-r from-greenly-primary to-green-600 rounded-2xl p-8 text-white">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="bg-white/20 p-4 rounded-full">
        <Info className="h-8 w-8" />
      </div>
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2">Need Help Choosing a Framework?</h3>
        <p className="text-white/90 mb-4 max-w-2xl">
          Our ESG experts can help you determine the best frameworks for your industry, region, and stakeholder requirements.
        </p>
      </div>
      <div className="flex-shrink-0">
        <button className="px-6 py-3 bg-white text-greenly-primary rounded-xl hover:bg-gray-100 transition-colors font-semibold text-md shadow-md">
          Schedule Consultation
        </button>
      </div>
    </div>
  </div>
)

// --- MAIN COMPONENT ---
export default function ESGFrameworksPage() {
  const { frameworks, frameworkData, loading } = useFrameworksData()

  const summaryStats = useMemo(() => {
    if (loading || !frameworkData) {
      return { total: 0, compliant: 0, inProgress: 0, overallProgress: 0 }
    }
    const dataValues = Object.values(frameworkData)
    const total = frameworks.length
    const compliant = dataValues.filter(d => d.progress >= 90).length
    const inProgress = dataValues.filter(d => d.progress > 0 && d.progress < 90).length
    const overallProgress = Math.round(dataValues.reduce((sum, d) => sum + d.progress, 0) / total)
    return { total, compliant, inProgress, overallProgress }
  }, [frameworks, frameworkData, loading])

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Frameworks" value={summaryStats.total} icon={FileText} color="gray" loading={loading} />
        <SummaryCard title="Compliant" value={summaryStats.compliant} icon={CheckCircle} color="green" loading={loading} />
        <SummaryCard title="In Progress" value={summaryStats.inProgress} icon={Clock} color="blue" loading={loading} />
        <SummaryCard title="Overall Progress" value={`${summaryStats.overallProgress}%`} icon={TrendingUp} color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <FrameworkCard
            key={framework.id}
            framework={framework}
            data={frameworkData ? frameworkData[framework.id] : null}
            loading={loading}
          />
        ))}
      </div>

      <HelpSection />
    </div>
  )
}
