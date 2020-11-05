// utils test
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/28 00:48

import { serialize, parseJSON, isEmpty, noop, random, timestamp, uuid, keepProps, logger, sleep } from '../src';

test('#parseJSON', () => {
  expect(parseJSON('{ "a": 1001 }')).toHaveProperty('a', 1001);
  expect(parseJSON('aaa', true)).toBeNull();
  expect(parseJSON({ a: 1001 } as any)).toHaveProperty('a', 1001);
});

test('#serialize', () => {
  expect(serialize('a=1' as any)).toBe('a=1');
  expect(serialize({})).toBe('');
  expect(serialize({ a: 1001 })).toBe('a=1001');
  expect(serialize({ a: 1001, b: 2002 })).toBe('a=1001&b=2002');
  expect(serialize({ a: null, b: 2002 })).toBe('b=2002');
  expect(serialize({ a: null, b: 2002 }, true)).toBe('a=&b=2002');
  expect(serialize({ a: [], b: '', c: null, d: undefined  })).toBe('');
  expect(serialize({ a: [], b: '', c: null, d: undefined  }, true)).toBe('a=&b=&c=&d=');
  expect(serialize({ a: [11, 22, 33], b: 555 })).toBe('a%5B%5D=11&a%5B%5D=22&a%5B%5D=33&b=555');
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'JOIN')).toBe(`a=${encodeURIComponent('11,22,33')}&b=555`);
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'REPEAT')).toBe('a=11&a=22&a=33&b=555');
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

test('#random', () => {
  expect(typeof random()).toBe('number');
  expect(random()).toBeLessThanOrEqual(100);
  expect(random()).toBeGreaterThanOrEqual(0);
  expect(random(1000)).not.toEqual(random(1000));
  expect(random(10)).toBeLessThanOrEqual(10);
});

test('#timestamp', () => {
  expect(timestamp()).toMatch(/\d{2}:\d{2}:\d{2}\.\d{2,3}/);
});

test('#uuid', () => {
  const set = new Set();
  let flag = 10000;
  while (flag-- > 0) {
    set.add(uuid());
  }

  expect(set.size).toStrictEqual(10000);
});

test('#sleep', async () => {
  const start = Date.now();
  await sleep(1000);
  expect(Date.now() - start).toBeGreaterThan(1000)
}, 2000);

test('#keepProps', () => {
  const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  const obj1 = keepProps(obj, ['a', 'b', 'f']);
  const obj2 = keepProps(obj, ['a', 'b', 'c'], 'KICK');

  expect(obj1).toHaveProperty('a', 1);
  expect(obj1).toHaveProperty('b', 2);
  expect(obj1).not.toHaveProperty('c');
  expect(obj1).not.toHaveProperty('d');
  expect(obj1).not.toHaveProperty('e');
  expect(obj2).toHaveProperty('d', 4);
  expect(obj2).toHaveProperty('e', 5);
  expect(obj2).not.toHaveProperty('a');
  expect(obj2).not.toHaveProperty('b');
  expect(obj2).not.toHaveProperty('c');
});

test('#logger', () => {
  expect(typeof logger.debug).toBe('function');
  expect(typeof logger.error).toBe('function');
  expect(typeof logger.info).toBe('function');
  expect(typeof logger.line).toBe('function');
  expect(typeof logger.success).toBe('function');
  expect(typeof logger.warn).toBe('function');
});
