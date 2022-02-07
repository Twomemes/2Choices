

import fetch from 'node-fetch';



export const fetcher: <T>(...args: Parameters<typeof fetch>) => Promise<T> = (...args) =>
  fetch(...args).then((x) => x.json());
