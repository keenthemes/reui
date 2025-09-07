import * as React from 'react';

export function useMounted() {
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
