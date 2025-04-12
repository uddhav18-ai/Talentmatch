import React from 'react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: string;
  iconBgColor: string;
  title: string;
  description: string;
  buttonText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  iconBgColor, 
  title, 
  description, 
  buttonText 
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover-scale p-6 flex flex-col h-full transition-transform duration-200 ease-out">
      <div className={`rounded-full ${iconBgColor} w-12 h-12 flex items-center justify-center mb-4`}>
        <i className={`${icon} text-xl`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <Button 
        variant="ghost" 
        className="mt-4 text-primary font-medium flex items-center justify-start p-0 hover:bg-transparent"
      >
        {buttonText} <i className="fas fa-arrow-right ml-2"></i>
      </Button>
    </div>
  );
};

export default FeatureCard;
