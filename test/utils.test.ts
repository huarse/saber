// utils test
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/28 00:48

import { serialize, parseJSON, isEmpty, noop, timestamp, logger, sleep, random, json2FormData } from '../src';

test('#parseJSON', () => {
  expect(parseJSON('{ "a": 1001 }')).toHaveProperty('a', 1001);
  expect(parseJSON('aaa')).toBeNull();
  expect(parseJSON({ a: 1001 } as any)).toHaveProperty('a', 1001);
});

test('#serialize', () => {
  expect(serialize('a=1' as any)).toBe('a=1');
  expect(serialize({})).toBe('');
  expect(serialize({ a: 1001 })).toBe('a=1001');
  expect(serialize({ a: 1001, b: 2002 })).toBe('a=1001&b=2002');
  expect(serialize({ a: null, b: 2002 })).toBe('b=2002');
  expect(serialize({ a: null, b: 2002 }, true)).toBe('a=&b=2002');
  expect(serialize({ a: [], b: '', c: null, d: undefined })).toBe('');
  expect(serialize({ a: [], b: '', c: null, d: undefined }, true)).toBe('a=&b=&c=&d=');
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'TILE')).toBe('a%5B%5D=11&a%5B%5D=22&a%5B%5D=33&b=555');
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'JOIN')).toBe(`a=${encodeURIComponent('11,22,33')}&b=555`);
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'REPEAT')).toBe('a=11&a=22&a=33&b=555');
  expect(serialize({ a: [11, 22, 33], b: 555 }, false)).toBe('a=11&a=22&a=33&b=555');
});

test('#isEmpty', () => {
  expect(isEmpty(null)).toBeTruthy();
  expect(isEmpty(undefined)).toBeTruthy();
  expect(isEmpty('')).toBeTruthy();
  expect(isEmpty(' ')).toBeFalsy();
  expect(isEmpty(false)).toBeFalsy();
  expect(isEmpty([])).toBeFalsy();
  expect(isEmpty(0)).toBeFalsy();
  expect(isEmpty(NaN)).toBeFalsy();
  expect(isEmpty({})).toBeFalsy();
});

test('#noop', () => {
  expect(typeof noop).toBe('function');
  expect(noop(1)).toBe(1);
});

test('#timestamp', () => {
  expect(timestamp()).toMatch(/\d{2}:\d{2}:\d{2}\.\d{2,3}/);
});

test('#sleep', async () => {
  const start = Date.now();
  await sleep(1000);
  expect(Date.now() - start).toBeGreaterThan(999);
}, 2000);

test('#logger', () => {
  expect(typeof logger.debug).toBe('function');
  expect(typeof logger.error).toBe('function');
  expect(typeof logger.info).toBe('function');
  expect(typeof logger.line).toBe('function');
  expect(typeof logger.success).toBe('function');
  expect(typeof logger.warn).toBe('function');
});

test('#random', () => {
  expect(random()).toBeGreaterThanOrEqual(0);
  expect(random()).toBeLessThanOrEqual(100);
  expect(random(100, 200)).toBeGreaterThanOrEqual(100);
  expect(random(100, 200)).toBeLessThanOrEqual(200);
});

test('#json2FormData', () => {
  expect(json2FormData({ a: 1001 }).get('a')).toBe('1001');
  expect(json2FormData({ a: 1001, b: 2002 }).get('a')).toBe('1001');
  expect(json2FormData({ a: null, b: 2002 }).get('b')).toBe('2002');
  expect(json2FormData({ a: null, b: 2002 }).get('a')).toBe('null');
});
