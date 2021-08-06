// abilities unit test
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/28 17:47

import 'isomorphic-fetch';
import fetcher from '../src/abilities/fetcher';

test('#fetcher', async () => {
  const [result1, result2, result3, result4, result5, result6] = await Promise.all([
    fetcher('https://httpbin.org/get'),
    fetcher('https://httpbin.org/get', {
      data: { id: 1001 },
    }),
    fetcher('https://httpbin.org/post', {
      method: 'POST',
      payload: { foo: 'bar' },
    }),
    fetcher('https://httpbin.org/put', {
      method: 'PUT',
      search: { id: 1001 },
      payload: { foo: 'bar' },
    }),
    fetcher('https://httpbin.org/delete', {
      method: 'DELETE',
      data: { id: 1001 },
    }),
    fetcher('https://httpbin.org/delete', {
      method: 'DELETE',
      data: { id: 1001 },
      payload: { foo: 'bar' },
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ]);

  expect(result1).toHaveProperty('headers');
  expect(result2.args).toHaveProperty('id', '1001');
  expect(result3).toHaveProperty('data', JSON.stringify({ foo: 'bar' }));
  expect(result4.args).toHaveProperty('id', '1001');
  expect(result4).toHaveProperty('data', JSON.stringify({ foo: 'bar' }));
  expect(result5.args).toHaveProperty('id', '1001');
  expect(result6.json).toHaveProperty('foo', 'bar');
}, 20000);
