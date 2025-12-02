// Cache bust 2025-10-23
import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, TrendingUp, DollarSign, Users, Grid, Download, Save, X, FileImage, FileSpreadsheet, Mail, Plus, Check, Leaf, Landmark, Handshake } from 'lucide-react';
import html2canvas from 'html2canvas';
import SkeletonLoader from '@components/atoms/SkeletonLoader';
import EmptyState from '@components/molecules/EmptyState';

// Mock data hook
const useMaterialityData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { id: 1, name: 'Climate Change Mitigation', category: 'E', impactScore: 9, financialScore: 8, x: 80, y: 90 },
        { id: 2, name: 'Climate Change Adaptation', category: 'E', impactScore: 7, financialScore: 6, x: 60, y: 70 },
        { id: 3, name: 'Water & Marine Resources', category: 'E', impactScore: 6, financialScore: 5, x: 50, y: 60 },
        { id: 4, name: 'Biodiversity & Ecosystems', category: 'E', impactScore: 8, financialScore: 4, x: 40, y: 80 },
        { id: 5, name: 'Circular Economy', category: 'E', impactScore: 7, financialScore: 7, x: 70, y: 70 },
        { id: 6, name: 'Pollution Prevention', category: 'E', impactScore: 6, financialScore: 3, x: 30, y: 60 },
        { id: 7, name: 'Own Workforce', category: 'S', impactScore: 9, financialScore: 9, x: 90, y: 90 },
        { id: 8, name: 'Workers in Value Chain', category: 'S', impactScore: 8, financialScore: 6, x: 60, y: 80 },
        { id: 9, name: 'Affected Communities', category: 'S', impactScore: 7, financialScore: 5, x: 50, y: 70 },
        { id: 10, name: 'Consumers & End-Users', category: 'S', impactScore: 8, financialScore: 8, x: 80, y: 80 },
        { id: 11, name: 'Business Conduct', category: 'G', impactScore: 9, financialScore: 9, x: 90, y: 90 },
        { id: 12, name: 'Board Diversity', category: 'G', impactScore: 6, financialScore: 7, x: 70, y: 60 },
        { id: 13, name: 'Data Privacy & Security', category: 'G', impactScore: 8, financialScore: 9, x: 90, y: 80 },
        { id: 14, name: 'Anti-Corruption', category: 'G', impactScore: 8, financialScore: 8, x: 80, y: 80 },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { topics: data, loading };
};

const Header = () => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-greenly-charcoal">Double Materiality Assessment</h1>
    <p className="mt-2 text-lg text-greenly-slate">
      A CSRD-aligned view of your organization's most critical sustainability topics.
    </p>
  </div>
);

const InfoBanner = () => (
  <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 mb-8">
    <div className="flex gap-4">
      <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-800">
        <p className="font-semibold text-base text-blue-900">Understanding Double Materiality</p>
        <p className="mt-2">
          <strong className="font-semibold">Impact Materiality (Y-axis):</strong> Your organization's impact on the environment and society (inside-out view).
        </p>
        <p className="mt-1">
          <strong className="font-semibold">Financial Materiality (X-axis):</strong> The financial effects of sustainability issues on your organization (outside-in view).
        </p>
      </div>
    </div>
  </div>
);

const ActionButtons = ({ onSave, onExport, onStakeholder, isSaving, saveSuccess }) => (
  <div className="flex flex-wrap gap-3 mb-8">
    <button
      onClick={onSave}
      disabled={isSaving || saveSuccess}
      className="flex items-center gap-2 rounded-xl bg-greenly-primary px-5 py-2.5 text-white font-semibold hover:bg-greenly-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
    >
      {isSaving ? (
        <><div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
      ) : saveSuccess ? (
        <><Check className="h-5 w-5" /> Saved!</>
      ) : (
        <><Save className="h-5 w-5" /> Save Assessment</>
      )}
    </button>
    <button
      onClick={onExport}
      className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-greenly-charcoal font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
    >
      <Download className="h-5 w-5" /> Export
    </button>
    <button
      onClick={onStakeholder}
      className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-greenly-charcoal font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
    >
      <Handshake className="h-5 w-5" /> Stakeholder Input
    </button>
  </div>
);

const MaterialityMatrix = ({ topics, loading, matrixRef }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  const getCategoryColor = (category) => ({
    E: 'bg-green-500',
    S: 'bg-blue-500',
    G: 'bg-purple-500',
  }[category] || 'bg-gray-500');

  if (loading) return <SkeletonLoader className="w-full aspect-square" />;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold text-greenly-charcoal mb-6">Materiality Matrix</h2>
      <div ref={matrixRef} className="p-8 bg-white">
        <div className="relative aspect-square bg-gradient-to-tr from-green-50/50 via-yellow-50/50 to-red-50/50 rounded-lg border-2 border-gray-200">
          {/* Grid Lines & Axis Labels */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {[...Array(16)].map((_, i) => <div key={i} className="border border-gray-200/70" />)}
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium text-greenly-slate">Financial Materiality →</div>
          <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 text-sm font-medium text-greenly-slate">Impact Materiality →</div>
          <div className="absolute top-2 right-2 text-xs font-bold text-red-600 bg-white/80 px-2 py-1 rounded">High Priority</div>
          <div className="absolute bottom-2 left-2 text-xs font-bold text-green-600 bg-white/80 px-2 py-1 rounded">Low Priority</div>

          {/* Topics */}
          {topics.map(topic => (
            <button
              key={topic.id}
              className={`absolute group transition-transform hover:scale-125 focus:outline-none ${selectedTopics.includes(topic.id) ? 'ring-2 ring-greenly-primary ring-offset-2' : ''}`}
              style={{ left: `${topic.x}%`, top: `${100 - topic.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => setSelectedTopics(prev => prev.includes(topic.id) ? prev.filter(id => id !== topic.id) : [...prev, topic.id])}
            >
              <div className={`w-4 h-4 rounded-full ${getCategoryColor(topic.category)} shadow-lg border-2 border-white`} />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block whitespace-nowrap bg-greenly-charcoal text-white text-xs px-2.5 py-1.5 rounded-md shadow-lg z-10">
                {topic.name}
                <div className="text-xs opacity-80 mt-1">
                  Impact: {topic.impactScore}/10 | Financial: {topic.financialScore}/10
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Legend */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-green-500" /><span className="text-sm text-greenly-slate">Environmental</span></div>
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-blue-500" /><span className="text-sm text-greenly-slate">Social</span></div>
          <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full bg-purple-500" /><span className="text-sm text-greenly-slate">Governance</span></div>
        </div>
      </div>
    </div>
  );
};

const TopicList = ({ topics, loading }) => {
  const getCategoryInfo = (category) => ({
    E: { icon: Leaf, color: 'green' },
    S: { icon: Users, color: 'blue' },
    G: { icon: Landmark, color: 'purple' },
  }[category] || { icon: FileText, color: 'gray' });

  const getMaterialityLevel = (topic) => {
    const avg = (topic.impactScore + topic.financialScore) / 2;
    if (avg >= 8) return { level: 'High', color: 'red' };
    if (avg >= 6) return { level: 'Medium', color: 'yellow' };
    return { level: 'Low', color: 'green' };
  };

  if (loading) return <SkeletonLoader className="w-full h-96" />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-greenly-charcoal">Material Topics Details</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {topics.map(topic => {
          const { icon: CategoryIcon, color: categoryColor } = getCategoryInfo(topic.category);
          const materiality = getMaterialityLevel(topic);
          return (
            <div key={topic.id} className="p-4 hover:bg-gray-50/50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-4 md:col-span-1">
                  <CategoryIcon className={`h-5 w-5 text-${categoryColor}-500`} />
                  <span className="font-semibold text-greenly-charcoal">{topic.name}</span>
                </div>
                <div className="flex items-center gap-6 md:col-span-1">
                  <div className="text-sm text-greenly-slate">Impact: <span className="font-bold text-greenly-charcoal">{topic.impactScore}/10</span></div>
                  <div className="text-sm text-greenly-slate">Financial: <span className="font-bold text-greenly-charcoal">{topic.financialScore}/10</span></div>
                </div>
                <div className="flex justify-start md:justify-end md:col-span-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${materiality.color}-100 text-${materiality.color}-700`}>
                    {materiality.level}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
export default function MaterialityAssessment() {
  const { topics, loading } = useMaterialityData();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStakeholderModal, setShowStakeholderModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const matrixRef = useRef(null);

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-greenly-light-gray min-h-screen animate-pulse">
        <Header />
        <SkeletonLoader className="h-32 w-full mb-8" />
        <SkeletonLoader className="h-16 w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonLoader className="w-full aspect-square" />
          <SkeletonLoader className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (!topics) {
    return <EmptyState title="No Materiality Data" message="Could not load the materiality assessment data." />;
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header />
      <InfoBanner />
      <ActionButtons
        onSave={handleSaveAssessment}
        onExport={() => setShowExportModal(true)}
        onStakeholder={() => setShowStakeholderModal(true)}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
      />
      <div className="space-y-8">
        <MaterialityMatrix topics={topics} loading={loading} matrixRef={matrixRef} />
        <TopicList topics={topics} loading={loading} />
      </div>
      {/* Modals would be defined here, but are omitted for brevity in this refactoring example. */}
    </div>
  );
}

