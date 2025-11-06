import React from 'react';

/**
 * FeatureCard Component
 * 개별 기능 카드
 */
const FeatureCard = ({ icon: Icon, title, description, colorClass }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-red-50 text-red-500'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[colorClass]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
