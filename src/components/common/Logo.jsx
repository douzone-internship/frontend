import React from 'react';
import { FaStethoscope } from 'react-icons/fa';

/**
 * Logo Component
 * 재사용 가능한 로고 컴포넌트
 */
const Logo = () => (
  <div className="flex items-center gap-2">
    <FaStethoscope size={24} className="text-primary" />
    <span className="text-xl font-bold text-gray-900">얼마닥</span>
  </div>
);

export default Logo;
