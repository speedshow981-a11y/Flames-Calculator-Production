import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCalculatorById } from './calculators-data';
import { CATEGORIES } from './data/categories';

export type RouteType =
  | { type: 'home' }
  | { type: 'category'; categoryId: string }
  | { type: 'calculator'; calcId: string; slug: string }
  | { type: 'ai-suite' }
  | { type: 'not-found'; path: string }
  | { type: '404'; path: string };

/**
 * Parses the current pathname into a structured RouteType
 */
export function parsePath(pathname: string): RouteType {
  // Normalize pathname: remove query string, hash, trailing slashes (except root)
  const clean = pathname.split('?')[0].split('#')[0];
  const normalized = clean.endsWith('/') && clean.length > 1 ? clean.slice(0, -1) : clean;

  if (normalized === '' || normalized === '/') {
    return { type: 'home' };
  }

  if (normalized === '/ai-suite') {
    return { type: 'ai-suite' };
  }

  // Check /calculators/:slug
  const calcMatch = normalized.match(/^\/calculators\/([a-z0-9-_]+)$/i);
  if (calcMatch) {
    const slug = calcMatch[1].toLowerCase();
    const calc = getCalculatorById(slug);
    if (calc) {
      return { type: 'calculator', calcId: slug, slug };
    }
    return { type: 'not-found', path: pathname };
  }

  // Check /category/:categoryId
  const catMatch = normalized.match(/^\/category\/([a-z0-9-_]+)$/i);
  if (catMatch) {
    const catId = catMatch[1].toLowerCase();
    if (catId === 'all') {
      return { type: 'home' };
    }
    if (catId === 'ai-suite') {
      return { type: 'ai-suite' };
    }
    const catExists = CATEGORIES.some((c) => c.id === catId);
    if (catExists) {
      return { type: 'category', categoryId: catId };
    }
    return { type: 'not-found', path: pathname };
  }

  return { type: 'not-found', path: pathname };
}

interface RouterContextType {
  route: RouteType;
  pathname: string;
  navigate: (url: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  route: { type: 'home' },
  pathname: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const [route, setRoute] = useState<RouteType>(() => parsePath(pathname));

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setPathname(currentPath);
      setRoute(parsePath(currentPath));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (url: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
      if (typeof window === 'undefined') return;

      // Normalize target URL (ensure leading slash, strip domain if internal)
      let targetPath = url;
      try {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          const parsed = new URL(url);
          if (parsed.origin === window.location.origin) {
            targetPath = parsed.pathname + parsed.search + parsed.hash;
          } else {
            window.location.href = url;
            return;
          }
        }
      } catch (e) {
        targetPath = url;
      }

      if (!targetPath.startsWith('/')) {
        targetPath = `/${targetPath}`;
      }

      if (options?.replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }

      setPathname(targetPath);
      setRoute(parsePath(targetPath));

      if (options?.scrollToTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  return (
    <RouterContext.Provider value={{ route, pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scrollToTop?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * SEO-friendly anchor tag that performs client-side instant navigation
 * while allowing search engine bots, middle-clicks, cmd/ctrl-clicks to function natively.
 */
export const Link: React.FC<LinkProps> = ({
  href,
  replace = false,
  scrollToTop = true,
  onClick,
  className,
  children,
  ...rest
}) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Allow default browser behaviour for modifier keys (e.g. open in new tab)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    // Check if external link
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    e.preventDefault();
    navigate(href, { replace, scrollToTop });
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
