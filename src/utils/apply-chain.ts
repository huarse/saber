// 创建链式调用
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2019/12/30 14:17

import { MiddlewareFunction } from '../interfaces';

/**
 * 创建中间件链式调用
 * @param middlewares 中间件函数数组
 * @param scope 中间件执行上下文
 */
export default function createApplyChain(middlewares: MiddlewareFunction[], scope?: any) {
  return async function (options: Record<string, any>) {
    let index = 0;
    return await {
      ...options,

      async next(params?: Record<string, any>) {
        const fn = middlewares[index++];
        if (!fn) {
          return delete this.next, this;
        }
        return await fn.call(scope, this, params), this;
      },
    }.next();
  };
}
