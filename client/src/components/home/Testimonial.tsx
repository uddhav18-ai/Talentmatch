import React from 'react';
import { Star, User, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestimonialProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
  additionalInfo?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  name,
  role,
  quote,
  rating,
  additionalInfo
}) => {
  // Create an array for star rating display
  const stars = Array(5).fill(0).map((_, i) => i < rating);

  // Get a background color based on the person's role
  const getBgColor = () => {
    if (role.toLowerCase().includes('engineer') || role.toLowerCase().includes('developer')) {
      return 'bg-blue-500';
    } else if (role.toLowerCase().includes('hr') || role.toLowerCase().includes('director')) {
      return 'bg-green-500';
    } else if (role.toLowerCase().includes('data') || role.toLowerCase().includes('analyst')) {
      return 'bg-indigo-500';
    } else if (role.toLowerCase().includes('cto') || role.toLowerCase().includes('ceo')) {
      return 'bg-purple-500';
    }
    return 'bg-gray-500';
  };

  // Get first letter of name for avatar
  const getInitial = () => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 ease-out h-full">
      <CardContent className="p-6">
        <div className="flex mb-4">
          <Quote className="h-8 w-8 text-gray-300 mr-2 shrink-0" />
        </div>
        
        <p className="text-gray-700 mb-6 italic">{quote}</p>
        
        <div className="flex items-center justify-between mt-auto border-t pt-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${getBgColor()} text-white flex items-center justify-center mr-3 text-xl font-bold`}>
              {getInitial()}
            </div>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex mb-1">
              {stars.map((isFilled, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            {additionalInfo && (
              <Badge variant="outline" className="bg-gray-50">
                {additionalInfo}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Testimonial;
