// some utils
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/28 00:12

import { BaseType, ListHandlerType, LoggerTypes, } from '../interfaces';

/** noop function */
export const noop = (x: any) => x;

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
 * @param silent 是否不打印错误日志
 */
export function parseJSON(str: string, silent = false): Record<string, any> {
  if (typeof str === 'object') {
    return str;
  }

  try {
    return JSON.parse(str);
  } catch (ex) {
    !silent && console.warn('WARNING: error in parseJSON: ', ex);
    return null;
  }
}

const SHOW_LOG = /(\d+\.)|dev|daily|test|local|debug|mock|(\d{4,5})/.test(location.origin) || /debug/.test(location.search) || window.DEBUG || window.IS_DEBUG;
const LOGGER_TYPES = [
  { color: '#9b9ea0', type: 'debug', valid: SHOW_LOG },
  { color: '#f15533', type: 'error', valid: true },
  { color: '#ff8a00', type: 'warn', valid: true },
  { color: '#ff00ff', type: 'line', valid: SHOW_LOG },
  { color: '#00c1de', type: 'info', valid: SHOW_LOG },
  { color: '#35b34a', type: 'success', valid: SHOW_LOG },
];

const numFmt = (n: number) => n > 9 ? `${n}` : `0${n}`;

/**
 * 返回时间戳: HH:mm:ss.LLL
 */
export const timestamp = (d = new Date()) => {
  return `${numFmt(d.getHours())}:${numFmt(d.getMinutes())}:${numFmt(d.getSeconds())}.${d.getMilliseconds()}`;
};

/** 打印控制台日志 */
export const logger = function (): LoggerTypes {
  const _factory = ({ type, color, valid }) => (...args: any[]) => {
    const prefix = typeof args[0] === 'string' ? args.shift() : '';
    // eslint-disable-next-line
    valid && console.log(`%c%s%c【${type}】${prefix}`, 'color:#999', timestamp(), `color:${color}`, ...args);
  };

  return LOGGER_TYPES.reduce((prev, item) => {
    return prev[item.type] = _factory(item), prev;
  }, {} as LoggerTypes);
}();

/**
 * 创建一个uuid
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16).toUpperCase();
  });
}

/**
 * 睡眠一定时间
 * @param mill millseconds
 */
export function sleep(mill: number): Promise<void> {
  if (!mill) return Promise.resolve();

  return new Promise((resolve) => {
    setTimeout(resolve, mill);
  });
}

/**
 * Return a random integer of [min, max] (inclusive min and max)
 */
export function random(min?: number, max?: number): number {
  if (min === undefined && max === undefined) {
    min = 0;
    max = 100;
  } if (max === undefined) {
    max = min;
    min = 0;
  }
  // Math.random() -> [0, 1)
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * object serialize to query string
 * @param params
 * @param holdEmpty 是否保留空参数
 * @param listHandler 数组处理方式, 默认 TILE
 */
export function serialize(
  params: Record<string, BaseType | BaseType[]> | string,
  holdEmpty = false,
  listHandler: ListHandlerType = 'TILE'
): string {
  if (typeof params === 'string') return params;

  return Object.keys(params).reduce((prev, key) => {
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
      case 'REPEAT':
        return `${prev}&${value.map(v => `${key}=${encodeURIComponent(v)}`).join('&')}`;
      case 'TILE':
      default:
        return `${prev}&${value.map(v => `${key}%5B%5D=${encodeURIComponent(v)}`).join('&')}`;
    }

  }, '').replace(/^&/, '');
}

/**
 * 从一个 json 对象中解析剔除无用的属性
 * @param obj
 * @param keys 要操作的属性
 * @param mode KEEP(默认): 保留 keys，KICK 剔除 keys
 * @return 返回一个新的对象
 */
export function keepProps(obj: Record<string, any>, keys: string[], mode: 'KEEP' | 'KICK' = 'KEEP'): Record<string, any> {
  const newObj: Record<string, any> = mode === 'KEEP' ? {} : { ...obj };

  keys.forEach(key => {
    if (!Reflect.has(obj, key)) return;

    if (mode === 'KEEP') {
      newObj[key] = obj[key];
    } else {
      Reflect.deleteProperty(newObj, key);
    }
  });

  return newObj;
}
