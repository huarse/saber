// 内置的中间件集合
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/30 11:38

import { Context } from './interfaces';
import { sleep, logger } from './utils/common';
import fetcher from './abilities/fetcher';
import jsonp from './abilities/jsonp';
import upload from './abilities/upload';
import download from './abilities/download';

const TYPE_MAPPING = {
  ajax: fetcher,
  fetcher: fetcher,
  jsonp,
  upload,
  download,
};

/** 填充参数 */
export async function fillOptions(ctx: Context) {
  ctx.type = ctx.type || 'ajax';
  ctx.data = ctx.data || ctx.params || ctx.query;
  ctx.headers = ctx.headers || {};
  ctx.meta = ctx.meta || {};
  ctx.origin = { api: ctx.api, data: ctx.data };

  await ctx.next();
}

/** delay middelware */
export async function delay(ctx: Context) {
  if (ctx.meta?.delay) {
    await sleep(ctx.meta.delay);
  }

  await ctx.next();
}

/** print logger middleware */
export async function printLogger(ctx: Context) {
  const begin = performance.now();
  logger.debug(`>>> ${ctx.type || 'net'} ${ctx.method || 'GET'} ${ctx.api || ctx.url}`, ctx.data);

  await ctx.next();

  const duration = performance.now() - begin;
  const logFn = ctx.response?.success === false ? 'warn' : 'info';

  logger[logFn](`<<< ${ctx.type || 'net'} ${ctx.method || 'GET'} ${ctx.api || ctx.url} ${duration}ms`, ctx.response);
}

/** fetch adapter middlewares */
export async function adapter(ctx: Context) {
  const fn = TYPE_MAPPING[ctx.type] || TYPE_MAPPING.ajax;

  ctx.response = await fn(ctx.api, ctx);
  return await ctx.next();
}
