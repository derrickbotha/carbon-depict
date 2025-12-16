/**
 * Reusable Export Button with format selection dropdown
 * Supports CSV, Excel, JSON, and PDF exports
 */
import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';

const ExportButton = ({
  onExport,
  disabled = false,
  loading = false,
  formats = ['csv', 'xlsx', 'json', 'pdf'],
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setShowMenu(false);
    setExporting(true);
    try {
      await onExport(format);
    } finally {
      setExporting(false);
    }
  };

  const formatLabels = {
    csv: 'Export as CSV',
    xlsx: 'Export as Excel',
    json: 'Export as JSON',
    pdf: 'Export as PDF'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || loading || exporting}
        className="btn-secondary flex items-center gap-2"
      >
        {exporting ? (
          <Loader size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {exporting ? 'Exporting...' : 'Export'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-greenly-light-gray z-20">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="w-full px-4 py-2 text-left hover:bg-greenly-light-gray text-sm transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {formatLabels[format] || `Export as ${format.toUpperCase()}`}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
