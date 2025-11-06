import React from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * Badge Component
 * AI 기능을 강조하는 배지
 */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
    <FaStar className="text-xs" />
    {children}
  </span>
);

export default Badge;
