import { useFetch } from './useFetch';

export const useVectorStore = () => {
  const [result, reFetch] = useFetch('vectorStores', () => {
    return fetch('http://localhost:3000/api/readVectorStore', { cache: 'no-cache' }).then((res) => res.json());
  });

  return [result, reFetch] as const;
};
