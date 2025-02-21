# saber tools

![version](https://img.shields.io/npm/v/@irim/saber)
![license](https://img.shields.io/npm/l/@irim/saber)
![downloads](https://img.shields.io/npm/dw/@irim/saber)

A toolbox for http connect.

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

* logger 打印日志

```ts
import { logger } from '@irim/saber';

logger.debug('hello world~');
logger.info('hello world~');
logger.success('hello world~');
logger.warn('hello world~');
logger.error('hello world~');
logger.line('hello world~');
```

## CHANGELOG

<!-- - **version**: change logs -->
- **1.1.0**: 移除 socket 能力，fetcher 方法增加 `dataType` 参数
- **1.2.0**: 构建结果降级成 ES5
- **1.3.0**: 构建结果移除 dist

## LICENSE

BSD-3-Clause License

## Contact Us

[CAIHUAZHI](mailto:huarse@gmail.com)
