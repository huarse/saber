// 创建链式调用
// @author Pluto <huarse@gmail.com>
// @create 2019/12/30 14:17


export interface MiddlewareContext extends Record<string, any> {
  next: () => Promise<any>;
}

export type MiddlewareFunction = (ctx: MiddlewareContext) => Promise<any>;

/**
 * 创建链式调用
 * @param middlewares
 * @param scope
 */
export default function createApplyChain(middlewares: MiddlewareFunction[], scope?: any) {
  return async function (options: Record<string, any>) {
    let index = 0;
    return await ({
      ...options,

      async next(params?: Record<string, any>) {
        const fn = middlewares[index++];
        if (!fn) {
          return delete this.next, this;
        }
        return await fn.call(scope, this, params), this;
      }
    }).next();
  };
}
