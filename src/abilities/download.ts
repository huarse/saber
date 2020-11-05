// download ability
// @author CAIHUAZHI <huarse@gmail.com>
// @create 2020/08/30 01:21

import { DownloadOptions } from '../interfaces';
import fetcher from './fetcher';

function getFilename(headers: Headers) {
  const disposition = headers.get('content-disposition') || '';
  return (disposition.match(/filename=(.+)$/i) || [])[1] || null;
}

export default function download(api: string, options: DownloadOptions) {
  return fetcher(api, options, async (response, options) => {
    const blob = await response.blob();
    const filename = options.filename || getFilename(response.headers);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    if (filename) {
      link.download = decodeURIComponent(filename);
    }
    link.click();
    URL.revokeObjectURL(link.href);
  });
}
