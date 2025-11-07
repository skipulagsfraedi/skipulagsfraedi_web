import type {PageTreeItem} from './pages';

export type NavigationItem = {
  href: string;
  label: string;
  children?: NavigationItem[];
};

const staticNavItems: NavigationItem[] = [{href: '/frettir', label: 'Fréttir'}];

export const getNavigationItems = (pages: PageTreeItem[]): NavigationItem[] => {
  const dynamicNavItems = pages
    .filter((page) => page.slug && page.slug !== 'index' && page.slug !== 'frettir')
    .map<NavigationItem>((page) => {
      const children = (page.children ?? [])
        .filter((child) => child.slug && child.slug !== 'index')
        .map<NavigationItem>((child) => ({
          href: `/${page.slug}/${child.slug}`,
          label: child.title,
        }));

      return {
        href: `/${page.slug}`,
        label: page.title,
        ...(children.length ? {children} : {}),
      };
    });

  return [...staticNavItems, ...dynamicNavItems];
};
