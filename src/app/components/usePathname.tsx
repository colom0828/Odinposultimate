import { useState, useEffect } from 'react';

export function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // También escuchar eventos personalizados de navegación
    const handleNavigation = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('navigate', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigation);
    };
  }, []);

  return pathname;
}
