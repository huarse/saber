// ajax fetch for ds net
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/28 16:53

import { FetcherOptions } from '../interfaces';
import { serialize, json2FormData, keepProps } from '../utils/common';

const STATUS_MAP: Record<number, string> = {
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '408': 'Request Timeout',
  '410': 'Resources Gone',
  '422': 'Unprocessable Entity',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
};

const defaultConfig = {
  fetchError: '请求异常，请稍后再试。',
  parseError: '数据解析异常',
};

/**
 * ajax fetch method
 * @param api 接口 URL
 * @param options 请求参数
 * @param responseCallback 返回的数据处理，如果不传，默认按 ajax 方式处理
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
export default async function fetcher(
  api: string,
  options: FetcherOptions = {},
  responseCallback?: (res: Response, options: FetcherOptions) => any,
): Promise<any> {
  options = {
    method: options.method || 'GET',
    headers: options.headers || {},
    ...options,
  };

  // 解构参数，只保留 fetch 需要的参数
  const { data, payload, search, dataType, serializeOptions = {} as Record<string, any>, fetchErrorMessge } = options;
  const fetchOption: RequestInit = keepProps(options, [
    'body', 'cache', 'credentials', 'headers', 'integrity',
    'keepalive', 'method', 'mode', 'redirect', 'referrer',
    'referrerPolicy', 'signal',
  ], 'KEEP');

  // POST, PUT
  const isSender = /^p/i.test(options.method);
  // 用于 POST/PUT 请求中既有 data, 又有 payload 时，data 作为 search
  const searchParams = search || (!isSender || payload ? data : null);

  if (isSender) { // PUT, POST
    let sendData = payload || data;
    let isFormData = sendData instanceof FormData;
    const isPureData = sendData instanceof Blob || sendData instanceof ArrayBuffer;
    fetchOption.headers = { ...options.headers };

    // 手动将 json 转换为 formData
    if (dataType === 'formData' && !isFormData) {
      sendData = json2FormData(sendData as Record<string, any>);
      isFormData = true;
    }

    if (isPureData || typeof sendData === 'string') {
      fetchOption.body = sendData as BodyInit;
    }

    if (isFormData) {
      fetchOption.body = sendData as BodyInit;
      // formData 不能手动指定 content-type，否则在遇到文件上传场景时会报错
      // fetchOption.headers['Content-Type'] = 'multipart/form-data';
    } else if (isPureData) {
      fetchOption.body = sendData as BodyInit;
    } else {
      fetchOption.body = (typeof sendData === 'string' ? sendData : JSON.stringify(sendData)) as BodyInit;
      fetchOption.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }

  const connector = api.indexOf('?') > 0 ? '&' : '?';
  const url = searchParams ? `${api}${connector}${serialize(searchParams, serializeOptions.holdEmpty, serializeOptions.listHandler)}` : api;

  const res = await fetch(url, fetchOption).catch(error => {
    console.warn('ERROR in fetch: ', error);
    throw new Error(fetchErrorMessge || defaultConfig.fetchError);
  });

  if (res.status < 200 || res.status > 399) {
    throw new Error(res.statusText || STATUS_MAP[res.status] || `Fetch Error: ${res.status}`);
  }

  // 如果有自定义的处理方式，则直接调用
  if (typeof responseCallback === 'function') {
    return responseCallback(res, options);
  }

  return await res.json().catch(error => {
    console.warn('ERROR in res.json(): ', error);
    throw new Error(fetchErrorMessge || defaultConfig.parseError);
  });
}
