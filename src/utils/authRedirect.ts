
export const createLoginRedirect = (fromAction?: 'booking' | 'listing' | 'profile', returnTo?: string) => {
  return {
    pathname: '/login',
    state: {
      fromAction,
      returnTo: returnTo || '/profile'
    }
  };
};

export const requireAuth = (navigate: any, currentPath: string, fromAction?: 'booking' | 'listing' | 'profile') => {
  navigate(createLoginRedirect(fromAction, currentPath));
};
