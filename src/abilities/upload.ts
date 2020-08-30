// http upload
// @author MOYAN <moyan@come-future.com>
// @create 2020/08/30 11:20
// TODO 多文件上传需要优化

import { UploadOptons } from '../interfaces';
import fetcher from './fetcher';

export default async function upload(api: string, options: UploadOptons) {
  options = {
    payload: {},
    ...options,
  };

  let formData = new FormData();

  if (options.payload instanceof FormData) {
    formData = options.payload;
    options.payload = {};
  }

  let file = options.file;
  if (file instanceof File) {
    file = { name: 'file', file: file };
  }

  if (file && file.file) {
    formData.append(file.name || 'file', file.file);
  }

  if (typeof options.payload === 'object') {
    for (const name in options.payload) {
      if (Object.prototype.hasOwnProperty.call(options.payload, name)) {
        const value = options.payload[name];
        formData.append(name, value);
      }
    }
  }

  const { file: file2, payload, ...fetchOptions } = options;

  return fetcher(api, {
    method: 'POST',
    payload: formData,
    ...fetchOptions,
  });
}
