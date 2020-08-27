// some utils
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/28 00:12

export type BaseType = string | number | boolean;

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
 */
export function parseJSON(str: string): Record<string, any> {
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

/**
 * object serialize to query string
 * @param params
 * @param holdEmpty 是否保留空参数
 * @param listHandler 数组处理方式, TILE(默认): 平铺 a[]=1&a[]=2, REPEAT: 重复 a=1&a=2, JOIN: 用逗号连接 a=1,2,
 */
export function serialize(params: Record<string, BaseType | BaseType[]>, holdEmpty = false, listHandler: 'JOIN' | 'TILE' | 'REPEAT' = 'TILE'): string {
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
