// utils test
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/28 00:48

import { serialize, parseJSON } from '../src/utils/common';

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
  expect(serialize({ a: [], b: '', c: null, d: undefined  })).toBe('');
  expect(serialize({ a: [], b: '', c: null, d: undefined  }, true)).toBe('a=&b=&c=&d=');
  expect(serialize({ a: [11, 22, 33], b: 555 })).toBe('a%5B%5D=11&a%5B%5D=22&a%5B%5D=33&b=555');
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'JOIN')).toBe(`a=${encodeURIComponent('11,22,33')}&b=555`);
  expect(serialize({ a: [11, 22, 33], b: 555 }, false, 'REPEAT')).toBe('a=11&a=22&a=33&b=555');
});
