'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { trackEvent } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;

    // Track page view using Next.js
    if (typeof window !== 'undefined') {
      trackEvent({
        name: 'page_view',
        properties: {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href,
        },
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
							page_path: window.location.pathname,
							send_page_view: false // Disable automatic page views as we'll handle them manually
						});
					`,
        }}
      />
    </>
  );
}
