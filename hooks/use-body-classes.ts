'use client';

import { useEffect } from 'react';

const useBodyClasses = (classNames: string) => {
  useEffect(() => {
    // Split classNames by spaces, including multi-line support
    const classes = classNames.split(/\s+/).filter(Boolean);

    // Add each class to the body element when the component mounts
    classes.forEach((className) => {
      document.body.classList.add(className);
    });

    // Cleanup function to remove classes when the component unmounts
    return () => {
      classes.forEach((className) => {
        document.body.classList.remove(className);
      });
    };
  }, [classNames]); // Re-run the effect if classNames changes
};

export default useBodyClasses;
