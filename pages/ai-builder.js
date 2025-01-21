import React from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent hydration mismatch
const AIBuilder = dynamic(() => import('../modules/aiBuilder'), {
  ssr: false,
  loading: () => null
});

export default function AIBuilderPage() {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <AIBuilder />
    </div>
  );
}
