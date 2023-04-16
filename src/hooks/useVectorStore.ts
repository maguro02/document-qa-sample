import { useFetch } from './useFetch';

export const useVectorStore = async () => {
  // const [result, reFetch] = useFetch('vectorStores', () => {
  //   return fetch('/api/readVectorStore').then((res) => res.json());
  // });

  // return [result, reFetch] as const;

  return await fetch('/api/readVectorStore').then((res) => res.json());
};
