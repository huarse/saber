// interfaces
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/28 16:57

/** 任意方法 */
export type AnyFunction<T> = (...args: any) => T;

export interface LoggerTypes {
  debug: AnyFunction<void>;
  success: AnyFunction<void>;
  info: AnyFunction<void>;
  warn: AnyFunction<void>;
  error: AnyFunction<void>;
  line: AnyFunction<void>;
}

/** 请求方法 */
export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTION' | 'PATCH';

/**
 * 序列化时，数组处理方式
 * - TILE: 平铺 `a[]=1&a[]=2`
 * - REPEAT: 重复 `a=1&a=2`
 * - JOIN: 用逗号连接 `a=1,2`
 */
export type ListHandlerType = 'JOIN' | 'TILE' | 'REPEAT';

/** 数据请求方法 fetcher 的参数 */
export interface FetcherOptions extends Record<string, any> {
  /** 请求参数或发送的数据 */
  data?: Record<string, any> | FormData | string;
  /** 发送的数据，仅用于 PUT/POST 请求 */
  payload?: Record<string, any> | FormData | string;
  /** 补充参数，用于 POST/PUT 请求需要带上 url search 参数的场景 */
  search?: Record<string, any>;
  /** 请求方法，默认是 GET */
  method?: FetchMethod;
  /** 传输数据类型 (仅 put|post 有效)，默认是 json */
  dataType?: 'json' | 'formData';
  /** 请求头 */
  headers?: Record<string, any>;
  /** cookie 凭证发送策略, default: same-origin */
  credentials?: RequestCredentials;
  /** url search 参数序列化选项 */
  serializeOptions?: {
    /** 是否保留空的参数，默认 false */
    holdEmpty?: boolean;
    /** 数组处理方式 */
    listHandler?: ListHandlerType;
  };
  /** fetch 出错时的默认错误信息 */
  fetchErrorMessage?: string;
}

export interface JsonpOptions extends FetcherOptions {
  /** [jsonp] callback method name */
  callback?: string;
  /** [jsonp] callback method key, default is 'callback' */
  jsonpCallback?: string;
  /** [jsonp] request timeout */
  timeout?: number;
}

export interface DownloadOptions extends FetcherOptions {
  /** [download] download filename */
  filename?: string;
}

export interface UploadOptions extends FetcherOptions {
  /** [upload] upload file or use payload.file */
  file: File | { name: string; file: File };
}

export interface Context extends FetcherOptions {
  api: string;
  /** alias of api */
  url?: string;
  /** 请求类型，默认 ajax */
  type?: 'ajax' | 'jsonp' | 'upload' | 'download';
  /** 执行下一个中间件方法 */
  next: AnyFunction<Promise<any>>;
  /** [middleware] 元信息，用于一些中间件 */
  meta?: {
    /** 延迟执行，单位毫秒 */
    delay?: number;
    [x: string]: any;
  };
  /** 返回数据 */
  response?: any;
  /** 原信息，用于备份 */
  origin?: Record<string, any>;
}

export type MiddlewareFunction = (ctx: Context) => Promise<any>;

/** 数据请求参数 */
export type RequestOptions<ExtendCtx extends Record<string, any>> = Partial<Context & ExtendCtx>;

// ---------------------------------
declare global {
  interface Window {
    DEBUG: boolean;
    IS_DEBUG: boolean;
  }
}
