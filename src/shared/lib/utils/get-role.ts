export const getUserRole = (email: string) => {
  switch (email) {
    case 'admin@example.com':
      return 'admin';
    case 'test@example.com':
      return 'coaches';
    default:
      return 'user';
  }
};
