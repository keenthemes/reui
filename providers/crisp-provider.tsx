'use client';

import dynamic from 'next/dynamic';

/**
 * Crisp Provider Component
 *
 * Client-side wrapper for Crisp chat integration.
 * Handles dynamic import with SSR disabled to prevent hydration issues.
 */
const CrispWithNoSSR = dynamic(() => import('@/components/crisp-chat'), { ssr: false });

const CrispProvider = () => {
  return <CrispWithNoSSR />;
};

export default CrispProvider;
