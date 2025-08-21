'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

/**
 * Crisp Chat Component
 *
 * Integrates Crisp live chat widget into the application.
 * Uses Next.js 13+ App Router compatible patterns with "use client" directive.
 *
 * Configuration:
 * - Requires NEXT_PUBLIC_CRISP_WEBSITE_ID environment variable
 * - Falls back to placeholder ID for development
 * - Prevents SSR issues with client-side only rendering
 */
const CrispChat = () => {
  useEffect(() => {
    // Get Crisp Website ID from environment variable or use placeholder
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'b665d310-35bb-4799-8e4f-1e249dd5fd54';

    // Configure Crisp with the Website ID
    Crisp.configure(websiteId);

    // Optional: Add any additional Crisp configurations here
    // Example: Crisp.setTokenId("user_token")
    // Example: Crisp.setUserEmail("user@example.com")
  }, []);

  // Return null as this is a headless component
  return null;
};

export default CrispChat;
