// Cache bust 2025-10-23
import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from '@atoms/Icon';

const iconMap = {
  success: <Check strokeWidth={2} />,
  warning: <Alert strokeWidth={2} />,
  info: <Info strokeWidth={2} />,
  error: <Alert strokeWidth={2} />,
};

const AlertModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) {
    return null;
  }

  const Icon = iconMap[type];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {Icon && <div className="flex-shrink-0">{Icon}</div>}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-cd-midnight">{title}</h3>
            <p className="text-sm text-cd-muted mt-2">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cd-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cd-teal"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;

