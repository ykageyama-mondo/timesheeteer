import {delay} from './delay'

export const retryUntilTrue = async (
  maxRetries: number,
  fn: () => Promise<boolean> | (() => boolean)
) => {
  let retries = 0;
  while (!(await fn()) && retries < maxRetries) {
    await delay(100);
    retries++;
  }
  if (retries >= maxRetries) {
    throw new Error('Max retries reached');
  }
};
