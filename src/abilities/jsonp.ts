// jsonp ability
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/30 01:45

import { JsonpOptions } from '../interfaces';
import { serialize } from '../utils/common';

let CALLBACK_ID = Math.round(Date.now() * Math.random());

const defaultConfig = {
  errorMessage: 'Request Failed!',
  timeoutMessage: 'Request Timeout!',
  timeout: 20000,
};

/**
 *
 * @param api script url
 * @param options jsonp options
 */
export default function jsonp (api: string, options: JsonpOptions) {
  options = {
    callback: `jsonp__${CALLBACK_ID++}`,
    jsonpCallcack: 'callback',
    timeout: defaultConfig.timeout,
    ...options,
  };

  const search: Record<string, any> = options.search || options.data || options.query || options.params || {};
  const callback: string = search[options.jsonpCallcack] || options.callback;
  search[options.jsonpCallcack] = callback;

  return new Promise((resolve, reject) => {
    const tmp = api.indexOf('?') > -1 ? '&' : '?';

    let script = document.createElement('script');
    script.src = `${api}${tmp}${serialize(options.query)}`;

    let timmer = setTimeout(() => {
      script.onload = script.onerror = null;
      reject(new Error(defaultConfig.timeoutMessage));
      clear();
    }, options.timeout);

    const clear = () => {
      clearTimeout(timmer), timmer = null;
      document.body.removeChild(script);
      (<any>window)[callback] = () => console.warn(`callback ${callback} has been destroyed!`);
      script = undefined;
    };

    script.onload = () => clear();
    script.onerror = () => {
      clear();
      reject(new Error(defaultConfig.errorMessage));
    };

    (<any>window)[callback] = (data: any) => resolve(data);
    document.body.appendChild(script);
  });
}
