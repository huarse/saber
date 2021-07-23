// saber
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/30 12:28

import { Context, MiddlewareFunction, RequestOptions } from './interfaces';
import jsLoader, { JsLoaderOptions } from './abilities/jsloader';
import { fillOptions, adapter, delay, printLogger } from './middlewares';
import createApplyChain from './utils/apply-chain';

let instance = null;

export default class Saber<ExtendCtx extends Record<string, any>> {
  /** 加载 JS CDN 资源 */
  public static loadScript(src: string, options?: JsLoaderOptions) {
    return jsLoader(src, options);
  }

  /** 单例模式 */
  static singleton<ExtendCtx extends Record<string, any>>(): Saber<ExtendCtx> {
    if (instance) return instance;

    instance = new Saber<ExtendCtx>();
    return instance;
  }

  private _middlewares: MiddlewareFunction[] = [];
  private _middlewareMap = new Map<MiddlewareFunction, number>();
  private _invoker: (options: Record<string, any>) => Promise<Context & ExtendCtx>;

  constructor() {
    this._init();
  }

  private _init() {
    this.use(fillOptions, -1000);
    this.use(printLogger);
    this.use(delay);
    this.use(adapter, 1000);
  }

  /**
   * 添加中间件
   * @param middleware
   * @param order 调用顺序，默认按添加的顺序
   */
  public use(middleware: MiddlewareFunction, order: number = this._middlewares.length * 10) {
    if (typeof middleware !== 'function') {
      throw new TypeError('middleware must be a function.');
    }

    this._middlewares.push(middleware);
    this._middlewareMap.set(middleware, order);

    this._middlewares.sort((a, b) => {
      return this._middlewareMap.get(a) - this._middlewareMap.get(b);
    });

    this._invoker = undefined;
    return this;
  }

  run(api: string, options?: RequestOptions<ExtendCtx>) {
    if (options && Reflect.has(options, 'next')) {
      throw new Error('options can not contain property: \'next\'');
    }

    this._invoker = this._invoker || createApplyChain(this._middlewares, this);

    return this._invoker({ api, ...options || {}});
  }

  public async request(api: string, options?: RequestOptions<ExtendCtx>) {
    const { response } = await this.run(api, options);
    return response;
  }

  /** alias for request */
  invoke = this.request;

  /** 加载 JS CDN 资源 */
  public loadScript(src: string, options?: JsLoaderOptions) {
    return Saber.loadScript(src, options);
  }
}
