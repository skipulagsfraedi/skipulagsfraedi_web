// src/lib/navigation.ts - Build ordered navigation items from the Sanity page tree.
import type {PageTreeItem} from './pages';

export type NavigationItem = {
  href: string;
  label: string;
  children?: NavigationItem[];
};

const staticNavItems: NavigationItem[] = [{href: '/frettir', label: 'Fréttir'}];

const sortByOrderRank = <T extends {orderRank?: string | null; title: string}>(items: T[]) =>
  [...items].sort((a, b) => {
    const rankA = a.orderRank ?? '';
    const rankB = b.orderRank ?? '';

    if (rankA === rankB) {
      return a.title.localeCompare(b.title);
    }

    return rankA.localeCompare(rankB);
  });

export const getNavigationItems = (pages: PageTreeItem[]): NavigationItem[] => {
  const orderedPages = sortByOrderRank(pages).filter(
    (page) => page.slug && page.slug !== 'index' && page.slug !== 'frettir'
  );

  const dynamicNavItems = orderedPages.map<NavigationItem>((page) => {
    const children = sortByOrderRank(page.children ?? [])
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
