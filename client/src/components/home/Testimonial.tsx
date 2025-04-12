import React from 'react';

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
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div className="bg-white rounded-lg shadow hover-scale p-6 transition-transform duration-200 ease-out">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4 overflow-hidden">
          <i className="fas fa-user text-gray-500"></i>
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{quote}</p>
      <div className="flex items-center">
        <span className="text-yellow-400">{stars}</span>
        {additionalInfo && (
          <span className="ml-2 text-sm text-gray-500">{additionalInfo}</span>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
