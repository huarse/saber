// http upload
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/30 11:20

import { UploadOptons } from '../interfaces';
import fetcher from './fetcher';

export default async function upload(api: string, options: UploadOptons) {
  options = {
    payload: {},
    ...options,
  };

  let fd: FormData;

  if (options.payload instanceof FormData) {
    fd = options.payload;
    options.payload = {};
  } else {
    fd = new FormData();
  }

  let file = options.file;
  if (file instanceof File) {
    file = { name: 'file', file: file };
  }

  if (file && file.file) {
    fd.append(file.name || 'file', file.file);
  }

  if (typeof options.payload === 'object') {
    for (const name in options.payload) {
      if (Reflect.has(options.payload, name)) {
        const value = options.payload[name];
        fd.append(name, value);
      }
    }
  }

  const { file: _, payload, ...fetchOptions } = options;

  return fetcher(api, {
    method: 'POST',
    payload: fd,
    ...fetchOptions,
  });
}
