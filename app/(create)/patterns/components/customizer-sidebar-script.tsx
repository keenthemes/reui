"use client"

import Script from "next/script"

export const CUSTOMIZER_FORWARD_TYPE = "customizer-forward"

export function CustomizerSidebarScript() {
  return (
    <Script
      id="customizer-sidebar-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward C key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${CUSTOMIZER_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}
