import navigationFixture from '../fixtures/navigation-fixtures.json';

export type NavigationItem = {
  label: string;
  expectedPath: string;
};

export type NavigationMenu = {
  triggerLabel: string;
  fallbackTriggerId?: string;
  items: NavigationItem[];
};

type NavigationFixtureShape = Record<string, NavigationMenu>;

const fixture = navigationFixture as NavigationFixtureShape;

export const getNavigationMenu = (menuKey: string): NavigationMenu => {
  const menu = fixture[menuKey];
  if (!menu) {
    throw new Error(`No navigation fixture was found for key "${menuKey}".`);
  }

  return menu;
};
