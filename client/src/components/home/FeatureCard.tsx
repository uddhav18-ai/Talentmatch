import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode | string;
  iconBgColor: string;
  title: string;
  description: string;
  buttonText: string;
  route?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  iconBgColor, 
  title, 
  description, 
  buttonText,
  route = '/'
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover-scale p-6 flex flex-col h-full transition-all duration-200 ease-out border border-gray-100 hover:border-primary">
      <div className={`rounded-full ${iconBgColor} w-12 h-12 flex items-center justify-center mb-4`}>
        {typeof icon === 'string' ? (
          <i className={`${icon} text-xl`}></i>
        ) : (
          icon
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <Link href={route}>
        <Button 
          variant="ghost" 
          className="mt-4 text-primary font-medium flex items-center justify-start p-0 hover:bg-transparent hover:text-blue-700 group"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

export default FeatureCard;
