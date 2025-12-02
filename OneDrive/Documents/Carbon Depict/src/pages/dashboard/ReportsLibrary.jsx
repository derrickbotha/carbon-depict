// Cache bust 2025-10-23
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Download, FileText, Calendar, CheckCircle, Loader2, BarChart2, FileUp, FileDown } from 'lucide-react';
import { enterpriseAPI } from '../../services/enterpriseAPI'; // Assuming API service exists

// --- HOOK ---
const useReportsLibrary = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([
    // Mock data, in a real app this would be fetched
    { id: 1, name: 'GRI Standards Report 2023', framework: 'GRI', type: 'Annual', status: 'Published', date: '2024-03-15', size: '2.4 MB' },
    { id: 2, name: 'TCFD Climate Disclosure 2023', framework: 'TCFD', type: 'Annual', status: 'Published', date: '2024-02-20', size: '1.8 MB' },
    { id: 3, name: 'CDP Climate Change Response', framework: 'CDP', type: 'Questionnaire', status: 'Draft', date: '2024-06-01', size: '3.1 MB' },
    { id: 4, name: 'CSRD ESG Report Q1 2024', framework: 'CSRD', type: 'Quarterly', status: 'In Progress', date: '2024-04-30', size: '1.2 MB' },
  ]);
  const [isLoading, setIsLoading] = useState(false); // For future API calls

  const reportStats = useMemo(() => ({
    total: reports.length,
    published: reports.filter(r => r.status === 'Published').length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    drafts: reports.filter(r => r.status === 'Draft').length,
  }), [reports]);

  const handleDownload = (reportId) => {
    console.log(`Downloading report ${reportId}`);
    // In a real app: call API to get file, then use file-saver
  };

  return {
    reports,
    isLoading,
    reportStats,
    handleDownload,
    navigate,
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ onGenerateReport }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-4xl font-bold text-greenly-charcoal">Reports Library</h1>
      <p className="mt-2 text-lg text-greenly-slate">
        Access and manage all your generated ESG and sustainability reports.
      </p>
    </div>
    <Link
      to="/dashboard/report-generator"
      className="flex items-center gap-2 rounded-xl bg-greenly-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-greenly-primary/90 transition-all shadow-sm"
    >
      <Plus className="h-5 w-5" />
      Generate New Report
    </Link>
  </div>
);

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full ${colorClass || 'bg-gray-100'}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-greenly-slate">{label}</p>
      <p className="text-3xl font-bold text-greenly-charcoal">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Published: 'bg-green-100 text-green-800 border-green-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Draft: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${statusStyles[status] || statusStyles.Draft}`}>
      {status}
    </span>
  );
};

const ReportsTable = ({ reports, onDownload }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Report Name', 'Framework', 'Type', 'Status', 'Date', 'Size', ''].map(header => (
              <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-greenly-slate uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map(report => (
            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-greenly-primary" />
                  <span className="font-semibold text-greenly-charcoal">{report.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
                  {report.framework}
                </span>
              </td>
              <td className="px-6 py-4 text-greenly-slate whitespace-nowrap">{report.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={report.status} />
              </td>
              <td className="px-6 py-4 text-greenly-slate whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-greenly-slate whitespace-nowrap">{report.size}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <button onClick={() => onDownload(report.id)} className="p-2 rounded-lg text-greenly-slate hover:bg-gray-100 hover:text-greenly-primary transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function ReportsLibrary() {
  const { reports, isLoading, reportStats, handleDownload, navigate } = useReportsLibrary();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-greenly-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header onGenerateReport={() => navigate('/dashboard/report-generator')} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={FileText} label="Total Reports" value={reportStats.total} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={FileUp} label="Published" value={reportStats.published} colorClass="bg-green-100 text-green-600" />
        <StatCard icon={Loader2} label="In Progress" value={reportStats.inProgress} colorClass="bg-yellow-100 text-yellow-600" />
        <StatCard icon={FileDown} label="Drafts" value={reportStats.drafts} colorClass="bg-gray-200 text-gray-600" />
      </div>

      <ReportsTable reports={reports} onDownload={handleDownload} />
    </div>
  );
}

