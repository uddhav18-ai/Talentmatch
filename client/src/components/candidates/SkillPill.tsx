import React, { useState } from 'react';

interface SkillPillProps {
  name: string;
  initialActive?: boolean;
  onToggle?: (name: string, active: boolean) => void;
  removable?: boolean;
  onRemove?: (name: string) => void;
}

const SkillPill: React.FC<SkillPillProps> = ({ 
  name, 
  initialActive = false,
  onToggle,
  removable = false,
  onRemove
}) => {
  const [isActive, setIsActive] = useState(initialActive);

  const handleClick = () => {
    if (removable && onRemove) return;
    
    const newState = !isActive;
    setIsActive(newState);
    if (onToggle) {
      onToggle(name, newState);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(name);
    }
  };

  return (
    <span 
      className={`skill-pill px-3 py-1 ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-50 text-blue-700'
      } rounded-full text-sm cursor-pointer border ${
        isActive ? 'border-blue-600' : 'border-blue-100'
      } transition-all duration-200`}
      onClick={handleClick}
    >
      {name}
      {removable && (
        <button 
          className="ml-1 text-blue-600 hover:text-blue-800"
          onClick={handleRemove}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillPill;
