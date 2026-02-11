"use client"

import Script from "next/script"

export const PATTERNS_SIDEBAR_FORWARD_TYPE = "patterns-sidebar-forward"

export function PatternsSidebarScript() {
  return (
    <Script
      id="patterns-sidebar-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward P key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey) {
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
                      type: '${PATTERNS_SIDEBAR_FORWARD_TYPE}',
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
