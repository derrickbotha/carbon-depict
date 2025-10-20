import React from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

/**
 * Framework Progress Bar Component
 * Displays compliance progress for ESG frameworks
 * Shows percentage completion with color-coded visual feedback
 */
const FrameworkProgressBar = ({ 
  framework,
  completionPercentage = 0,
  totalFields = 0,
  completedFields = 0,
  showDetails = true,
  size = 'md'
}) => {
  // Determine status color based on completion
  const getStatusColor = () => {
    if (completionPercentage >= 80) return 'bg-mint text-midnight';
    if (completionPercentage >= 50) return 'bg-teal text-white';
    if (completionPercentage >= 25) return 'bg-cedar text-white';
    return 'bg-gray-200 text-gray-600';
  };

  const getProgressBarColor = () => {
    if (completionPercentage >= 80) return 'bg-mint';
    if (completionPercentage >= 50) return 'bg-teal';
    if (completionPercentage >= 25) return 'bg-cedar';
    return 'bg-gray-300';
  };

  const getIcon = () => {
    if (completionPercentage >= 80) return <CheckCircle2 className="w-4 h-4" />;
    if (completionPercentage >= 25) return <Circle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';

  return (
    <div className="w-full">
      {/* Header with framework name and percentage */}
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
              {framework}
            </span>
            {getIcon()}
          </div>
          <div className="text-sm font-semibold text-midnight">
            {completionPercentage.toFixed(0)}%
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className={`w-full ${heightClass} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${heightClass} ${getProgressBarColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.min(completionPercentage, 100)}%` }}
        />
      </div>

      {/* Field completion details */}
      {showDetails && (
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>
            {completedFields} of {totalFields} fields completed
          </span>
          <span>
            {totalFields - completedFields} remaining
          </span>
        </div>
      )}
    </div>
  );
};

export default FrameworkProgressBar;
