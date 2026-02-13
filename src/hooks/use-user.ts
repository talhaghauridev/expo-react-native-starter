import { usersApi } from '@/api/users';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useErrorHandler } from './use-error-handler';

export function useUser() {
  const { accessToken, setUser } = useAuthStore();

  const queryState = useQuery({
    queryKey: QUERY_KEYS.auth.user,
    queryFn: usersApi.getCurrentUser,
    enabled: !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (queryState.isSuccess && queryState.data?.data?.user) {
      setUser(queryState.data.data.user);
    }
  }, [queryState.isSuccess, queryState.data, setUser]);

  useErrorHandler(queryState.isError && queryState.error);

  return queryState;
}
