export const QueryKeys = {
  auth: {
    all: ['auth'] as const,
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  users: {
    all: ['users'] as const,
    current: ['users', 'me'],
    lists: ['users', 'list'] as const,
  },
  tasteProfile: {
    all: ['tasteProfile'] as const,
    me: ['tasteProfile', 'me'],
  },

  menuItem: {
    list: ['menu-items', 'items'],
    recommended: ['menu-items', 'recommended'],
  },

  mealPlan: {
    all: ['meal-plan'] as const,
    packages: ['meal-plan', 'packages'] as const,
    menuItems: ['meal-plan', 'menu-items'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    list: ['notifications', 'list'] as const,
    unread: ['notifications', 'unread'] as const,
  },
};
