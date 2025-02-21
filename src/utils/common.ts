// some utils
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/28 00:12

import { ListHandlerType, LoggerTypes } from '../interfaces';

/** noop function */
export const noop = <T = any>(x: T): T => x;

/**
 * is empty object (null, undefined or empty string)
 * @param obj
 */
export function isEmpty(obj: any): boolean {
  return obj === null || obj === undefined || obj === '';
}

/**
 * safety parse JSON
 * @param str
 */
export function parseJSON<T = Record<string, any>>(str: string): T {
  if (typeof str === 'object') {
    return str;
  }

  try {
    return JSON.parse(str);
  } catch (ex) {
    console.warn('WARNING: error in parseJSON: ', ex);
    return null;
  }
}

const SHOW_LOG =
  /(\d+\.)|dev|daily|test|local|debug|mock|(\d{4,5})/.test(location.origin) ||
  /debug/.test(location.search) ||
  window.DEBUG ||
  window.IS_DEBUG;
const LOGGER_TYPES = [
  { color: '#9b9ea0', type: 'debug', valid: SHOW_LOG },
  { color: '#f15533', type: 'error', valid: true },
  { color: '#ff8a00', type: 'warn', valid: true },
  { color: '#ff00ff', type: 'line', valid: SHOW_LOG },
  { color: '#00c1de', type: 'info', valid: SHOW_LOG },
  { color: '#35b34a', type: 'success', valid: SHOW_LOG },
];

const numFmt = (n: number) => (n > 9 ? `${n}` : `0${n}`);

/**
 * 返回时间戳: HH:mm:ss.LLL
 */
export const timestamp = (d = new Date()) => {
  return `${numFmt(d.getHours())}:${numFmt(d.getMinutes())}:${numFmt(d.getSeconds())}.${d.getMilliseconds()}`;
};

/** 打印控制台日志 */
export const logger = (function (): LoggerTypes {
  const _factory =
    ({ type, color, valid }) =>
    (...args: any[]) => {
      const prefix = typeof args[0] === 'string' ? args.shift() : '';
      // eslint-disable-next-line
      valid && console.log(`%c%s%c【${type}】${prefix}`, 'color:#999', timestamp(), `color:${color}`, ...args);
    };

  return LOGGER_TYPES.reduce((prev, item) => {
    return (prev[item.type] = _factory(item)), prev;
  }, {} as LoggerTypes);
})();

/**
 * 睡眠一定时间
 * @param mill milliseconds
 */
export function sleep(mill: number): Promise<void> {
  if (!mill) return Promise.resolve();

  return new Promise((resolve) => {
    setTimeout(resolve, mill);
  });
}

/**
 * 返回一个整数随机数 [min, max] (包含 min and max)
 */
export function random(min?: number, max?: number): number {
  if (min === undefined && max === undefined) {
    min = 0;
    max = 100;
  }
  if (max === undefined) {
    max = min;
    min = 0;
  }
  // Math.random() -> [0, 1)
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * JSON 序列化
 * @param params
 * @param holdEmpty 是否保留空参数
 * @param listHandler 数组处理方式, 默认 `REPEAT`
 * - `TILE`: 平铺 `a[]=1&a[]=2`
 * - `REPEAT`: 重复 `a=1&a=2`
 * - `JOIN`: 用逗号连接 `a=1,2`
 */
export function serialize(
  params: Record<string, any> | string,
  holdEmpty = false,
  listHandler: ListHandlerType = 'REPEAT',
): string {
  if (typeof params === 'string') return params;

  return Object.keys(params)
    .reduce((prev, key) => {
      const value = params[key];
      const empty = isEmpty(value) || (Array.isArray(value) && !value.length); // 空数组也算空数据
      if (empty) {
        return holdEmpty ? `${prev}&${key}=` : prev;
      }

      if (!Array.isArray(value)) {
        return `${prev}&${key}=${encodeURIComponent(value)}`;
      }

      switch (listHandler) {
        case 'JOIN':
          return `${prev}&${key}=${encodeURIComponent(value.join(','))}`;
        case 'TILE':
          return `${prev}&${value.map((v) => `${key}%5B%5D=${encodeURIComponent(v)}`).join('&')}`;
        default:
          return `${prev}&${value.map((v) => `${key}=${encodeURIComponent(v)}`).join('&')}`;
      }
    }, '')
    .replace(/^&/, '');
}

/**
 * 从一个 JSON 对象中解析剔除无用的属性，返回指定的属性
 * @param obj
 * @param keys 要保留的属性
 */
export function keepProps<T = Record<string, any>>(obj: any, keys: Array<keyof T>): T {
  const newObj = {} as T;

  keys.forEach((key) => {
    if (!Reflect.has(obj, key)) return;
    newObj[key] = obj[key];
  });

  return newObj;
}

/**
 * 将 JSON 转化为 formData
 * @param obj JSON data
 */
export function json2FormData(obj: Record<string, any> = {}): FormData {
  if (obj instanceof FormData) {
    return obj;
  }

  const fd = new FormData();

  for (const key in obj) {
    if (Reflect.has(obj, key)) {
      const value = obj[key];
      fd.append(key, value);
    }
  }

  return fd;
}
