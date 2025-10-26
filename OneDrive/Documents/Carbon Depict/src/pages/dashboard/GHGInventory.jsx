// Cache bust 2025-10-23
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Zap, Globe, CheckCircle2, TrendingUp, Target } from '@atoms/Icon';

const GHGInventory = () => {
  // This data would typically come from a global state or API
  const scopeData = {
    scope1: {
      emissions: 1250.75,
      progress: 85,
      status: 'In Progress',
      sources: 4,
    },
    scope2: {
      emissions: 3450.20,
      progress: 95,
      status: 'In Progress',
      sources: 2,
    },
    scope3: {
      emissions: 15200.50,
      progress: 40,
      status: 'In Progress',
      sources: 8,
    },
  };

  const totalEmissions = scopeData.scope1.emissions + scopeData.scope2.emissions + scopeData.scope3.emissions;

  const ScopeCard = ({ scope, title, description, icon, data, link }) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${scope === 'scope1' ? 'text-red-500' : scope === 'scope2' ? 'text-yellow-500' : 'text-blue-500'}`} />
            <div>
              <h2 className="text-lg font-bold text-midnight">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{scope.replace('scope', 'Scope ')}</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Emissions (tCO₂e)</p>
            <p className="text-xl font-semibold text-midnight">{data.emissions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Data Sources</p>
            <p className="text-xl font-semibold text-midnight">{data.sources}</p>
          </div>
        </div>
        <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-xs font-medium text-midnight">{data.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: `${data.progress}%` }}></div>
            </div>
        </div>
        <Link to={link}>
          <button className="mt-6 w-full px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
            {data.progress < 100 ? 'Continue Data Entry' : 'View Details'}
          </button>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard/esg/data-entry" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-midnight">GHG Emissions Inventory</h1>
              <p className="text-sm text-gray-600 mt-1">Manage Scope 1, 2, and 3 emissions data.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-teal"/>
                    <div>
                        <p className="text-sm text-gray-500">Total GHG Emissions</p>
                        <p className="text-2xl font-bold text-midnight">{totalEmissions.toLocaleString()} tCO₂e</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500"/>
                    <div>
                        <p className="text-sm text-gray-500">Overall Progress</p>
                        <p className="text-2xl font-bold text-midnight">73%</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <Target className="w-8 h-8 text-red-500"/>
                    <div>
                        <p className="text-sm text-gray-500">Alignment</p>
              <p className="text-2xl font-bold text-midnight">SBTi 1.5°C Path</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScopeCard
            scope="scope1"
            title="Scope 1: Direct Emissions"
            description="Emissions from owned or controlled sources."
            icon={Flame}
            data={scopeData.scope1}
            link="/dashboard/emissions/scope1"
          />
          <ScopeCard
            scope="scope2"
            title="Scope 2: Indirect Emissions"
            description="From purchased electricity, steam, heating, and cooling."
            icon={Zap}
            data={scopeData.scope2}
            link="/dashboard/emissions/scope2"
          />
          <ScopeCard
            scope="scope3"
            title="Scope 3: Value Chain Emissions"
            description="All other indirect emissions in the value chain."
            icon={Globe}
            data={scopeData.scope3}
            link="/dashboard/emissions/scope3"
          />
        </div>
      </div>
    </div>
  );
};

export default GHGInventory;

