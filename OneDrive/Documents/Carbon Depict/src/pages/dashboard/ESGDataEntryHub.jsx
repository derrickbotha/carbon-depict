// Cache bust 2025-10-23
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, CheckCircle2, Clock, AlertCircle, Plus, Download, Upload,
  BarChart3, TrendingUp, FileText, Sparkles, Calendar, Target, Grid3x3,
  List, X, Zap, Leaf, Users, Landmark, FileBadge
} from 'lucide-react';
import SkeletonLoader from '@components/atoms/SkeletonLoader';
import EmptyState from '@components/molecules/EmptyState';

// Mock data fetching hook
const useEsgForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForms([
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
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { forms, loading };
};

const formLinks = {
  'env-ghg': '/dashboard/ghg-inventory',
  'env-energy': '/dashboard/environmental',
  'soc-demographics': '/dashboard/social',
  'gov-board': '/dashboard/governance',
  // Add other links as pages are created
};

const getFormLink = (id) => formLinks[id] || '#';

const Header = () => (
  <div className="mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold text-greenly-midnight flex items-center gap-3">
          <Zap className="h-9 w-9 text-greenly-teal" strokeWidth={2.5} />
          Data Entry Hub
        </h1>
        <p className="mt-2 text-lg text-greenly-slate">Centralized data collection for all your ESG needs.</p>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <button onClick={() => alert('Bulk import functionality coming soon!')} className="flex items-center gap-2 rounded-xl bg-white border border-greenly-light px-4 py-2.5 text-sm font-semibold text-greenly-midnight hover:bg-greenly-off-white transition-all shadow-sm">
          <Upload className="h-5 w-5" strokeWidth={2} />
          Bulk Import
        </button>
        <button onClick={() => alert('Export initiated!')} className="flex items-center gap-2 rounded-xl bg-white border border-greenly-light px-4 py-2.5 text-sm font-semibold text-greenly-midnight hover:bg-greenly-off-white transition-all shadow-sm">
          <Download className="h-5 w-5" strokeWidth={2} />
          Export All
        </button>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  if (loading) return <SkeletonLoader className="h-28 w-full" />;

  // Map colors to new palette
  const iconColor = color === 'blue' ? 'text-greenly-info' : color === 'green' ? 'text-greenly-success' : color === 'yellow' ? 'text-greenly-warning' : 'text-greenly-slate';
  const bgColor = color === 'blue' ? 'bg-greenly-info/10' : color === 'green' ? 'bg-greenly-success/10' : color === 'yellow' ? 'bg-greenly-warning/10' : 'bg-greenly-slate/10';
  const borderColor = color === 'blue' ? 'border-greenly-info' : color === 'green' ? 'border-greenly-success' : color === 'yellow' ? 'border-greenly-warning' : 'border-greenly-slate';
  const textColor = color === 'blue' ? 'text-greenly-info' : color === 'green' ? 'text-greenly-success' : color === 'yellow' ? 'text-greenly-warning' : 'text-greenly-slate';

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
          <p className="text-3xl font-bold mt-1 text-greenly-midnight">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <Icon className={`h-7 w-7 ${iconColor}`} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ filters, setFilters, formCount, totalForms }) => {
  const { searchQuery, selectedCategory, selectedStatus, sortBy, viewMode } = filters;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 space-y-4 border border-greenly-light">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-greenly-slate" />
          <input
            type="text"
            placeholder="Search forms by name or description..."
            value={searchQuery}
            onChange={(e) => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
            className="w-full rounded-xl border-greenly-light pl-11 pr-4 py-3 focus:border-greenly-teal focus:ring-2 focus:ring-greenly-teal/20 transition text-greenly-midnight"
          />
          {searchQuery && <button onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-greenly-slate hover:text-greenly-midnight"><X className="h-5 w-5" /></button>}
        </div>
        <select value={selectedCategory} onChange={(e) => setFilters(f => ({ ...f, selectedCategory: e.target.value }))} className="rounded-xl border-greenly-light px-4 py-3 focus:border-greenly-teal focus:ring-2 focus:ring-greenly-teal/20 transition text-greenly-midnight">
          <option value="all">All Categories</option>
          <option value="environmental">🌿 Environmental</option>
          <option value="social">👥 Social</option>
          <option value="governance">🏛️ Governance</option>
          <option value="framework">📋 Framework</option>
        </select>
        <select value={selectedStatus} onChange={(e) => setFilters(f => ({ ...f, selectedStatus: e.target.value }))} className="rounded-xl border-greenly-light px-4 py-3 focus:border-greenly-teal focus:ring-2 focus:ring-greenly-teal/20 transition text-greenly-midnight">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
        <select value={sortBy} onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="rounded-xl border-greenly-light px-4 py-3 focus:border-greenly-teal focus:ring-2 focus:ring-greenly-teal/20 transition text-greenly-midnight">
          <option value="priority">Sort by Priority</option>
          <option value="name">Sort by Name</option>
          <option value="progress">Sort by Progress</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
      </div>
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-greenly-slate">Showing {formCount} of {totalForms} forms</p>
        <div className="flex gap-2">
          <button onClick={() => setFilters(f => ({ ...f, viewMode: 'grid' }))} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-greenly-teal text-white' : 'bg-greenly-off-white text-greenly-slate hover:bg-greenly-light'}`}><Grid3x3 className="h-5 w-5" /></button>
          <button onClick={() => setFilters(f => ({ ...f, viewMode: 'list' }))} className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-greenly-teal text-white' : 'bg-greenly-off-white text-greenly-slate hover:bg-greenly-light'}`}><List className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};

const FormCard = ({ form }) => {
  const categoryStyles = {
    environmental: { icon: Leaf, color: 'text-greenly-success', bg: 'bg-greenly-success/10' },
    social: { icon: Users, color: 'text-greenly-info', bg: 'bg-greenly-info/10' },
    governance: { icon: Landmark, color: 'text-greenly-cedar', bg: 'bg-greenly-cedar/10' },
    framework: { icon: FileBadge, color: 'text-greenly-warning', bg: 'bg-greenly-warning/10' },
  };
  const statusStyles = {
    completed: 'bg-greenly-success/10 text-greenly-success border border-greenly-success/20',
    'in-progress': 'bg-greenly-warning/10 text-greenly-warning border border-greenly-warning/20',
    pending: 'bg-greenly-slate/10 text-greenly-slate border border-greenly-slate/20',
  };
  const priorityStyles = {
    high: 'bg-greenly-alert/10 text-greenly-alert border border-greenly-alert/20',
    medium: 'bg-greenly-warning/10 text-greenly-warning border border-greenly-warning/20',
    low: 'bg-greenly-info/10 text-greenly-info border border-greenly-info/20',
  };

  const { icon: CategoryIcon, color: categoryColor, bg: categoryBg } = categoryStyles[form.category] || { icon: FileText, color: 'text-greenly-slate', bg: 'bg-greenly-slate/10' };

  return (
    <Link to={getFormLink(form.id)} className="group block bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-greenly-teal">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${categoryBg} ${categoryColor}`}>
          <CategoryIcon className="h-7 w-7" strokeWidth={2} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[form.status]}`}>
            {form.status.replace('-', ' ')}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyles[form.priority]}`}>
            {form.priority} priority
          </span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-greenly-midnight mb-2 group-hover:text-greenly-teal transition-colors">{form.name}</h3>
      <p className="text-sm text-greenly-slate mb-4 h-10">{form.description}</p>
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-greenly-slate font-medium">Progress</span>
          <span className="font-bold text-greenly-midnight">{form.progress}%</span>
        </div>
        <div className="h-2.5 bg-greenly-light rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 bg-greenly-teal`} style={{ width: `${form.progress}%` }} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {form.frameworks.slice(0, 3).map(fw => <span key={fw} className="px-2 py-0.5 bg-greenly-off-white text-greenly-slate rounded text-xs font-medium border border-greenly-light">{fw}</span>)}
        {form.frameworks.length > 3 && <span className="px-2 py-0.5 bg-greenly-off-white text-greenly-slate rounded text-xs font-medium border border-greenly-light">+{form.frameworks.length - 3}</span>}
      </div>
      <div className="w-full rounded-lg bg-greenly-teal/10 text-greenly-teal font-semibold py-2.5 text-center group-hover:bg-greenly-teal group-hover:text-white transition-all">
        {form.status === 'completed' ? 'View Details' : form.status === 'in-progress' ? 'Continue' : 'Start Form'}
      </div>
    </Link>
  );
};

const FormListItem = ({ form }) => {
  const categoryStyles = {
    environmental: { icon: Leaf, color: 'text-greenly-success' },
    social: { icon: Users, color: 'text-greenly-info' },
    governance: { icon: Landmark, color: 'text-greenly-cedar' },
    framework: { icon: FileBadge, color: 'text-greenly-warning' },
  };
  const statusStyles = {
    completed: 'bg-greenly-success/10 text-greenly-success',
    'in-progress': 'bg-greenly-warning/10 text-greenly-warning',
    pending: 'bg-greenly-slate/10 text-greenly-slate',
  };
  const { icon: CategoryIcon, color: categoryColor } = categoryStyles[form.category] || { icon: FileText, color: 'text-greenly-slate' };

  return (
    <tr className="hover:bg-greenly-off-white transition-colors">
      <td className="px-6 py-4">
        <div className="font-semibold text-greenly-midnight">{form.name}</div>
        <div className="text-sm text-greenly-slate">{form.description}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 text-sm font-medium ${categoryColor}`}>
          <CategoryIcon className={`h-5 w-5`} />
          <span className="capitalize">{form.category}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[form.status]}`}>
          {form.status.replace('-', ' ')}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-greenly-light rounded-full overflow-hidden">
            <div className="h-full bg-greenly-teal" style={{ width: `${form.progress}%` }} />
          </div>
          <span className="text-sm font-bold w-10 text-right text-greenly-midnight">{form.progress}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <Link to={getFormLink(form.id)} className="text-greenly-teal hover:text-greenly-teal/80 font-semibold text-sm">
          Open →
        </Link>
      </td>
    </tr>
  );
};

export default function ESGDataEntryHub() {
  const { forms, loading } = useEsgForms();
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    viewMode: 'grid',
    sortBy: 'priority',
  });

  const filteredForms = useMemo(() => {
    let filtered = [...forms];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query)
      );
    }

    if (filters.selectedCategory !== 'all') filtered = filtered.filter(f => f.category === filters.selectedCategory);
    if (filters.selectedStatus !== 'all') filtered = filtered.filter(f => f.status === filters.selectedStatus);

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) => {
      if (filters.sortBy === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (filters.sortBy === 'progress') return b.progress - a.progress;
      if (filters.sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [forms, filters]);

  const stats = useMemo(() => {
    if (forms.length === 0) return { total: 0, completed: 0, inProgress: 0, pending: 0 };
    return {
      total: forms.length,
      completed: forms.filter(f => f.status === 'completed').length,
      inProgress: forms.filter(f => f.status === 'in-progress').length,
      pending: forms.filter(f => f.status === 'pending').length,
    };
  }, [forms]);

  const statCards = [
    { title: 'Total Forms', value: stats.total, icon: FileText, color: 'blue' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'green' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'yellow' },
    { title: 'Pending', value: stats.pending, icon: AlertCircle, color: 'gray' },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-greenly-secondary min-h-screen animate-pulse">
        <Header />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-28 w-full" />)}
        </div>
        <SkeletonLoader className="h-36 w-full mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-80 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-secondary min-h-screen">
      <Header />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map(stat => <StatCard key={stat.title} {...stat} loading={loading} />)}
      </div>

      <FilterBar filters={filters} setFilters={setFilters} formCount={filteredForms.length} totalForms={forms.length} />

      {filteredForms.length === 0 ? (
        <EmptyState
          title="No Forms Found"
          message="Try adjusting your search or filter settings to find what you're looking for."
        />
      ) : filters.viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredForms.map((form) => <FormCard key={form.id} form={form} />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-greenly-light">
          <table className="w-full">
            <thead>
              <tr className="border-b border-greenly-light bg-greenly-off-white">
                <th className="px-6 py-3 text-left text-xs font-semibold text-greenly-slate uppercase tracking-wider">Form Details</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-greenly-slate uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-greenly-slate uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-greenly-slate uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-greenly-slate uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-greenly-light">
              {filteredForms.map(form => <FormListItem key={form.id} form={form} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
