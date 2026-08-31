import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

export function buildUserFilterSearch(searchParams: URLSearchParams, userUuid: string): string {
  const next = new URLSearchParams(searchParams);
  next.set('user', userUuid);
  return `?${next.toString()}`;
}

export function useUserFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterUserUuid = searchParams.get('user');

  const setFilterUserUuid = useCallback(
    (userUuid: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (userUuid) {
            next.set('user', userUuid);
          } else {
            next.delete('user');
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { filterUserUuid, setFilterUserUuid };
}
