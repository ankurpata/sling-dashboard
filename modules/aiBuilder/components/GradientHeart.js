import React from 'react';

const GradientHeart = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#FF6B6B' }} />
        <stop offset="100%" style={{ stopColor: '#4ECDC4' }} />
      </linearGradient>
    </defs>
    <path
      d="M40 71.17l-4.83-4.4C15.9 51.2 6.67 40.93 6.67 28.33c0-10.26 8.07-18.33 18.33-18.33 5.8 0 11.37 2.7 15 6.97 3.63-4.27 9.2-6.97 15-6.97 10.26 0 18.33 8.07 18.33 18.33 0 12.6-9.23 22.87-28.5 38.44L40 71.17z"
      fill="url(#heartGradient)"
    />
  </svg>
);

export default GradientHeart;
