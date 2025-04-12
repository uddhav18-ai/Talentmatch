import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  status?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  label,
  status,
  color = 'bg-primary' 
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      {(label || status) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span>{label}</span>}
          {status && (
            <span className={
              status === 'Verified' ? 'text-green-600' : 
              status === 'In Progress' ? 'text-blue-600' : 
              'text-gray-500'
            }>
              {status} {status === 'Verified' && '✓'}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
