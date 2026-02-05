export const QUERY_KEYS = {
  auth: {
    all: ['auth'] as const,
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    list: ['notifications', 'list'] as const,
    unread: ['notifications', 'unread'] as const,
  },
};
