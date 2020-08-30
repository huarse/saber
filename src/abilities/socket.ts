// websocket for ds net
// @author Pluto <huarse@gmail.com>
// @create 2020/01/03 11:19
// 测试链接: wss://echo.websocket.org

import { AnyFunction } from '../interfaces';
import { parseJSON, logger } from '../utils/common';
import { batchExecAsync, batchExecSync } from '../utils/batch-exec';

export interface SocketProps extends Record<string, any> {
  /** connect url */
  url?: string;
  /** websocket protocol */
  protocols?: string | string[];
  /** timeout of connect websocket */
  timeout?: number;
  /** response message type */
  dataType?: 'json' | 'text' | 'blob';
  /** callback function type */
  callbackType?: 'sync' | 'async';
}

export type ReadyState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNKNOWN';

const SOCKET = Symbol('SocketConnect.socket');
const MESSAGE_HANDLER = Symbol('SocketConnect.messageHandler');
const BIND_MESSAGE_EVENT = Symbol('SocketConnect.bindMessageEvent');
const READY_STATE_MAPPING: ReadyState[] = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

export default class Socket {
  static CONNECTING = WebSocket.CONNECTING;
  static OPEN = WebSocket.OPEN;
  static CLOSING = WebSocket.CLOSING;
  static CLOSED = WebSocket.CLOSED;

  [SOCKET]: WebSocket;

  [MESSAGE_HANDLER]: AnyFunction<any>[] = [];

  props: SocketProps = {};

  constructor(props: SocketProps) {

    this.props = {
      timeout: 20000,
      dataType: 'json',
      callbackType: 'sync',
      ...props,
    };
  }

  /**
   * Returns the state of the WebSocket object's connection.
   * It can have the values described below.
   */
  get readyState(): number {
    return this[SOCKET].readyState;
  }

  /**
   * Return socket ready state desc
   */
  get readyStateName(): ReadyState {
    return READY_STATE_MAPPING[this.readyState] || 'UNKNOWN';
  }

  /**
   * Returns a string that indicates how binary data from the WebSocket object is exposed to scripts:
   *
   * Can be set, to change how binary data is returned. The default is "blob".
   */
  get binaryType(): BinaryType {
    return this[SOCKET].binaryType;
  }

  /**
   * Returns the subprotocol selected by the server, if any.
   * It can be used in conjunction with the array form of the constructor's
   * second argument to perform subprotocol negotiation.
   */
  get protocol(): string {
    return this[SOCKET].protocol;
  }

  /** Returns the extensions selected by the server, if any. */
  get extensions(): string {
    return this[SOCKET].extensions;
  }

  /**
   * Returns the number of bytes of application data (UTF-8 text and binary data)
   * that have been queued using send() but not yet been transmitted to the network.
   *
   * If the WebSocket connection is closed, this attribute's value will only
   * increase with each call to the send() method.
   * (The number does not reset to zero once the connection closes.)
   */
  get bufferedAmount(): number {
    return this[SOCKET].bufferedAmount;
  }

  /** open socket */
  open(timeout = this.props.timeout): Promise<this> {
    return new Promise((resolve, reject) => {
      let timmer = null;

      const start = performance.now();
      logger.debug(`Connecting ${this.props.url} ...`);
      this[SOCKET] = new WebSocket(this.props.url, this.props.protocols);

      this[SOCKET].onopen = (e) => {
        logger.success(`Connected ${this.props.url}`, performance.now() - start);
        timmer && clearTimeout(timmer);
        this[BIND_MESSAGE_EVENT]();
        resolve(this);
      };
      this[SOCKET].onerror = (e) => {
        logger.warn(`Connecting Error: ${this.props.url}`, e);
        timmer && clearTimeout(timmer);
        reject(e);
      };
      timmer = setTimeout(() => {
        logger.warn(`Connecting Timeout: ${this.props.url}`);
        this[SOCKET].onopen = this[SOCKET].onerror = null;
        reject(new Error('Connect Timeout'));
        timmer = null;
      }, timeout);
    });
  }

  /** alias of open */
  connect(timeout: number) {
    return this.open(timeout);
  }

  close(): Promise<any> {
    return new Promise((resolve, reject) => {
      this[SOCKET].close();
      this[SOCKET].onclose = (e) => {
        logger.debug(`Connect closed. ${this.props.url}`);
        this.clear();
        resolve(e);
      };
      this[SOCKET].onerror = (e) => {
        logger.warn(`Connecting close failed: ${this.props.url}`, e);
        reject(e);
      };
    });
  }

  /** alias of close */
  disconnect() {
    return this.close();
  }

  async reconnect() {
    await this.close();
    return await this.open();
  }

  postMessage(message: string) {
    if (typeof message !== 'string') {
      throw new TypeError('message must be a string.');
    }
    this[SOCKET].send(message);
  }

  sendMessage(message: string | Record<string, any>) {
    const content = typeof message === 'string' ? message : JSON.stringify(message);
    this[SOCKET].send(content);
  }

  /** alias for postMessage */
  sendString(str: string) {
    return this.postMessage(str);
  }

  sendBlob(blob: Blob) {
    this[SOCKET].send(blob);
  }

  sendArrayBuffer(buffer: ArrayBuffer | SharedArrayBuffer | ArrayBufferView) {
    this[SOCKET].send(buffer);
  }

  /**
   * @param eventName
   * @param callback
   * @return off event function
   */
  on(
    eventName: 'message' | 'close' | 'error' | 'open',
    callback: AnyFunction<any>,
  ): () => any {
    this[SOCKET].addEventListener(eventName, callback);

    return () => this[SOCKET].removeEventListener(eventName, callback);
  }

  onMessage(callback: AnyFunction<any>) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    this[MESSAGE_HANDLER].push(callback);

    return () => {
      const index = this[MESSAGE_HANDLER].findIndex(callback);
      this[MESSAGE_HANDLER].splice(index, 1);
    };
  }

  [BIND_MESSAGE_EVENT]() {
    this[SOCKET].onmessage = (e) => {
      let data = e.data;
      if (this.props.dataType === 'json') {
        data = parseJSON(data);
      }

      if (this.props.callbackType === 'sync') {
        batchExecSync(this[MESSAGE_HANDLER], [data], this);
      } else {
        batchExecAsync(this[MESSAGE_HANDLER], [data], this);
      }
    };
  }

  clear() {
    this[MESSAGE_HANDLER] = [];
  }
}
