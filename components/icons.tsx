
import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 text-gray-500" }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3.293 8.293a1 1 0 010 1.414L2 11l1.293 1.293a1 1 0 11-1.414 1.414L0 12.414l-1.293 1.293a1 1 0 01-1.414-1.414L-1 11l-1.293-1.293a1 1 0 011.414-1.414L0 9.586l1.293-1.293a1 1 0 011.414 0zm12 0a1 1 0 010 1.414L14 11l1.293 1.293a1 1 0 01-1.414 1.414L12 12.414l-1.293 1.293a1 1 0 01-1.414-1.414L11 11l-1.293-1.293a1 1 0 011.414-1.414L12 9.586l1.293-1.293a1 1 0 011.414 0zM5 14a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" transform="translate(1 1)" />
  </svg>
);

export const ErrorIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12 text-red-500" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
