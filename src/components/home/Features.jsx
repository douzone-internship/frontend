import React from 'react';
import { FaChartLine, FaStar, FaShieldAlt } from 'react-icons/fa';
import FeatureCard from './FeatureCard';

/**
 * Features Component
 * 주요 기능 소개 섹션
 */
const Features = () => {
  const features = [
    {
      icon: FaChartLine,
      title: '가격 비교',
      description: '여러 병원의 가격을 한눈에 비교',
      colorClass: 'primary'
    },
    {
      icon: FaStar,
      title: 'AI 분석',
      description: 'AI가 분석한 합리적인 추천',
      colorClass: 'secondary'
    },
    {
      icon: FaShieldAlt,
      title: '투명한 정보',
      description: '신뢰할 수 있는 가격 정보',
      colorClass: 'accent'
    }
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </section>
  );
};

export default Features;
