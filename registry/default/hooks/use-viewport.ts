import { useEffect, useState } from 'react';

type TUseViewport = [number, number];

const useViewport = (): TUseViewport => {
  const [dimensions, setDimensions] = useState<TUseViewport>([
    window.innerHeight,
    window.innerWidth,
  ]);

  useEffect(() => {
    const handleResize = (): void => {
      setDimensions([window.innerHeight, window.innerWidth]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return dimensions;
};

export { useViewport };
