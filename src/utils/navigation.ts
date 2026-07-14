import type { NavItem } from '../config/navigation';

export function findNavigationItem(
  items: readonly NavItem[],
  href: string,
): NavItem | undefined {
  for (const item of items) {
    if (item.href === href) return item;
    const nestedItem = item.children && findNavigationItem(item.children, href);
    if (nestedItem) return nestedItem;
  }

  return undefined;
}

export function flattenNavigation(items: readonly NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenNavigation(item.children) : [])]);
}

export function isNavigationAncestor(item: NavItem, href: string): boolean {
  return Boolean(item.children?.some((child) => child.href === href || isNavigationAncestor(child, href)));
}
