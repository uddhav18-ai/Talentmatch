import React from 'react';
import { Button } from '@/components/ui/button';

interface ChallengeCardProps {
  category: string;
  categoryColor: string;
  title: string;
  description: string;
  skills: string[];
  timeEstimate: string;
  completions: number;
  accentColor: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  category,
  categoryColor,
  title,
  description,
  skills,
  timeEstimate,
  completions,
  accentColor
}) => {
  // Define background colors based on category
  const getBgColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'indigo': return 'bg-indigo-100 text-indigo-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Define pill background colors 
  const getPillColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700';
      case 'green': return 'bg-green-50 text-green-700';
      case 'indigo': return 'bg-indigo-50 text-indigo-700';
      case 'red': return 'bg-red-50 text-red-700';
      case 'yellow': return 'bg-yellow-50 text-yellow-700';
      case 'purple': return 'bg-purple-50 text-purple-700';
      default: return 'bg-blue-50 text-blue-700';
    }
  };
  
  // Define button background colors
  const getButtonColorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-primary text-white hover:bg-blue-600';
      case 'green': return 'bg-secondary text-white hover:bg-green-600';
      case 'indigo': return 'bg-accent text-white hover:bg-indigo-600';
      case 'red': return 'bg-status-error text-white hover:bg-red-600';
      case 'yellow': return 'bg-status-warning text-white hover:bg-yellow-600';
      case 'purple': return 'bg-purple-600 text-white hover:bg-purple-700';
      default: return 'bg-primary text-white hover:bg-blue-600';
    }
  };
  
  const categoryColorClass = getBgColorClass(categoryColor);
  const pillColorClass = getPillColorClass(categoryColor);
  const buttonColorClass = getButtonColorClass(accentColor);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover-scale transition-transform duration-200 ease-out">
      <div className={`h-3 ${accentColor.includes('bg-') ? accentColor : `bg-${accentColor}`}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${categoryColorClass}`}>
            {category}
          </span>
          <span className="text-gray-500 text-sm">{timeEstimate}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Skills Verified:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className={`px-2 py-0.5 rounded text-xs ${pillColorClass}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-6 h-6 rounded-full border border-white bg-gray-300 flex items-center justify-center"
                >
                  <i className="fas fa-user text-xs text-gray-500"></i>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">{completions} completed</span>
          </div>
          <Button className={`px-3 py-1 text-sm font-medium rounded transition-colors ${buttonColorClass}`}>
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
