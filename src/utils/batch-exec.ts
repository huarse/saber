// 批量执行方法
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/30 10:30

import { AnyFunction } from '../interfaces';
import { logger } from './common';

/**
 * 批量执行同步方法
 */
export function batchExecSync(callbacks: AnyFunction<any>[], args?: any[], scope?: any): {
  success: boolean;
  result?: any;
  error?: Error;
}[] {
  return callbacks.map(callback => {
    try {
      const result = callback.apply(scope, args || []);
      return { success: true, result };
    } catch (error) {
      logger.warn('ERROR in exec callback', error);
      return { success: false, error };
    }
  });
}

/**
 * 批量执行异步方法
 */
export function batchExecAsync(callbacks: AnyFunction<any>[], args?: any[], scope?: any): Promise<{
  success: boolean;
  result?: any;
  error?: Error;
}[]> {
  const promises = callbacks.map(async callback => {
    try {
      const result = await callback.apply(scope, args || []);
      return { success: true, result };
    } catch (error) {
      logger.warn('ERROR in exec callback', error);
      return { success: false, error };
    }
  });

  return Promise.all(promises);
}
