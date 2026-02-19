import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/**
 * Componente Link personalizado para navegación SPA
 * Usa window.history.pushState para evitar recargas de página
 */
export function Link({ href, children, onClick, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Permitir Ctrl+Click para abrir en nueva pestaña
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    e.preventDefault();

    // Navegar usando History API
    window.history.pushState({}, '', href);
    
    // Disparar evento personalizado para que usePathname detecte el cambio
    window.dispatchEvent(new Event('popstate'));

    // Llamar onClick si existe
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
