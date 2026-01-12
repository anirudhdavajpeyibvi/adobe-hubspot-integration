import config from '../config/env.js';
import logger from './logger.js';

/**
 * Retries an async function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Result of the function
 */
export async function retry(fn, maxAttempts = null, delay = null) {
  const attempts = maxAttempts || config.sync.retryAttempts;
  const initialDelay = delay || config.sync.retryDelay;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === attempts) {
        logger.error(`Max retry attempts (${attempts}) reached`, {
          error: error.message,
        });
        throw error;
      }

      const waitTime = initialDelay * Math.pow(2, attempt - 1);
      logger.warn(`Retry attempt ${attempt}/${attempts} after ${waitTime}ms`, {
        error: error.message,
      });

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}



