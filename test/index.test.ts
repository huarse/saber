// 测试用例
// @author Pluto <huarse@gmail.com>
// @create 2018/05/22

import 'isomorphic-fetch';
import Saber from '../src/index';

test('1 + 1 = 2', () => {
  expect(1 + 1).toBe(2);
});

test('#saber prototype', () => {
  expect(Saber.singleton).toStrictEqual(Saber.singleton);
  expect(typeof Saber.prototype.createSocket).toBe('function');
  expect(typeof Saber.prototype.loadScript).toBe('function');
  expect(typeof Saber.prototype.request).toBe('function');
  expect(typeof Saber.prototype.use).toBe('function');
});

test('#saber', async () => {
  const saber = Saber.singleton<{ foo?: string }>();
  const result1 = await saber.request('https://httpbin.org/get');

  expect(result1).toHaveProperty('args');

  const result2 = await saber.run('https://httpbin.org/post', {
    method: 'POST',
    data: { foo: 'bar' },
  });
  expect(result2).toHaveProperty('response');
  expect(result2.response).toHaveProperty('data', JSON.stringify({ foo: 'bar' }));

}, 20000);
