// Cache bust 2025-10-23
import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Filter, CheckCircle2, Clock, AlertCircle, Plus, Download, Upload, 
  BarChart3, TrendingUp, FileText, Sparkles, Calendar, Target, Grid3X3,
  List, X, Zap
} from '@atoms/Icon'

export default function ESGDataEntryHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('priority')
  const [selectedFrameworks, setSelectedFrameworks] = useState([])

  const forms = [
    // Environmental
    { id: 'env-ghg', name: 'GHG Emissions Inventory', category: 'environmental', description: 'Scope 1, 2, and 3 greenhouse gas emissions', frameworks: ['GRI', 'TCFD', 'CSRD', 'CDP', 'SBTi'], status: 'completed', progress: 100, lastUpdated: '2024-10-15', priority: 'high', dataPoints: 45, dueDate: '2024-10-30' },
    { id: 'env-energy', name: 'Energy Management', category: 'environmental', description: 'Energy consumption and renewable energy sources', frameworks: ['GRI', 'CSRD', 'SDG'], status: 'in-progress', progress: 65, lastUpdated: '2024-10-18', priority: 'high', dataPoints: 32, dueDate: '2024-10-28' },
    { id: 'env-water', name: 'Water Management', category: 'environmental', description: 'Water withdrawal, consumption, and discharge', frameworks: ['GRI', 'CDP', 'CSRD'], status: 'in-progress', progress: 40, lastUpdated: '2024-10-20', priority: 'medium', dataPoints: 28, dueDate: '2024-11-05' },
    { id: 'env-waste', name: 'Waste Management', category: 'environmental', description: 'Generation, recycling, landfill, hazardous', frameworks: ['GRI', 'CSRD'], status: 'pending', progress: 0, lastUpdated: null, priority: 'medium', dataPoints: 24, dueDate: '2024-11-10' },
  { id: 'env-materials', name: 'Materials & Circular Economy', category: 'environmental', description: 'Input materials, recycled content', frameworks: ['GRI', 'CSRD'], status: 'pending', progress: 0, lastUpdated: null, priority: 'low', dataPoints: 18, dueDate: '2024-11-15' },
  { id: 'env-biodiversity', name: 'Biodiversity & Land Use', category: 'environmental', description: 'Protected areas, IUCN species', frameworks: ['GRI', 'CSRD'], status: 'pending', progress: 0, lastUpdated: null, priority: 'medium', dataPoints: 22, dueDate: '2024-11-20' },
    // Social
    { id: 'soc-demographics', name: 'Employee Demographics', category: 'social', description: 'Headcount, gender, age, diversity', frameworks: ['GRI', 'CSRD'], status: 'completed', progress: 100, lastUpdated: '2024-10-10', priority: 'high', dataPoints: 38, dueDate: '2024-10-25' },
    { id: 'soc-safety', name: 'Health & Safety', category: 'social', description: 'Injuries, fatalities, incident rates', frameworks: ['GRI', 'CSRD'], status: 'in-progress', progress: 80, lastUpdated: '2024-10-19', priority: 'high', dataPoints: 42, dueDate: '2024-10-27' },
    { id: 'soc-training', name: 'Training & Development', category: 'social', description: 'Hours, programs, skills development', frameworks: ['GRI', 'CSRD', 'SDG'], status: 'in-progress', progress: 55, lastUpdated: '2024-10-17', priority: 'medium', dataPoints: 30, dueDate: '2024-11-01' },
    { id: 'soc-diversity', name: 'Diversity & Inclusion', category: 'social', description: 'Policies, metrics, initiatives', frameworks: ['GRI', 'CSRD', 'SDG'], status: 'pending', progress: 0, lastUpdated: null, priority: 'medium', dataPoints: 34, dueDate: '2024-11-08' },
    // Governance
    { id: 'gov-board', name: 'Board Composition', category: 'governance', description: 'Independence, diversity, expertise', frameworks: ['GRI', 'TCFD', 'CSRD'], status: 'completed', progress: 100, lastUpdated: '2024-10-12', priority: 'high', dataPoints: 20, dueDate: '2024-10-22' },
    { id: 'gov-ethics', name: 'Ethics & Anti-Corruption', category: 'governance', description: 'Policies, training, incidents', frameworks: ['GRI', 'CSRD', 'SDG'], status: 'in-progress', progress: 60, lastUpdated: '2024-10-16', priority: 'high', dataPoints: 24, dueDate: '2024-10-29' },
    { id: 'gov-risk', name: 'Risk Management', category: 'governance', description: 'Framework, climate risks, cyber risks', frameworks: ['GRI', 'TCFD', 'CSRD'], status: 'pending', progress: 0, lastUpdated: null, priority: 'high', dataPoints: 32, dueDate: '2024-11-05' },
    // Framework
    { id: 'fw-gri', name: 'GRI Materiality Assessment', category: 'framework', description: 'Stakeholder input, impact assessment', frameworks: ['GRI'], status: 'pending', progress: 0, lastUpdated: null, priority: 'high', dataPoints: 25, dueDate: '2024-11-01' },
    { id: 'fw-tcfd', name: 'TCFD Climate Strategy', category: 'framework', description: 'Climate risks, opportunities, scenarios', frameworks: ['TCFD'], status: 'pending', progress: 0, lastUpdated: null, priority: 'high', dataPoints: 30, dueDate: '2024-11-07' },
  ]

  const filteredForms = useMemo(() => {
    let filtered = [...forms]

    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') filtered = filtered.filter(f => f.category === selectedCategory)
    if (selectedStatus !== 'all') filtered = filtered.filter(f => f.status === selectedStatus)
    if (selectedFrameworks.length > 0) {
      filtered = filtered.filter(f => f.frameworks.some(fw => selectedFrameworks.includes(fw)))
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 }
    filtered.sort((a, b) => {
      if (sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority]
      if (sortBy === 'progress') return b.progress - a.progress
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
      return a.name.localeCompare(b.name)
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedStatus, selectedFrameworks, sortBy])

  const stats = useMemo(() => ({
    total: forms.length,
    completed: forms.filter(f => f.status === 'completed').length,
    inProgress: forms.filter(f => f.status === 'in-progress').length,
    pending: forms.filter(f => f.status === 'pending').length,
    avgProgress: Math.round(forms.reduce((sum, f) => sum + f.progress, 0) / forms.length)
  }), [forms])

  const formLinks = useMemo(() => ({
    'env-ghg': '/dashboard/esg/data-entry/ghg-inventory',
    'env-energy': '/dashboard/esg/data-entry/energy-management',
    'env-water': '/dashboard/esg/data-entry/water-management',
    'env-waste': '/dashboard/esg/data-entry/waste-management',
  'env-materials': '/dashboard/esg/data-entry/materials-circular-economy',
  'env-biodiversity': '/dashboard/esg/data-entry/biodiversity-land-use',
    'soc-demographics': '/dashboard/esg/data-entry/employee-demographics',
    'soc-safety': '/dashboard/esg/data-entry/health-safety',
  'soc-training': '/dashboard/esg/data-entry/training-development',
  'soc-diversity': '/dashboard/esg/data-entry/diversity-inclusion',
    'gov-board': '/dashboard/esg/data-entry/board-composition',
    'gov-ethics': '/dashboard/esg/data-entry/ethics-anti-corruption',
    'gov-risk': '/dashboard/esg/data-entry/risk-management',
    'fw-gri': '/dashboard/esg/gri',
    'fw-tcfd': '/dashboard/esg/tcfd',
    'fw-csrd': '/dashboard/esg/csrd',
    'fw-cdp': '/dashboard/esg/cdp',
    'fw-sbti': '/dashboard/esg/sbti',
    'fw-sdg': '/dashboard/esg/sdg',
  }), []);

  const getFormLink = useCallback((id) => {
    return formLinks[id] || '#';
  }, [formLinks]);

  const handleCardClick = useCallback((form) => {
    const link = getFormLink(form.id);
    if (link === '#') {
      alert(`Navigating to ${form.name}. Page not yet implemented.`);
    }
  }, [getFormLink]);

  const getCategoryIcon = (cat) => ({ environmental: '🌿', social: '👥', governance: '🏛️', framework: '📋' }[cat] || '📄')
  const getCategoryColor = (cat) => ({ environmental: 'from-green-500 to-emerald-600', social: 'from-blue-500 to-cyan-600', governance: 'from-purple-500 to-indigo-600', framework: 'from-orange-500 to-red-600' }[cat] || 'from-gray-500 to-gray-600')
  const getStatusColor = (status) => ({ completed: 'bg-green-100 text-green-700', 'in-progress': 'bg-yellow-100 text-yellow-700', pending: 'bg-gray-100 text-gray-700' }[status])
  const getPriorityBadge = (priority) => ({ high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-blue-100 text-blue-700' }[priority])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-cd-teal" strokeWidth={2} />
            ESG Data Entry Hub
          </h1>
          <p className="mt-2 text-cd-muted">Comprehensive data collection across 50+ ESG forms</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => alert('Bulk import functionality coming soon!')} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-all">
            <Upload className="h-5 w-5" strokeWidth={2} />
            Bulk Import
          </button>
          <button onClick={() => alert('Export initiated!')} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-all">
            <Download className="h-5 w-5" strokeWidth={2} />
            Export All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Forms</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-200" strokeWidth={2} />
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-green-200" strokeWidth={2} />
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.inProgress}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-200" strokeWidth={2} />
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.pending}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-gray-200" strokeWidth={2} />
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.avgProgress}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-200" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow-cd-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={2} />
            <input type="text" placeholder="Search forms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="h-4 w-4" strokeWidth={2} /></button>}
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none">
            <option value="all">All Categories</option>
            <option value="environmental">🌿 Environmental</option>
            <option value="social">👥 Social</option>
            <option value="governance">🏛️ Governance</option>
            <option value="framework">📋 Framework</option>
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none">
            <option value="all">All Status</option>
            <option value="completed">✓ Completed</option>
            <option value="in-progress">⏳ In Progress</option>
            <option value="pending">○ Pending</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none">
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-cd-teal text-white' : 'bg-gray-100 text-gray-600'}`}><Grid3X3 className="h-5 w-5" strokeWidth={2} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-cd-teal text-white' : 'bg-gray-100 text-gray-600'}`}><List className="h-5 w-5" strokeWidth={2} /></button>
          </div>
        </div>
        <div className="text-sm text-cd-muted">Showing {filteredForms.length} of {forms.length} forms</div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
            <Link to={getFormLink(form.id)} key={form.id} onClick={() => handleCardClick(form)} className="group rounded-lg bg-white p-6 shadow-cd-sm hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-cd-teal cursor-pointer block">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getCategoryColor(form.category)} text-white text-2xl shadow-lg`}>
                  {getCategoryIcon(form.category)}
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                    {form.status === 'in-progress' ? 'In Progress' : form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(form.priority)}`}>
                    {form.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-cd-midnight mb-2 group-hover:text-cd-teal transition-colors">{form.name}</h3>
              <p className="text-sm text-cd-muted mb-4">{form.description}</p>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-cd-muted">Progress</span>
                  <span className="font-medium">{form.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${form.progress === 100 ? 'bg-green-500' : form.progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${form.progress}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {form.frameworks.map(fw => <span key={fw} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{fw}</span>)}
              </div>
              <div className="w-full rounded-lg bg-cd-teal/10 text-cd-teal font-medium py-2 text-center group-hover:bg-cd-teal group-hover:text-white transition-all">
                {form.status === 'completed' ? 'View Details' : form.status === 'in-progress' ? 'Continue' : 'Start Form'}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-lg bg-white shadow-cd-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-cd-midnight uppercase">Form</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cd-midnight uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cd-midnight uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cd-midnight uppercase">Progress</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-cd-midnight uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredForms.map(form => (
                <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><div className="font-medium text-cd-midnight">{form.name}</div><div className="text-sm text-cd-muted">{form.description}</div></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1"><span>{getCategoryIcon(form.category)}</span><span className="text-sm capitalize">{form.category}</span></span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>{form.status === 'in-progress' ? 'In Progress' : form.status.charAt(0).toUpperCase() + form.status.slice(1)}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${form.progress === 100 ? 'bg-green-500' : form.progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${form.progress}%` }} /></div><span className="text-xs font-medium">{form.progress}%</span></div></td>
                  <td className="px-6 py-4 text-right">
                    <Link to={getFormLink(form.id)} onClick={() => handleCardClick(form)} className="text-cd-teal hover:text-cd-teal/80 font-medium text-sm">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredForms.length === 0 && (
        <div className="rounded-lg bg-white p-12 shadow-cd-sm text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" strokeWidth={2} />
          <h3 className="text-lg font-medium text-cd-midnight mb-2">No forms found</h3>
          <p className="text-cd-muted">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}

