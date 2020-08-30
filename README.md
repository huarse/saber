# saber tools

![version](https://img.shields.io/npm/v/@irim/saber)
![license](https://img.shields.io/npm/l/@irim/saber)
![downloads](https://img.shields.io/npm/dw/@irim/saber)

<!-- 一句话描述 -->

## Getting Started

- `$ npm install @irim/saber --save`

```ts
import Saber from '@irim/saber';

const saber = new Saber(); // or saber = Saber.singleton()
saber.request('https://httpbin.org/post', {
  method: 'POST',
  data: { foo: 'bar' },
}).then(response => {
  console.log('> response: ', response);
});
```

## Advanced

```ts
import Saber from '@irim/saber';

const saber = new Saber();
// add a middleware
saber.use(async ctx => {
  console.log('>>>> before...');
  await ctx.next();
  console.log('>>> after ...');
});
```

## API

### 工具类方法

1. serialize 参数序列化

```ts
import { serialize } from '@irim/saber';

serialize({ a: 1001, b: 'foo' }); // a=1001&b=foo
serialize({ a: [100, 200] }); // a[]=100&a[]=200
serialize({ a: [100, 200] }, false, 'JOIN'); // a=100,200
serialize({ a: [100, 200] }, false, 'REPEAT'); // a=100&a=200
```

2. parseJSON 解析 JSON 字符串

```ts
import { parseJSON } from '@irim/saber';

parseJSON('{ "a": 1001 }'); // { a: 1001 }
parseJSON('invalid string'); // null
```

3. random 返回范围内的随机整数

```ts
import { random } from '@irim/saber';

random(); // 0 ~ 100
random(50); // 0 ~ 50
random(25, 75); // 25 ~ 75
```

4. uuid 返回一个唯一的 guid

```ts
import { uuid } from '@irim/saber';

uuid(); // unique string, never repeat
```

5. logger 打印日志

```ts
import { logger } from '@irim/saber';

logger.debug('hello world~');
logger.error('hello world~');
logger.info('hello world~');
logger.line('hello world~');
logger.success('hello world~');
logger.warn('hello world~');
```

## CHANGELOG

<!-- - **version**: change logs -->

## LICENSE

BSD-3-Clause License

## Contact Us

[Pluto](mailto:huarse@gmail.com)
