import { useCallback, useEffect, useState } from 'react';

const cache: Map<string, unknown> = new Map();

export const useFetch = <T>(cacheKey: string, fetch: () => Promise<T>) => {
  const getSnapshot = useCallback(() => {
    const cacheData = cache.get(cacheKey) as T | undefined;

    if (cacheData === undefined) {
      throw fetch().then((result) => {
        cache.set(cacheKey, result);
      });
    }

    return cacheData;
  }, [cacheKey, fetch]);

  const [state, setState] = useState<T>(() => getSnapshot());

  const currentResult = state;

  useEffect(() => {
    setState(() => getSnapshot());

    return () => {
      cache.delete(cacheKey);
    };
  }, [cacheKey]);

  const reFetch = useCallback(() => {
    setTimeout(() => {
      cache.delete(cacheKey);
      setState(() => getSnapshot());
    }, 500);
  }, [cacheKey, fetch]);

  return [currentResult, reFetch] as const;
};
