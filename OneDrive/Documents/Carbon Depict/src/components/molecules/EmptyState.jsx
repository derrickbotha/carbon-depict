// src/components/molecules/EmptyState.jsx
import React from 'react';
import { Info } from '@atoms/Icon'; // Assuming you have an Info icon

const EmptyState = ({
  icon: Icon = Info,
  title = "No Data Available",
  message = "There is no data to display at the moment.",
  actions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-greenly-light rounded-lg bg-greenly-off-white">
      <div className="bg-greenly-light p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-greenly-sage-700" />
      </div>
      <h3 className="text-xl font-semibold text-greenly-charcoal-700 mb-2">{title}</h3>
      <p className="text-greenly-charcoal-500 max-w-sm mb-6">{message}</p>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default EmptyState;
