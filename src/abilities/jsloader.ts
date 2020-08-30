// js loader
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/30 01:28

import { AnyFunction } from '../interfaces';
import { logger } from '../utils/common';

const CACHE_STORE = {};
const QUEUE_STORE: {
  [x: string]: { resolve: AnyFunction<any>, reject: AnyFunction<any>}[];
} = {};

export interface JsLoaderOptions extends Record<string, any> {
  timeout?: number;
  ignoreError?: boolean;
  cache?: boolean;
}

/** 加载 JS */
export default function jsLoader(src: string, options: JsLoaderOptions = {}) {
  options = {
    timeout: 20000,
    ignoreError: false,
    cache: true,
    ...options,
  };

  return new Promise((resolve, reject) => {
    const baseSrc = src.replace(/\?.*$/, '').replace(/^https?:/, '');

    if (options.cache && CACHE_STORE[baseSrc]) {
      logger.debug(`${baseSrc} load success from cache`);
      return resolve(304);
    }

    // 队列管理，防止重复请求
    if (QUEUE_STORE[baseSrc]) {
      logger.debug(`${baseSrc} is loading, add into queue...`);
      return QUEUE_STORE[baseSrc].push({ resolve, reject });
    }

    QUEUE_STORE[baseSrc] = [{ resolve, reject }];

    const handleError = (message) => {
      if (options.ignoreError) {
        QUEUE_STORE[baseSrc].forEach(x => x.resolve(0));
      } else {
        QUEUE_STORE[baseSrc].forEach(x => x.reject(new Error(message)));
      }
      QUEUE_STORE[baseSrc] = null;
    };

    let script = document.createElement('script');
    script.src = src;
    const begin = Date.now();

    let timmer = setTimeout(() => {
      script.onload = script.onerror = null;
      logger.warn(`${baseSrc} load timeout!`);
      handleError('Script Load Timeout!');
      clear();
    }, options.timeout);

    const clear = () => {
      clearTimeout(timmer), timmer = null;
      document.body.removeChild(script);
      script = undefined;
    };

    script.onload = () => {
      clear();
      options.cache && (CACHE_STORE[baseSrc] = true);
      logger.info(`${baseSrc} load success! use ${Date.now() - begin}ms`);
      QUEUE_STORE[baseSrc].forEach(x => x.resolve(200));
      QUEUE_STORE[baseSrc] = null;
    };

    script.onerror = () => {
      clear();
      logger.warn(`${baseSrc} load failed`);
      handleError('Script Load Failed!');
    };

    document.body.appendChild(script);
  });
}
